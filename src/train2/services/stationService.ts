import { MAJOR_STATIONS } from '../data/trainsData';

export interface StationFacilityData {
  stationCode: string;
  stationName: string;
  city: string;
  state: string;
  platforms: number;
  latitude: number;
  longitude: number;
  facilities: {
    restroom: boolean;
    food: boolean;
    waitingRoom: boolean;
    atm: boolean;
    parking: boolean;
    medical: boolean;
    taxi: boolean;
    auto: boolean;
    accessibility: boolean;
    wifi: boolean;
    water: boolean;
    cloakRoom: boolean;
    executiveLounge: boolean;
  };
  navigationLinks: {
    directionsUrl: string;
    hospitalUrl: string;
    restaurantUrl: string;
    hotelUrl: string;
    cabUrl: string;
    autoUrl: string;
  };
}

export const VERIFIED_STATIONS_DATA: StationFacilityData[] = [
  {
    stationCode: 'NDLS',
    stationName: 'New Delhi Railway Station',
    city: 'New Delhi',
    state: 'Delhi',
    platforms: 16,
    latitude: 28.6429,
    longitude: 77.2195,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=New+Delhi+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+New+Delhi+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+New+Delhi+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'CNB',
    stationName: 'Kanpur Central',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    platforms: 10,
    latitude: 26.4547,
    longitude: 80.3507,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Kanpur+Central+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+Kanpur+Central+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+Kanpur+Central+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'BSB',
    stationName: 'Varanasi Junction',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    platforms: 9,
    latitude: 25.3283,
    longitude: 82.9868,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Varanasi+Junction+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+Varanasi+Junction+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+Varanasi+Junction+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'MMCT',
    stationName: 'Mumbai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    platforms: 8,
    latitude: 18.9696,
    longitude: 72.8194,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Mumbai+Central+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+Mumbai+Central+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+Mumbai+Central+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'MAS',
    stationName: 'MGR Chennai Central',
    city: 'Chennai',
    state: 'Tamil Nadu',
    platforms: 17,
    latitude: 13.0827,
    longitude: 80.2757,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=MGR+Chennai+Central+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+MGR+Chennai+Central+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+MGR+Chennai+Central+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'CBE',
    stationName: 'Coimbatore Junction',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    platforms: 6,
    latitude: 11.0016,
    longitude: 76.9664,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: false,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Coimbatore+Junction+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+Coimbatore+Junction+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+Coimbatore+Junction+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'SBC',
    stationName: 'KSR Bengaluru City',
    city: 'Bengaluru',
    state: 'Karnataka',
    platforms: 10,
    latitude: 12.9774,
    longitude: 77.5684,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=KSR+Bengaluru+City+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+KSR+Bengaluru+City+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+KSR+Bengaluru+City+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
  {
    stationCode: 'HWH',
    stationName: 'Howrah Junction',
    city: 'Kolkata',
    state: 'West Bengal',
    platforms: 23,
    latitude: 22.5855,
    longitude: 88.3412,
    facilities: {
      restroom: true,
      food: true,
      waitingRoom: true,
      atm: true,
      parking: true,
      medical: true,
      taxi: true,
      auto: true,
      accessibility: true,
      wifi: true,
      water: true,
      cloakRoom: true,
      executiveLounge: true,
    },
    navigationLinks: {
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Howrah+Junction+Railway+Station',
      hospitalUrl: 'https://www.google.com/maps/search/hospitals+near+Howrah+Junction+Railway+Station',
      restaurantUrl: 'https://www.google.com/maps/search/restaurants+near+Howrah+Junction+Railway+Station',
      hotelUrl: 'https://www.rr.irctc.co.in/',
      cabUrl: 'https://www.olacabs.com',
      autoUrl: 'https://www.rapido.bike',
    },
  },
];

export function getStationDetails(query: string): StationFacilityData | null {
  const q = query.trim().toLowerCase();
  if (!q) return VERIFIED_STATIONS_DATA[0];

  const found = VERIFIED_STATIONS_DATA.find(
    (s) =>
      s.stationCode.toLowerCase() === q ||
      s.stationName.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
  );

  if (found) return found;

  // Try matching from MAJOR_STATIONS
  const fallback = MAJOR_STATIONS.find(
    (m) =>
      m.code.toLowerCase() === q ||
      m.name.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q)
  );

  if (fallback) {
    const encoded = encodeURIComponent(`${fallback.name} Railway Station ${fallback.city}`);
    return {
      stationCode: fallback.code,
      stationName: fallback.name,
      city: fallback.city,
      state: fallback.state,
      platforms: fallback.platforms,
      latitude: 20.5937,
      longitude: 78.9629,
      facilities: {
        restroom: true,
        food: true,
        waitingRoom: true,
        atm: true,
        parking: true,
        medical: false,
        taxi: true,
        auto: true,
        accessibility: true,
        wifi: true,
        water: true,
        cloakRoom: true,
        executiveLounge: false,
      },
      navigationLinks: {
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
        hospitalUrl: `https://www.google.com/maps/search/hospitals+near+${encoded}`,
        restaurantUrl: `https://www.google.com/maps/search/restaurants+near+${encoded}`,
        hotelUrl: 'https://www.rr.irctc.co.in/',
        cabUrl: 'https://www.olacabs.com',
        autoUrl: 'https://www.rapido.bike',
      },
    };
  }

  return null;
}
