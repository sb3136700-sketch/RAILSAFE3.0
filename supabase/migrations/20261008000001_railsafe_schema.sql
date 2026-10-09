-- =============================================================================
-- RAILSAFE 2.0 MASTER DATABASE SCHEMA (Supabase PostgreSQL)
-- Implements complete 22-table architecture, Row Level Security (RLS),
-- Automated Profile Provisioning, and Anti-Privilege Escalation Triggers.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'passenger' CHECK (role IN ('passenger', 'operator', 'responder')),
  badge_number TEXT,
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users view own profile') THEN
    CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Staff view all profiles') THEN
    CREATE POLICY "Staff view all profiles" ON public.profiles FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'responder'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users update own profile') THEN
    CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- 2. AUTOMATIC PROFILE PROVISIONING TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    'passenger'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(public.profiles.name, EXCLUDED.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. ANTI-PRIVILEGE ESCALATION TRIGGER (Prevent self-promotion to operator)
CREATE OR REPLACE FUNCTION public.prevent_self_role_elevation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'operator'
    ) THEN
      RAISE EXCEPTION 'Access Denied: You cannot modify your own role or assign administrative privileges.';
    END IF;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_elevation ON public.profiles;
CREATE TRIGGER trg_prevent_role_elevation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_elevation();

-- 4. EMERGENCY CONTACTS
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  enabled_for_sos BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_contacts' AND policyname = 'Users manage own emergency contacts') THEN
    CREATE POLICY "Users manage own emergency contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 5. SAFETY INCIDENTS / REPORTS
CREATE TABLE IF NOT EXISTS public.safety_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reporter_name TEXT NOT NULL,
  reporter_phone TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'harassment', 'theft', 'suspicious_activity', 'medical', 
    'overcrowding', 'facility_damage', 'accessibility', 'lost_property', 'other'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  train_number TEXT,
  train_name TEXT,
  coach TEXT,
  seat TEXT,
  station TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'under_review', 'assigned', 'in_progress', 'escalated', 'resolved'
  )),
  ai_classification JSONB,
  operator_notes TEXT,
  assigned_responder_id UUID REFERENCES public.profiles(id),
  assigned_department TEXT,
  is_escalated BOOLEAN DEFAULT FALSE,
  escalation_reason TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  contact_preference TEXT DEFAULT 'in_app' CHECK (contact_preference IN ('call', 'sms', 'in_app')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE public.safety_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safety_reports' AND policyname = 'Passengers view own safety reports') THEN
    CREATE POLICY "Passengers view own safety reports" ON public.safety_reports FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safety_reports' AND policyname = 'Staff manage all safety reports') THEN
    CREATE POLICY "Staff manage all safety reports" ON public.safety_reports FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'responder'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'safety_reports' AND policyname = 'Passengers insert own safety reports') THEN
    CREATE POLICY "Passengers insert own safety reports" ON public.safety_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 6. SAFETY REPORT EVIDENCE
CREATE TABLE IF NOT EXISTS public.safety_report_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.safety_reports(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.safety_report_evidence ENABLE ROW LEVEL SECURITY;

-- 7. INCIDENT AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.incident_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.safety_reports(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.incident_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'incident_audit_logs' AND policyname = 'Operators view audit logs') THEN
    CREATE POLICY "Operators view audit logs" ON public.incident_audit_logs FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'responder'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'incident_audit_logs' AND policyname = 'Users append audit logs') THEN
    CREATE POLICY "Users append audit logs" ON public.incident_audit_logs FOR INSERT WITH CHECK (auth.uid() = actor_id);
  END IF;
END $$;

-- 8. INCIDENT ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.incident_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.safety_reports(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES public.profiles(id),
  assigned_by UUID NOT NULL REFERENCES public.profiles(id),
  department TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ
);
ALTER TABLE public.incident_assignments ENABLE ROW LEVEL SECURITY;

