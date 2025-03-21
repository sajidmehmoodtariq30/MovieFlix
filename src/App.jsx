import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const BaseURL = 'https://api.themoviedb.org/3/'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
  }
};

const App = () => {

  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchedTerm, setdebouncedSearchedTerm] = useState('')

  useDebounce(() => setdebouncedSearchedTerm(searchTerm), 700, [searchTerm])

  const fetchMovies = async (query = '') => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const url = query
        ? `${BaseURL}search/movie?query=${encodeURIComponent(query)}`
        : `${BaseURL}discover/movie?sort_by=popularity.desc`;
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to Fetch Movies");
      }

      const data = await response.json();

      if (data.results.length === 0) {
        setErrorMessage("No Movies Found");
      } else {
        setMovieList(data.results);
      }

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch (err) {
      console.error("Error Fetching Movies:", err);
      setErrorMessage("Error Fetching Movies");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchedTerm)
  }, [debouncedSearchedTerm])

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>

      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy without the Hassle</h1>
        </header>

        <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />

      </div>

      {trendingMovies.length > 0 && (
        <section className='trending wrapper'>
          <h2 className='text-center mt-5 text-2xl text-white'>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={index}>
                <p>{index + 1}</p>
                <img
                  src={movie.poster}
                  alt={movie.title}
                />
                <p>{movie.title}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Movies Section */}
      <section className='all-movies'>
        <h2 className='text-center mt-2 text-3xl'>All Movies</h2>

        {isLoading ? (
          <div className='flex h-48 items-center flex-col justify-center'>
            <Spinner />
            <p className='text-white text-3xl mt-5'>Loading ...</p>
          </div>
        ) : errorMessage ? (
          <p className='error-message'>{errorMessage}</p>
        ) : (
          <ul className='wrapper'>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>

    </main>
  )
}

export default App