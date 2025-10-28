import React, { useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { popularMovies } from '../features/Movies/movieSlice';
import Loading from './Loading';
import { useNavigate } from 'react-router';

const HeroSection = () => {
    const navigate = useNavigate();
    const { popular, isLoading, error } = useSelector((state) => state.movies);
    const dispatch = useDispatch();

    const fetchPopular = useCallback(async () => {
        try {
            await dispatch(popularMovies());
        } catch (error) {
            console.error('Error fetching popular movies:', error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchPopular();
    }, [fetchPopular]);

    // Get top 5 movies for hero section
    const topMovies = popular?.slice(0, 5) || [];

    // Format rating
    const formatRating = (rating) => (rating ? rating.toFixed(1) : 'NR');

    // Format date to show only year
    const formatYear = (dateString) => {
        if (!dateString) return 'Coming Soon';
        return new Date(dateString).getFullYear();
    };

    // Truncate overview text
    const truncateOverview = (text, maxLength = 150) => {
        if (!text) return 'No description available.';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    const getDetail = (id) => {
        navigate(`/movie/${id}`);
    }

    return (
        <section className="relative w-full bg-gray-900">
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center h-[400px] md:h-[500px] lg:h-[600px]">
                    <Loading size="large" />
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="flex flex-col justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] text-center px-4">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h3 className="text-white text-xl font-semibold mb-2">Failed to load movies</h3>
                    <p className="text-gray-400 mb-4">Please try again later</p>
                    <button
                        onClick={fetchPopular}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Movie Slides */}
            {!isLoading && !error && topMovies.length > 0 && (
                <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        renderBullet: function (index, className) {
                            return `<span class="${className} bg-white/80 hover:bg-white w-2 h-2 rounded-full transition-all duration-300"></span>`;
                        }
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    loop={true}
                    speed={800}
                    // navigation={true}
                    className="w-full h-[70vh] min-h-[600px] max-h-[800px]"
                >
                    {topMovies.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <div className="relative w-full h-full">
                                {/* Background Image with Gradient Overlay */}
                                <div className="absolute inset-0">
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 h-full flex items-end pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                                    <div className="max-w-4xl space-y-4 sm:space-y-6">
                                        {/* Movie Title */}
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                                            {movie.title}
                                        </h1>

                                        {/* Movie Info */}
                                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <span className="text-yellow-400 text-lg">⭐</span>
                                                <span className="font-semibold text-sm sm:text-base">
                                                    {formatRating(movie.vote_average)}
                                                </span>
                                            </div>
                                            <span className="text-sm sm:text-base font-medium">
                                                {formatYear(movie.release_date)}
                                            </span>
                                            <div className="flex gap-2">
                                                {movie.genre_ids?.slice(0, 2).map((genreId) => (
                                                    <span
                                                        key={genreId}
                                                        className="bg-blue-600/80 text-white px-2 py-1 rounded text-xs font-medium"
                                                    >
                                                        {genreId === 10749 ? 'Romance' :
                                                            genreId === 18 ? 'Drama' :
                                                                genreId === 28 ? 'Action' : 'Movie'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Overview */}
                                        <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-lg">
                                            {truncateOverview(movie.overview, 200)}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-600/25 flex items-center gap-2">
                                                <span>▶</span>
                                                Watch Trailer
                                            </button> */}
                                            <button
                                                onClick={() => getDetail(movie.id)}
                                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 border border-white/30 hover:border-white/50 flex items-center gap-2">
                                                <span>ℹ️</span>
                                                More Info
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional decorative elements */}
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Empty State */}
            {!isLoading && !error && topMovies.length === 0 && (
                <div className="flex flex-col justify-center items-center h-[400px] md:h-[500px] lg:h-[600px] text-center px-4">
                    <div className="text-gray-400 text-6xl mb-4">🎬</div>
                    <h3 className="text-white text-xl font-semibold mb-2">No movies found</h3>
                    <p className="text-gray-400">Check back later for new releases</p>
                </div>
            )}
        </section>
    );
};

export default HeroSection;