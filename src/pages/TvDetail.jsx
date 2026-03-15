import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
    addFavourite,
    addWatchnext,
    fetchFavourite,
    fetchWatchnext,
} from "../features/Profile/profileSlice";
import { fetchTVSeriesById } from "../features/Movies/movieSlice";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import {
    FaHeart,
    FaPlusCircle,
    FaRegHeart,
    FaClock,
    FaPlay,
    FaStar,
    FaCalendar,
    FaGlobe,
    FaTv,
    FaTheaterMasks,
    FaUserAlt,
    FaBroadcastTower,
} from "react-icons/fa";
import { MdAccessTime, MdLiveTv } from "react-icons/md";

const TvDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { currentTVSeries, isLoading } = useSelector((state) => state.movies);
    const { favourite, watchnext } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.users);

    const [isFav, setIsFav] = useState(false);
    const [isNext, setIsNext] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(null);

    useEffect(() => {
        dispatch(fetchTVSeriesById(id));
        if (user?.id) {
            dispatch(fetchFavourite(user.id));
            dispatch(fetchWatchnext(user.id));
        }
    }, [dispatch, id, user?.id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (user?.id && favourite) {
            setIsFav(favourite.some((fav) => fav.movie.id === +id));
        }
        if (user?.id && watchnext) {
            setIsNext(watchnext.some((next) => next.movie.id === +id));
        }
    }, [favourite, watchnext, id, user?.id]);

    const addToFav = async () => {
        const { id, vote_average, poster_path, name, first_air_date } = currentTVSeries;
        if (!user) return toast.error("Please login to add to favourites");
        await dispatch(
            addFavourite({
                userId: user.id,
                movie: { id, vote_average, poster_path, name, first_air_date },
            })
        );
        setIsFav(true);
        toast.success(`${currentTVSeries?.name} added to favourites`);
    };

    const addToNext = async () => {
        const { id, vote_average, poster_path, name, first_air_date } = currentTVSeries;
        if (!user) return toast.error("Please login to add to watch next");
        await dispatch(
            addWatchnext({
                userId: user.id,
                movie: { id, vote_average, poster_path, name, first_air_date },
            })
        );
        setIsNext(true);
        toast.success(`${currentTVSeries?.name} added to Watch Next`);
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
                        backgroundImage: `url(${currentTVSeries?.backdrop_path
                            ? `https://image.tmdb.org/t/p/original${currentTVSeries.backdrop_path}`
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
                                    currentTVSeries?.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${currentTVSeries.poster_path}`
                                        : `${import.meta.env.BASE_URL}NotFound.png`
                                }
                                alt={currentTVSeries?.name}
                                className="w-48 md:w-56 lg:w-64 rounded-lg shadow-2xl ring-4 ring-white/10"
                            />
                        </div>

                        {/* Title and Quick Info */}
                        <div className="flex flex-col justify-end text-white space-y-3">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                {currentTVSeries?.name}
                            </h1>

                            {currentTVSeries?.tagline && (
                                <p className="text-lg text-gray-300 italic">
                                    "{currentTVSeries.tagline}"
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                {/* Rating */}
                                <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-semibold">
                                        {currentTVSeries?.vote_average?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-300">
                                        ({currentTVSeries?.vote_count} votes)
                                    </span>
                                </div>

                                {/* First Air Date */}
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <FaCalendar />
                                    <span>{currentTVSeries?.first_air_date}</span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <span
                                        className={`w-2 h-2 rounded-full ${currentTVSeries?.in_production
                                            ? "bg-green-400 animate-pulse"
                                            : "bg-gray-400"
                                            }`}
                                    />
                                    <span>{currentTVSeries?.status}</span>
                                </div>
                            </div>

                            {/* Seasons & Episodes */}
                            <div className="flex items-center gap-4 text-sm md:text-base">
                                <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <FaTv />
                                    <span>{currentTVSeries?.number_of_seasons} Seasons</span>
                                </div>
                                <div className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <MdAccessTime />
                                    <span>{currentTVSeries?.number_of_episodes} Episodes</span>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2">
                                {currentTVSeries?.genres?.map((genre) => (
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
                            <FaRegHeart />
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
                        <FaTv className="text-blue-600" />
                        Overview
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                        {currentTVSeries?.overview || "No overview available."}
                    </p>
                </div>

                {/* Latest & Next Episode Info */}
                {(currentTVSeries?.last_episode_to_air || currentTVSeries?.next_episode_to_air) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Last Episode */}
                        {currentTVSeries?.last_episode_to_air && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MdLiveTv className="text-green-600" />
                                    Last Episode
                                </h3>
                                <div className="space-y-3">
                                    {currentTVSeries.last_episode_to_air.still_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${currentTVSeries.last_episode_to_air.still_path}`}
                                            alt={currentTVSeries.last_episode_to_air.name}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    )}
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        S{currentTVSeries.last_episode_to_air.season_number}E
                                        {currentTVSeries.last_episode_to_air.episode_number}:{" "}
                                        {currentTVSeries.last_episode_to_air.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Aired: {currentTVSeries.last_episode_to_air.air_date}
                                    </p>
                                    {currentTVSeries.last_episode_to_air.overview && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {currentTVSeries.last_episode_to_air.overview}
                                        </p>
                                    )}
                                    {currentTVSeries.last_episode_to_air.vote_average > 0 && (
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <span className="text-sm font-semibold">
                                                {currentTVSeries.last_episode_to_air.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Next Episode */}
                        {currentTVSeries?.next_episode_to_air && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-500">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaClock className="text-blue-600" />
                                    Next Episode
                                </h3>
                                <div className="space-y-3">
                                    {currentTVSeries.next_episode_to_air.still_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${currentTVSeries.next_episode_to_air.still_path}`}
                                            alt={currentTVSeries.next_episode_to_air.name}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    )}
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        S{currentTVSeries.next_episode_to_air.season_number}E
                                        {currentTVSeries.next_episode_to_air.episode_number}:{" "}
                                        {currentTVSeries.next_episode_to_air.name}
                                    </h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                        Airs: {currentTVSeries.next_episode_to_air.air_date}
                                    </p>
                                    {currentTVSeries.next_episode_to_air.overview && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {currentTVSeries.next_episode_to_air.overview}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Creators */}
                    {currentTVSeries?.created_by && currentTVSeries.created_by.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaUserAlt className="text-indigo-600" />
                                Created By
                            </h3>
                            <div className="space-y-3">
                                {currentTVSeries.created_by.map((creator) => (
                                    <div key={creator.id} className="flex items-center gap-3">
                                        {creator.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${creator.profile_path}`}
                                                alt={creator.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                                <FaUserAlt className="text-gray-600 dark:text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {creator.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Networks */}
                    {currentTVSeries?.networks && currentTVSeries.networks.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FaBroadcastTower className="text-red-600" />
                                Networks
                            </h3>
                            <div className="space-y-3">
                                {currentTVSeries.networks.map((network) => (
                                    <div
                                        key={network.id}
                                        className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                    >
                                        {network.logo_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                                                alt={network.name}
                                                className="h-8 object-contain"
                                            />
                                        ) : (
                                            <p className="text-gray-700 dark:text-gray-300 font-medium">
                                                {network.name}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaGlobe className="text-green-600" />
                            Languages
                        </h3>
                        <div className="space-y-2">
                            {currentTVSeries?.spoken_languages?.map((lang, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                >
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                                        {lang.english_name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Production Info */}
                    {currentTVSeries?.production_companies &&
                        currentTVSeries.production_companies.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FaTheaterMasks className="text-purple-600" />
                                    Production
                                </h3>
                                <div className="space-y-3">
                                    {currentTVSeries.production_companies.map((company) => (
                                        <div key={company.id} className="space-y-1">
                                            {company.logo_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-8 object-contain"
                                                />
                                            ) : (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {company.name}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>

                {/* Seasons Section */}
                {currentTVSeries?.seasons && currentTVSeries.seasons.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Seasons ({currentTVSeries.seasons.length})
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {currentTVSeries.seasons.map((season) => (
                                <div
                                    key={season.id}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedSeason(season)}
                                >
                                    <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                                        <img
                                            src={
                                                season.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                                                    : `${import.meta.env.BASE_URL}NotFound.png`
                                            }
                                            alt={season.name}
                                            className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                                            <p className="text-white font-semibold text-sm">
                                                {season.name}
                                            </p>
                                            <p className="text-gray-300 text-xs">
                                                {season.episode_count} Episodes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* External Links */}
                {currentTVSeries?.homepage && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            External Links
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={currentTVSeries.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Official Website
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TvDetail;