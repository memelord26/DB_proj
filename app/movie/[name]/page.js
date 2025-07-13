"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FavoriteButton from '../../components/FavoriteButton';

export default function MovieProfile() {
  const params = useParams();
  const router = useRouter();
  const [movieData, setMovieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    const fetchMovieData = async () => {
      if (!params.name) return;

      try {
        setIsLoading(true);
        const decodedName = decodeURIComponent(params.name);
        const response = await fetch(`/api/movie?name=${encodeURIComponent(decodedName)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMovieData(data);
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [params.name, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading movie details: {error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const movie = movieData?.movies?.[0];

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
            <a href="/favorites" className="text-gray-900 hover:text-blue-700 dark:text-white">Favorites</a>
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

        {/* Movie Name Header */}
        <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">
              {movie?.Movie_Name || decodeURIComponent(params.name)}
            </h1>
            <FavoriteButton 
              type="movie" 
              itemId={params.name}
              itemName={movie?.Movie_Name || decodeURIComponent(params.name)}
            />
          </div>
        </div>

        {movie && (
          <div className="mb-8">
            {/* Movie Details Box */}
            <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
                Movie Details
              </h2>
              {movie.Release_Date && (
                <p className="text-lg text-white">
                  <strong className="text-purple-200">Release Date:</strong> {movie.Release_Date}
                </p>
              )}
            </div>

            {/* Cast Box */}
            {movie.actors && movie.actors.length > 0 && (
              <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
                  Cast
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movie.actors.map((actor, index) => (
                    <div key={index} className="bg-purple-700 p-4 rounded-lg border border-purple-500 hover:bg-purple-600 transition-colors cursor-pointer">
                      <h3 
                        className="font-semibold text-lg text-white hover:text-purple-200"
                        onClick={() => router.push(`/actor/${encodeURIComponent(actor.Actor_Name)}`)}
                      >
                        {actor.Actor_Name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Movies with Similar Name */}
        {movieData?.movies && movieData.movies.length > 1 && (
          <div className="mt-8">
            <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
                Other Movies with Similar Name
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movieData.movies.slice(1).map((similarMovie, index) => (
                  <div key={index} className="bg-purple-700 p-4 rounded-lg border border-purple-500">
                    <h3 className="font-semibold text-lg text-white mb-2">{similarMovie.Movie_Name}</h3>
                    {similarMovie.Release_Date && (
                      <p className="text-sm text-purple-200">
                        Released: {similarMovie.Release_Date}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Information Available */}
        {(!movieData?.movies || movieData.movies.length === 0) && (
          <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
            <p className="text-purple-200">No information available for this movie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
