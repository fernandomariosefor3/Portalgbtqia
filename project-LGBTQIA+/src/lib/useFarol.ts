import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebase';

export interface FarolKnowledge {
  id: string;
  intent: string;
  keywords: string[];
  response_template: string;
  official_source_name?: string;
  official_source_url?: string;
  requires_local_services?: boolean;
}

export function useFarol() {
  const [knowledgeBase, setKnowledgeBase] = useState<FarolKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const q = query(collection(db, 'farol_knowledge'));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FarolKnowledge[];
        
        setKnowledgeBase(data);
      } catch (err) {
        console.error('Error fetching farol knowledge:', err);
        setError('Não foi possível carregar a base do Farol.');
      } finally {
        setLoading(false);
      }
    }

    fetchKnowledge();
  }, []);

  const searchKnowledge = (input: string): FarolKnowledge | null => {
    if (!input || knowledgeBase.length === 0) return null;
    
    const lowerInput = input.toLowerCase();
    
    // Simple keyword matching for now
    for (const item of knowledgeBase) {
      if (item.keywords && item.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
        return item;
      }
    }
    
    return null;
  };

  return { knowledgeBase, searchKnowledge, loading, error };
}
