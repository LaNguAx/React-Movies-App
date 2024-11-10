import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';
const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const API = `a14d90ad`;

export default function App() {
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(
  //   () => JSON.parse(localStorage.getItem('watched')) || []
  // );

  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  function handleSelectMovie(id) {
    if (selectedId === id) return setSelectedId(null);

    setSelectedId(id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  const [avgRating, setAvgRating] = useState(0);

  function handleAddWatched(movie) {
    const foundObj = watched.find((m) => m.imdbid === movie.imdbid);
    if (foundObj) {
      setSelectedId(null);
      return setWatched((watched) => [
        ...watched.filter((m) => m.imdbid !== movie.imdbid),
        movie,
      ]);
    }

    const newMovie = {
      ...movie,
      imdbrating: Number(movie.imdbrating),
      runtime: Number(movie.runtime.split(' ')[0]),
    };

    setWatched((watched) => [...watched, newMovie]);
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));

    setSelectedId(null);
  }

  // useEffect(() => {
  //   localStorage.setItem('watched', JSON.stringify(watched));
  // }, [watched]);

  useEffect(() => {
    const default_page_title = 'hello def page';
    const updatePageTitle = () => {
      document.title =
        movies?.find((m) => m.imdbID === selectedId)?.Title ||
        default_page_title;
    };
    updatePageTitle();
  }, [movies, selectedId]);

  return (
    <>
      <NavBar>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} setSelectedId={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              movies={watched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function SearchBar({ query, setQuery }) {
  const inputElement = useRef(null);

  useEffect(() => inputElement.current.focus(), []);

  useKey('Enter', () => {
    if (document.activeElement === inputElement.current) return;
    inputElement.current.focus();
    setQuery('');
  });

  

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}

function Loader() {
  return <p className="loader">Loading..</p>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, setSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} setSelectedId={setSelectedId} />
      ))}
    </ul>
  );
}

function Movie({ movie, setSelectedId }) {
  return (
    <li key={movie.imdbID} onClick={() => setSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function WatchedMovieList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbid} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li key={movie.imdbid}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbrating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userrating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie: handleCloseMovie,
  onAddWatched: handleAddWatched,
  movies,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [rating, setRating] = useState('');

  const countRef = useRef(0);

  useEffect(() => {
    if (rating) countRef.current += 1;

    console.log(countRef.current);
  }, [rating]);

  useKey('Escape', handleCloseMovie);

  useEffect(() => {
    const getMovie = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${API}&i=${selectedId}`
      );

      if (!res.ok)
        throw new Error('Something went wrong with fetching movie..');

      const movie = await res.json();
      const fixedMovie = {};
      for (const [key, value] of Object.entries(movie)) {
        fixedMovie[key.toLowerCase()] = value;
      }

      const movieFound = movies.find((mov) => mov.imdbid === fixedMovie.imdbid);

      setMovie(movieFound || fixedMovie);
      setIsLoading(false);
    };

    if (!selectedId) return;

    getMovie();
  }, [selectedId, movies]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;{' '}
            </button>
            <img src={movie.poster} alt={`Poster of ${movie.title} movie`} />
            <div className="details-overview">
              <h2>{movie.title}</h2>
              <p>
                {movie.released} &bull; {movie.runtime}
              </p>
              <p>{movie.genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbrating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <StarRating
              maxRating={10}
              size={25}
              onSetRating={(rating) => setRating(rating)}
              defaultRating={movie.userrating}
            />
            {rating && (
              <button
                className="btn-add"
                onClick={() =>
                  handleAddWatched({
                    ...movie,
                    userrating: rating,
                    countratingdecisions: countRef.current,
                  })
                }
              >
                Add To Watched
              </button>
            )}
            <p>
              <em>{movie.plot}</em>
            </p>
            <p>Starring {movie.actors}</p>
            <p>Directed by {movie.director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbrating));
  const avgUserRating = average(watched.map((movie) => movie.userrating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

const average = (arr) => {
  if (arr.length === 0) return 0; // Return 0 if the array is empty
  return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
};
