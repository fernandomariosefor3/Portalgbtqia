import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useFavorites, type FavoriteItem } from '@/lib/useFavorites';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'addedAt'>;
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({ item, className = '', showText = false }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const favorited = isFavorite(item.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirecionar para login se não estiver autenticado
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await toggleFavorite(item);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar favorito.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 ${
        favorited ? 'text-primary-500' : 'text-dark-400 hover:text-primary-500'
      } ${className}`}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <i className={`${favorited ? 'ri-bookmark-fill' : 'ri-bookmark-line'} ${showText ? 'text-lg' : 'text-xl'}`} aria-hidden="true"></i>
      {showText && <span className="text-sm font-semibold">{favorited ? 'Salvo' : 'Salvar'}</span>}
    </button>
  );
}
