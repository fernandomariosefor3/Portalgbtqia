import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './auth';

export interface FavoriteItem {
  id: string;
  type: 'article' | 'event' | 'place';
  title: string;
  slug: string;
  image: string;
  category: string;
  addedAt: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (Array.isArray(data.favorites)) {
          // Sort by addedAt descending
          const sorted = [...data.favorites].sort(
            (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
          setFavorites(sorted);
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Erro ao carregar favoritos.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const toggleFavorite = async (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const userRef = doc(db, 'users', user.uid);
    const currentlyFavorited = isFavorite(item.id);

    try {
      if (currentlyFavorited) {
        // Remove
        const itemToRemove = favorites.find(f => f.id === item.id);
        if (itemToRemove) {
          await updateDoc(userRef, {
            favorites: arrayRemove(itemToRemove)
          });
          setFavorites(prev => prev.filter(f => f.id !== item.id));
        }
      } else {
        // Add
        const newItem: FavoriteItem = {
          ...item,
          addedAt: new Date().toISOString()
        };
        
        // Use setDoc with merge in case the user doc doesn't have favorites array yet
        await setDoc(userRef, {
          favorites: arrayUnion(newItem)
        }, { merge: true });
        
        setFavorites(prev => [newItem, ...prev]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw new Error('Erro ao salvar favorito.');
    }
  };

  return { favorites, loading, error, isFavorite, toggleFavorite };
}
