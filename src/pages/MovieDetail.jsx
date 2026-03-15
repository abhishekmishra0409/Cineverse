import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchMovieById } from "../features/Movies/movieSlice";
import {
    addFavourite,
    addLastViewed,
    addWatchnext,
    fetchFavourite,
    fetchLastViewed,
    fetchWatchnext,
} from "../features/Profile/profileSlice";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import {
    FaHeart,
    FaRegHeart,
    FaPlusCircle,
    FaClock,
    FaPlay,
    FaStar,
    FaCalendar,
    FaGlobe,
    FaMoneyBillWave,
    FaFilm,
    FaTheaterMasks
} from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const MovieDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentMovie, isLoading } = useSelector((state) => state.movies);
    const { favourite, watchnext } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.users);
    const [isFav, setIsFav] = useState(false);
    const [isNext, setIsNext] = useState(false);

    useEffect(() => {
        dispatch(fetchMovieById(id));
        if (user?.id) {
            dispatch(fetchFavourite(user.id));
            dispatch(fetchWatchnext(user.id));
            dispatch(fetchLastViewed(user.id));
        }
    }, [dispatch, id, user?.id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (user?.id && favourite) {
            setIsFav(favourite.some((fav) => fav.movie.id === +id));
        }
        if (user?.id && watchnext) {
            setIsNext(watchnext.some((next) => next.movie.id === +id));
        }
    }, [favourite, watchnext, id, user?.id]);

    useEffect(() => {
        if (currentMovie && user) {
            const { id, title, poster_path, release_date, vote_average } = currentMovie;
            dispatch(
                addLastViewed({
                    userId: user.id,
                    movie: { id, title, poster_path, release_date, vote_average },
                })
            );
        }
    }, [currentMovie, user, dispatch]);

    const addToFav = async () => {
        const { id, title, poster_path, release_date, vote_average } = currentMovie;

        if (!user) return toast.error("Please login to add to favourites");
        await dispatch(
            addFavourite({
                userId: user.id,
                movie: { id, title, poster_path, release_date, vote_average },
            })
        );
        setIsFav(true);
        toast.success(`${currentMovie?.title} added to favourites`);
    };

    const addToNext = async () => {
        const { id, title, poster_path, release_date, vote_average } = currentMovie;
        if (!user) return toast.error("Please login to add to watch next");
        await dispatch(
            addWatchnext({
                userId: user.id,
                movie: { id, title, poster_path, release_date, vote_average },
            })
        );
        setIsNext(true);
        toast.success(`${currentMovie?.title} added to Watch Next`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center pt-20">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Hero Section with Backdrop */}
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                {/* Backdrop Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${currentMovie?.backdrop_path
                            ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
                            : `${import.meta.env.BASE_URL}NotFound.png`
                            })`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-gray-900 via-gray-900/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
                    <div className="flex flex-col md:flex-row gap-6 w-full">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={
                                    currentMovie?.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`
                                        : `${import.meta.env.BASE_URL}NotFound.png`
                                }
                                alt={currentMovie?.title}
                                className="w-48 md:w-56 lg:w-64 rounded-lg shadow-2xl ring-4 ring-white/10"
                            />
                        </div>

                        {/* Title and Quick Info */}
                        <div className="flex flex-col justify-end text-white space-y-3">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                {currentMovie?.title}
                            </h1>

                            {currentMovie?.tagline && (
                                <p className="text-lg text-gray-300 italic">"{currentMovie.tagline}"</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                {/* Rating */}
                                <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-semibold">
                                        {currentMovie?.vote_average?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-300">
                                        ({currentMovie?.vote_count} votes)
                                    </span>
                                </div>

                                {/* Release Date */}
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <FaCalendar />
                                    <span>{currentMovie?.release_date}</span>
                                </div>

                                {/* Runtime */}
                                {currentMovie?.runtime > 0 && (
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                        <MdAccessTime />
                                        <span>{formatRuntime(currentMovie.runtime)}</span>
                                    </div>
                                )}

                                {/* Status */}
                                <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span>{currentMovie?.status}</span>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2">
                                {currentMovie?.genres?.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-sm rounded-full border border-blue-400/30"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <FaPlay />
                        <span>Watch Now</span>
                    </button>

                    {isFav ? (
                        <button
                            disabled
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold cursor-not-allowed opacity-75"
                        >
                            <FaHeart className="text-red-400" />
                            <span>In Favourites</span>
                        </button>
                    ) : (
                        <button
                            onClick={addToFav}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            <FaRegHeart className="group-hover:text-red-500" />
                            <span>Add to Favourites</span>
                        </button>
                    )}

                    {isNext ? (
                        <button
                            disabled
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold cursor-not-allowed opacity-75"
                        >
                            <FaClock />
                            <span>In Watch List</span>
                        </button>
                    ) : (
                        <button
                            onClick={addToNext}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                            <FaPlusCircle />
                            <span>Add to Watch Next</span>
                        </button>
                    )}
                </div>

                {/* Overview Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaFilm className="text-blue-600" />
                        Overview
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                        {currentMovie?.overview || "No overview available."}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Production Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FaTheaterMasks className="text-purple-600" />
                            Production
                        </h3>

                        {currentMovie?.production_companies && currentMovie.production_companies.length > 0 && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Companies</p>
                                <div className="space-y-2">
                                    {currentMovie.production_companies.map((company) => (
                                        <p key={company.id} className="text-gray-700 dark:text-gray-300">
                                            {company.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentMovie?.production_countries && currentMovie.production_countries.length > 0 && (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Countries</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentMovie.production_countries.map((country) => (
                                        <span
                                            key={country.iso_3166_1}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                        >
                                            {country.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Languages */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaGlobe className="text-green-600" />
                            Languages
                        </h3>
                        <div className="space-y-2">
                            {currentMovie?.spoken_languages?.map((lang, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                >
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                                        {lang.english_name || lang.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Info */}
                    {(currentMovie?.budget > 0 || currentMovie?.revenue > 0) && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-600" />
                                Box Office
                            </h3>

                            {currentMovie?.budget > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(currentMovie.budget)}
                                    </p>
                                </div>
                            )}

                            {currentMovie?.revenue > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(currentMovie.revenue)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* External Links */}
                {(currentMovie?.homepage || currentMovie?.imdb_id) && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            External Links
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {currentMovie?.homepage && (
                                <a
                                    href={currentMovie.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Official Website
                                </a>
                            )}
                            {currentMovie?.imdb_id && (
                                <a
                                    href={`https://www.imdb.com/title/${currentMovie.imdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    View on IMDb
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;