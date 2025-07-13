import { useState, useEffect } from 'react';

const FavoriteButton = ({ type, itemId, itemName, onFavoriteChange }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      checkFavoriteStatus(storedUsername);
    }
  }, [type, itemId]);

  const checkFavoriteStatus = async (user) => {
    try {
      const response = await fetch(`/api/favorites?username=${user}`);
      if (response.ok) {
        const data = await response.json();
        const isFav = data.favorites.some(fav => 
          fav.type === type && fav.itemId === itemId
        );
        setIsFavorited(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Re-check favorite status when external changes occur
  useEffect(() => {
    if (username) {
      checkFavoriteStatus(username);
    }
  }, [type, itemId, username]);

  const handleFavoriteToggle = async () => {
    if (!username) {
      alert('Please log in to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(
          `/api/favorites?username=${username}&type=${type}&itemId=${encodeURIComponent(itemId)}`,
          { method: 'DELETE' }
        );
        
        if (response.ok) {
          setIsFavorited(false);
          if (onFavoriteChange) onFavoriteChange();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to remove from favorites');
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            type,
            itemId,
            itemName
          })
        });
        
        if (response.ok) {
          setIsFavorited(true);
          if (onFavoriteChange) onFavoriteChange();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isFavorited 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : 'bg-purple-600 hover:bg-purple-700 text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="text-lg">
        {isFavorited ? '❤️' : '🤍'}
      </span>
      <span>
        {loading ? 'Loading...' : (isFavorited ? 'Remove from Favorites' : 'Add to Favorites')}
      </span>
    </button>
  );
};

export default FavoriteButton;
