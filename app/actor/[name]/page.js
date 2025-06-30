"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ActorProfile() {
  const params = useParams();
  const router = useRouter();
  const [actorData, setActorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    const fetchActorData = async () => {
      if (!params.name) return;

      try {
        setIsLoading(true);
        const decodedName = decodeURIComponent(params.name);
        const response = await fetch(`/api/actor-profile?name=${encodeURIComponent(decodedName)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setActorData(data);
      } catch (err) {
        console.error('Error fetching actor data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorData();
  }, [params.name, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading actor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading actor profile: {error}</p>
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

        {/* Actor Name Header */}
        <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-white">
            {actorData?.actor?.Name || params.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Details Box */}
          {actorData?.actor && (
            <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
                Personal Details
              </h2>
              <div className="space-y-3 text-white">
                {actorData.actor.Date_of_birth && (
                  <p><strong className="text-purple-200">Date of Birth:</strong> {actorData.actor.Date_of_birth}</p>
                )}
                {actorData.actor.Birth_place && (
                  <p><strong className="text-purple-200">Birth Place:</strong> {actorData.actor.Birth_place}</p>
                )}
                {actorData.actor.height && (
                  <p><strong className="text-purple-200">Height:</strong> {actorData.actor.height}</p>
                )}
                {actorData.actor.Role && (
                  <p><strong className="text-purple-200">Role:</strong> {actorData.actor.Role}</p>
                )}
                {actorData.actor.Awards && (
                  <p><strong className="text-purple-200">Awards:</strong> {actorData.actor.Awards}</p>
                )}
                {actorData.actor['Famous For'] && (
                  <p><strong className="text-purple-200">Famous For:</strong> {actorData.actor['Famous For']}</p>
                )}
              </div>
            </div>
          )}

          {/* Social Media Box */}
          {actorData?.socialMedia && actorData.socialMedia.length > 0 && (
            <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
                Social Media
              </h2>
              <div className="space-y-3 text-white">
                {actorData.socialMedia.map((social, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <strong className="capitalize text-purple-200">{social.platform}:</strong>
                    <span>@{social.handle}</span>
                    {social.followers && (
                      <span className="text-sm text-purple-300 bg-purple-700 px-2 py-1 rounded-full">
                        {social.followers} followers
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Education Box */}
        {actorData?.education && actorData.education.length > 0 && (
          <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actorData.education.map((edu, index) => (
                <div key={index} className="bg-purple-700 p-4 rounded-lg border border-purple-500">
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {edu.school_table?.School_Name || 'School Name Unavailable'}
                  </h3>
                  <div className="text-purple-200 space-y-1 text-sm">
                    {edu.Major && <p><strong className="text-purple-100">Major:</strong> {edu.Major}</p>}
                    {edu.Start_Year && edu.End_Year && (
                      <p><strong className="text-purple-100">Years:</strong> {edu.Start_Year} - {edu.End_Year}</p>
                    )}
                    {edu.Honours && <p><strong className="text-purple-100">Honours:</strong> {edu.Honours}</p>}
                    {edu.school_table?.Location && (
                      <p><strong className="text-purple-100">Location:</strong> {edu.school_table.Location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movies Box */}
        {actorData?.movies && actorData.movies.length > 0 && (
          <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 border-b border-purple-300 dark:border-purple-600 pb-2">
              Movies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actorData.movies.map((movie, index) => (
                <div key={index} className="bg-purple-700 p-4 rounded-lg border border-purple-500 hover:bg-purple-600 transition-colors cursor-pointer">
                  <h3 
                    className="font-semibold text-lg text-white hover:text-purple-200 mb-2"
                    onClick={() => router.push(`/movie/${encodeURIComponent(movie.Movie_Name)}`)}
                  >
                    {movie.Movie_Name}
                  </h3>
                  {movie.Release_Date && (
                    <p className="text-sm text-purple-200">
                      Released: {movie.Release_Date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Information Available */}
        {(!actorData?.movies || actorData.movies.length === 0) && 
         (!actorData?.actor) && 
         (!actorData?.education || actorData.education.length === 0) && 
         (!actorData?.socialMedia || actorData.socialMedia.length === 0) && (
          <div className="bg-purple-800/90 dark:bg-purple-900/90 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
            <p className="text-purple-200">No additional information available for this actor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
