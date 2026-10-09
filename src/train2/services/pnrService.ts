import { PnrRecord } from '../types/railway';
import { DEMO_PNRS } from '../data/trainsData';

export interface PnrServiceResponse {
  success: boolean;
  isLiveApi: boolean;
  record?: PnrRecord;
  message?: string;
  officialPnrUrl: string;
}

export const OFFICIAL_RAILWAY_PNR_URL = 'https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html';

export async function checkPnrStatus(
  pnrNumber: string,
  allowDemoFallback: boolean = true
): Promise<PnrServiceResponse> {
  const cleanPnr = pnrNumber.trim().replace(/\D/g, '');

  if (cleanPnr.length !== 10) {
    return {
      success: false,
      isLiveApi: false,
      message: 'Please enter a valid 10-digit Indian Railways PNR number.',
      officialPnrUrl: OFFICIAL_RAILWAY_PNR_URL,
    };
  }

  // Check if live Indian Railways API is configured in environment
  const pnrApiKey =
    (typeof process !== 'undefined' && process.env?.RAIL_PNR_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { VITE_RAIL_PNR_API_KEY?: string } }).env?.VITE_RAIL_PNR_API_KEY);

  if (pnrApiKey && pnrApiKey !== 'MY_PNR_API_KEY') {
    try {
      const res = await fetch(`https://api.railways.gov.in/pnr/${cleanPnr}`, {
        headers: { Authorization: `Bearer ${pnrApiKey}` },
      });
      if (res.ok) {
        const liveData = await res.json();
        return {
          success: true,
          isLiveApi: true,
          record: liveData,
          officialPnrUrl: OFFICIAL_RAILWAY_PNR_URL,
        };
      }
    } catch {
      // network failure
    }
  }

  // Check if demo PNR is allowed and matches known or test pattern
  if (allowDemoFallback) {
    const matched = DEMO_PNRS.find((d) => d.pnrNumber === cleanPnr);
    if (matched) {
      return {
        success: true,
        isLiveApi: false,
        record: matched,
        message: 'Displaying verified Demo PNR data. Live IRCTC enquiry available below.',
        officialPnrUrl: OFFICIAL_RAILWAY_PNR_URL,
      };
    }
  }

  // If no live API configured and not in demo list
  return {
    success: false,
    isLiveApi: false,
    message: 'PNR service is currently unavailable. No authorized live railway PNR API is configured.',
    officialPnrUrl: OFFICIAL_RAILWAY_PNR_URL,
  };
}
