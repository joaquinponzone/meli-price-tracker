import { useState, useEffect, useCallback } from 'react';

export interface Report {
  timestamp: string,
  product: {
      title: string,
      url: string,
      price: number,
      currency: string,
      available: boolean,
      delivery: {
          home: {
              type: string,
              isFreeDelivery: boolean,
              date: string | null
          },
          pickup: {
              type: string,
              isFreeDelivery: boolean,
              date: string | null
          }
      }
  }
}

const STORAGE_KEY = 'scanning-history';

export function useLocalStorageReports() {
  const [reports, setReports] = useState<Report[]>([]);

  // Load reports from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load reports from localStorage:', error);
    }
  }, []);

  // Add new report
  const addReport = useCallback((report: Report) => {
    setReports(prevReports => {
      const newReportPayload = {
        ...report,
        timestamp: new Date().toISOString(),
      }
      const newReports = [newReportPayload, ...prevReports];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
      return newReports;
    });
  }, []);

  // Delete report by timestamp
  const deleteReport = useCallback((timestamp: string) => {
    setReports(prevReports => {
      const newReports = prevReports.filter(r => r.timestamp !== timestamp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReports));
      return newReports;
    });
  }, []);

  return { reports, addReport, deleteReport };
} 