import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "../hooks/useKey";
const KEY = "f2ca383d";

export default function SelectedMovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);
  //aqui conseguimos pegar quantos cliques o usuario deu antes de realizar a ação de avaliar o filme, só conseguimos fazer isso com o useRef. Ele persiste o dado durante renderizações e não re-renderiza o componente com a mudança de estado dele.
  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);

  const isMovieWatched = watched
    .map((movie) => movie.imdbId)
    .includes(selectedId);
  const watchedMovieUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    //Clean Up function, retorna uma função opicional no effect para limpar o estado caso o mesmo continue acontecendo mesmo após uma mudança de estado ou um unmount do componente.
    //Nesse caso, ela é necessaria pois quando o filme é selecionado ele atualiza o titulo da página, porém quando se sai do componente onde o filme estava selecionado, o titulo pagina não volta para seu valor inicial, ele continua com o mesmo nome
    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {""}
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of {movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} Imdb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isMovieWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie a {watchedMovieUserRating}
                  <span>⭐️</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
