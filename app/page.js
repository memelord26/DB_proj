"use client";
import Image from "next/image";
import { NextResponse } from "next/server";
import { debounce, set } from 'lodash';
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ recentMovies: [], mostActiveActors: [] });
  const router = useRouter();

const fetchData = async (search = '') => {
  try {
    const res = await fetch(`/api/posts${search ? `?search=${encodeURIComponent(search)}` : ''}`);

    // Check if response is OK and content-type is JSON
    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      const text = await res.text();
      console.error('Server error:', res.status, text);
      setPosts([]);
      return;
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Invalid response type:', contentType, text);
      setPosts([]);
      return;
    }

    const json = await res.json();

    if (Array.isArray(json.posts)) {
      setPosts(json.posts);
    } else {
      console.error('Invalid data format:', json);
      setPosts([]);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    setPosts([]);
  }
};

const fetchStats = async () => {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

useEffect(() => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    router.replace('/login');
  } else {
    setLoggedIn(true);
    fetchData();
    fetchStats();
  }
  setIsLoading(false);
}, []);
  
 const handleSearch = async () => {
  try {
    const res = await fetch(`/api/posts?search=${encodeURIComponent(searchInput)}`);

    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      const text = await res.text();
      console.error('Search request failed:', res.status, text);
      setPosts([]);
      return;
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Unexpected response format:', contentType, text);
      setPosts([]);
      return;
    }

    const json = await res.json();

    if (Array.isArray(json.posts)) {
      setPosts(json.posts);
    } else {
      console.error('Invalid data format in search:', json);
      setPosts([]);
    }
  } catch (error) {
    console.error('Error performing search:', error);
    setPosts([]);
  }
};

  return (
    <div>
      {isLoading ? (
        // Loading state - prevent flash of content
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : !loggedIn ? (
        // This shouldn't render since we redirect, but just in case
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      ) : (
        // Main content - only render when authenticated
        <>
          <div>
            <div className="bg-image"></div>
        <nav className="bg-white border-gray-200 dark:bg-gray-700">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">StarSearch</span>
            </a>
            <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-700 md:dark:bg-gray-700 dark:border-gray-700">
                <li>
                  <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
                </li>
                <li>
                  <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
                </li>
                <li>
                  <a href="/profile" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profile</a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('isLoggedIn');
                      router.replace('/login');
                    }}
                    className="cursor-pointer block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                      Log Out
                    </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-20">
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
          Welcome to StarSearch
        </h1>
        <p className="text-center text-white text-lg drop-shadow-md">
          The place to search for celebrity information
        </p>
      </div>

          <div className="mt-30">
          <form
            className="max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              handleSearch();     // your search function
            }}
          >
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search Actors, Movies, etc."
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Search
              </button>
            </div>
          </form>
        </div>

      {/* Statistics Section */}
      <div className="mt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
            Statistics
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Recent Movies */}
            <div className="bg-purple-800 dark:bg-purple-900 rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Recent Movies (Last 5 Years)
              </h3>
              {stats.recentMovies.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.recentMovies.map((movie, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-purple-700 dark:hover:bg-purple-800 rounded">
                      <button 
                        onClick={() => router.push(`/movie/${encodeURIComponent(movie.Movie_Name)}`)}
                        className="text-purple-200 hover:text-white hover:underline text-left"
                      >
                        {movie.Movie_Name}
                      </button>
                      <span className="text-sm text-purple-300">
                        {movie.Release_Date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-purple-300">No recent movies data available</p>
              )}
            </div>

            {/* Most Active Actors */}
            <div className="bg-purple-800 dark:bg-purple-900 rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Most Active Actors
              </h3>
              {stats.mostActiveActors.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stats.mostActiveActors.map((actor, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-purple-700 dark:hover:bg-purple-800 rounded">
                      <button 
                        onClick={() => router.push(`/actor/${encodeURIComponent(actor.Actor_Name)}`)}
                        className="text-purple-200 hover:text-white hover:underline text-left"
                      >
                        {actor.Actor_Name}
                      </button>
                      <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">
                        {actor.movie_count} movies
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-purple-300">No actor data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Celebrity Information
        </h1>
        <div className="flex justify-center">
          <table className="max-w-6xl w-full bg-purple-900 rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-purple-800">
              <tr>
                <th className="py-4 px-6 text-white font-semibold text-lg border-b-2 border-purple-600">Actor Name</th>
                <th className="py-4 px-6 text-white font-semibold text-lg border-b-2 border-purple-600">Movie Name</th>
                <th className="py-4 px-6 text-white font-semibold text-lg border-b-2 border-purple-600">Release Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={index} className={`text-center hover:bg-purple-800 transition-colors ${index % 2 === 0 ? 'bg-purple-900' : 'bg-purple-800'}`}>
                  <td className="py-4 px-6 border-b border-purple-600 text-white font-medium">
                    <button 
                      onClick={() => router.push(`/actor/${encodeURIComponent(post.Actor_Name)}`)}
                      className="hover:underline cursor-pointer text-purple-200 hover:text-white transition-colors"
                    >
                      {post.Actor_Name}
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b border-purple-600 text-white font-medium">
                    <button 
                      onClick={() => router.push(`/movie/${encodeURIComponent(post.Movie_Name)}`)}
                      className="hover:underline cursor-pointer text-purple-200 hover:text-white transition-colors"
                    >
                      {post.Movie_Name}
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b border-purple-600 text-white font-medium">{post.Release_Date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        </>
      )}
    </div>
  );
}
