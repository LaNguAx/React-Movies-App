import { useEffect, useState } from 'react';
const API = `a14d90ad`;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {

    callback?.();

    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setError('');
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies..');

        const data = await res.json();
        if (data.Error) throw new Error('No movies found!');

        setMovies(data.Search);
      } catch (error) {
        if (error.name !== 'AbortError') setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      if (query.length === 0) return setError(`Start searching for movies!`);

      setError(`Please enter a query > 3 to start searching..`);
    }

    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
