import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  state: string;
  category: string;
  description: string;
  deadline: string | null;
  source_url?: string;
  verified: boolean;
  status: 'aberto' | 'encerrado';
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        // Without orderBy for now to avoid needing a composite index immediately if filtering by other fields later
        const q = query(collection(db, 'opportunities'));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Opportunity[];
        
        setOpportunities(data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Não foi possível carregar as oportunidades no momento.');
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, []);

  return { opportunities, loading, error };
}