-- 9. INCIDENT STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.incident_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.safety_reports(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES public.profiles(id),
  from_status TEXT,
  to_status TEXT NOT NULL,
  change_notes TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.incident_status_history ENABLE ROW LEVEL SECURITY;

-- 10. SOS EVENTS
CREATE TABLE IF NOT EXISTS public.sos_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT,
  category TEXT NOT NULL DEFAULT 'urgent_assistance',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  initial_lat DOUBLE PRECISION,
  initial_lng DOUBLE PRECISION,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  location_accuracy DOUBLE PRECISION,
  location_updated_at TIMESTAMPTZ,
  train_number TEXT,
  coach_seat TEXT,
  share_token TEXT UNIQUE NOT NULL,
  share_expires_at TIMESTAMPTZ NOT NULL,
  sms_delivery_status TEXT DEFAULT 'queued',
  sms_recipients_count INT DEFAULT 0,
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sos_events' AND policyname = 'Passengers view own SOS events') THEN
    CREATE POLICY "Passengers view own SOS events" ON public.sos_events FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sos_events' AND policyname = 'Staff manage SOS events') THEN
    CREATE POLICY "Staff manage SOS events" ON public.sos_events FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'responder'))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sos_events' AND policyname = 'Passengers insert own SOS events') THEN
    CREATE POLICY "Passengers insert own SOS events" ON public.sos_events FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sos_events' AND policyname = 'Passengers update own SOS events') THEN
    CREATE POLICY "Passengers update own SOS events" ON public.sos_events FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- 11. SOS LOCATION UPDATES
CREATE TABLE IF NOT EXISTS public.sos_location_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sos_event_id UUID NOT NULL REFERENCES public.sos_events(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.sos_location_updates ENABLE ROW LEVEL SECURITY;

-- 12. SOS SHARE TOKENS
CREATE TABLE IF NOT EXISTS public.sos_share_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sos_event_id UUID NOT NULL REFERENCES public.sos_events(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.sos_share_tokens ENABLE ROW LEVEL SECURITY;

-- 13. SOS MESSAGE LOGS
CREATE TABLE IF NOT EXISTS public.sos_message_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sos_event_id UUID NOT NULL REFERENCES public.sos_events(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  delivery_status TEXT NOT NULL,
  error_details TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.sos_message_logs ENABLE ROW LEVEL SECURITY;

-- 14. SAVED JOURNEYS
CREATE TABLE IF NOT EXISTS public.saved_journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  train_number TEXT NOT NULL,
  train_name TEXT NOT NULL,
  from_station TEXT NOT NULL,
  to_station TEXT NOT NULL,
  journey_date DATE NOT NULL,
  pnr TEXT,
  coach TEXT,
  seat TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.saved_journeys ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_journeys' AND policyname = 'Users manage own journeys') THEN
    CREATE POLICY "Users manage own journeys" ON public.saved_journeys FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- 15. SAVED STATIONS
CREATE TABLE IF NOT EXISTS public.saved_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  station_code TEXT NOT NULL,
  station_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.saved_stations ENABLE ROW LEVEL SECURITY;

-- 16. JOURNEY ALERTS
CREATE TABLE IF NOT EXISTS public.journey_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  train_number TEXT NOT NULL,
  station_code TEXT NOT NULL,
  station_name TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  is_triggered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.journey_alerts ENABLE ROW LEVEL SECURITY;

-- 17. LOST ITEMS
CREATE TABLE IF NOT EXISTS public.lost_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reporter_name TEXT NOT NULL,
  item_type TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT,
  train_number TEXT,
  station_or_coach TEXT,
  loss_date DATE NOT NULL,
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'matched', 'claimed', 'closed')),
  match_score INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.lost_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lost_items' AND policyname = 'Users view own lost reports') THEN
    CREATE POLICY "Users view own lost reports" ON public.lost_items FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lost_items' AND policyname = 'Staff manage lost items') THEN
    CREATE POLICY "Staff manage lost items" ON public.lost_items FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('operator', 'responder'))
    );
  END IF;
END $$;

-- 18. FOUND ITEMS
CREATE TABLE IF NOT EXISTS public.found_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id TEXT UNIQUE NOT NULL,
  found_by_staff_id UUID REFERENCES public.profiles(id),
  item_type TEXT NOT NULL,
  description TEXT NOT NULL,
  station_location TEXT NOT NULL,
  found_date DATE NOT NULL,
  status TEXT DEFAULT 'unclaimed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;

-- 19. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link_route TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 20. CHAT SESSIONS & MESSAGES (AI Assistant history)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Safety & Travel Chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 21. LOCATION SHARES & JOURNEY TRACKING
CREATE TABLE IF NOT EXISTS public.location_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.location_shares ENABLE ROW LEVEL SECURITY;

-- 22. INCIDENT AUTOMATION EVENTS & USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.incident_automation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.safety_reports(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.incident_automation_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'dark',
  emergency_sms_enabled BOOLEAN DEFAULT TRUE,
  arrival_alerts_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
