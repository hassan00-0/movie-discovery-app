"use client";

import Search from "./components/Search.jsx";
import { useEffect, useState } from "react";
import Loader from "./components/Loader.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import {
  updateSearchCount,
  getTrendingMovies,
  autoLogin,
  logoutUser,
} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState("");

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const loggedInUser = await autoLogin();
        setUser(loggedInUser);
        loadTrendingMovies();
        setAuthError(""); // Clear any previous errors
      } catch (error) {
        setAuthError(error.message);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Debounce search input
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  // Fetch movies from TMDB API
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMovieList(data.results || []);

      // Track search if user is logged in
      if (query && data.results.length > 0 && user) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMessage(`Error fetching movies: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending movies from database
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log("Error loading trending movies:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setTrendingMovies([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch movies when search term changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <main className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-white mt-4">Connecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <div className="flex justify-between items-center mb-4">
            <img src="./logo.png" alt="Logo" className="h-8" />
          </div>

          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Show authentication error only if login actually failed */}
        {authError && !user && (
          <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-2">Authentication Error</h3>
            <p className="mb-2">{authError}</p>
            <p className="text-sm">
              The app will work without authentication, but trending movies
              won't be available.
            </p>
          </div>
        )}

        {/* Show trending movies if user is logged in */}
        {user && trendingMovies.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Trending Movies
            </h2>
            <div
              className="overflow-x-auto -mt-10"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#AB8BFF #1a1a2e",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  height: 8px;
                }
                div::-webkit-scrollbar-track {
                  background: rgba(26, 26, 46, 0.5);
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-thumb {
                  background: linear-gradient(90deg, #ab8bff, #d6c7ff);
                  border-radius: 10px;
                  border: 1px solid rgba(171, 139, 255, 0.3);
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(90deg, #d6c7ff, #ab8bff);
                }
              `}</style>
              <div className="flex gap-5 pb-4" style={{ width: "max-content" }}>
                {trendingMovies.map((movie, index) => (
                  <div key={movie.$id} className="flex items-center">
                    <p
                      className="text-nowrap"
                      style={{
                        WebkitTextStroke: "5px rgba(206, 206, 251, 0.5)",
                        fontSize: "190px",
                        fontFamily: '"Bebas Neue", sans-serif',
                        marginTop: "22px",
                      }}
                    >
                      {index + 1}
                    </p>
                    {movie.poster_url && (
                      <img
                        src={movie.poster_url || "/placeholder.svg"}
                        alt={movie.searchTerm}
                        className="w-[127px] h-[163px] rounded-lg object-cover -ml-3.5"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Movie results section */}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <div className="text-white">
              <Loader />
            </div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
