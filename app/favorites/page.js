"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'actors', 'movies'

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    fetchFavorites();
  }, [router]);

  const fetchFavorites = async () => {
    try {
      const username = sessionStorage.getItem('username');
      if (!username) return;

      const response = await fetch(`/api/favorites?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (type, itemId) => {
    try {
      const username = sessionStorage.getItem('username');
      const response = await fetch(
        `/api/favorites?username=${username}&type=${type}&itemId=${encodeURIComponent(itemId)}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setFavorites(favorites.filter(fav => !(fav.type === type && fav.itemId === itemId)));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'actors') return fav.type === 'actor';
    if (activeFilter === 'movies') return fav.type === 'movie';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-image"></div>
      
      {/* Navigation */}
      <nav className="bg-white border-gray-200 dark:bg-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()}
              className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-400 text-xl font-semibold transition-colors"
            >
              ←
            </button>
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">StarSearch</span>
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="text-gray-900 hover:text-blue-700 dark:text-white">Home</a>
            <a href="/profile" className="text-gray-900 hover:text-blue-700 dark:text-white">Profile</a>
            <button
              onClick={() => {
                sessionStorage.removeItem('isLoggedIn');
                router.replace('/login');
              }}
              className="text-gray-900 hover:text-blue-700 dark:text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 mt-8">
        {/* Header */}
        <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-white">My Favorites</h1>
          <p className="text-purple-200 mt-2">Your saved actors and movies</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700'
            }`}
          >
            All ({favorites.length})
          </button>
          <button
            onClick={() => setActiveFilter('actors')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'actors' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700'
            }`}
          >
            Actors ({favorites.filter(f => f.type === 'actor').length})
          </button>
          <button
            onClick={() => setActiveFilter('movies')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'movies' 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700'
            }`}
          >
            Movies ({favorites.filter(f => f.type === 'movie').length})
          </button>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
            <p className="text-purple-200 text-xl">No favorites found</p>
            <p className="text-purple-300 mt-2">Start adding your favorite actors and movies!</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Browse Celebrities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite, index) => (
              <div key={index} className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:bg-purple-700/90 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {favorite.type === 'actor' ? '👤' : '🎬'}
                    </span>
                    <span className="text-purple-200 text-sm capitalize">
                      {favorite.type}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.type, favorite.itemId)}
                    className="text-red-400 hover:text-red-300 text-xl transition-colors"
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
                
                <h3 
                  className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-purple-200 transition-colors"
                  onClick={() => {
                    if (favorite.type === 'actor') {
                      router.push(`/actor/${encodeURIComponent(favorite.itemId)}`);
                    } else {
                      router.push(`/movie/${encodeURIComponent(favorite.itemId)}`);
                    }
                  }}
                >
                  {favorite.itemName}
                </h3>
                
                <p className="text-purple-400 text-xs mt-2">
                  Added: {new Date(favorite.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
