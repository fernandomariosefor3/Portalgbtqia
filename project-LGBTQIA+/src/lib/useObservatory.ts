import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export interface ObservatoryMetric {
  id: string;
  indicator_name: string;
  state: string;
  value: number;
  year: number;
  source_name: string;
  source_url?: string;
  methodology_notes?: string;
  imported_at?: any;
}

export function useObservatory() {
  const [metrics, setMetrics] = useState<ObservatoryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const q = query(collection(db, 'observatory_metrics'));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ObservatoryMetric[];
        
        setMetrics(data);
      } catch (err) {
        console.error('Error fetching observatory metrics:', err);
        setError('Não foi possível carregar os dados do observatório no momento.');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}
