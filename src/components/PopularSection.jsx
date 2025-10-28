import React, { useCallback, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { popularMovies } from '../features/Movies/movieSlice';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const PopularSection = () => {
    const { popular, isLoading } = useSelector((state) => state.movies);
    const dispatch = useDispatch();
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const swiperRef = useRef(null);

    const fetchData = useCallback(async () => {
        try {
            await dispatch(popularMovies());
        } catch (e) {
            console.error(e);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12 px-2">
                    <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                            Popular Movies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Trending now worldwide
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            ref={navigationPrevRef}
                            className="popular-prev p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous movies"
                        >
                            <IoChevronBackOutline className="w-6 h-6 sm:w-7 sm:h-7" />
                        </button>

                        <button
                            ref={navigationNextRef}
                            className="popular-next p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next movies"
                        >
                            <IoChevronForwardOutline className="w-6 h-6 sm:w-7 sm:h-7" />
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex space-x-4 overflow-hidden">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex-shrink-0 w-48 space-y-4">
                                    <div className="bg-gray-300 dark:bg-gray-700 rounded-xl h-80 w-48"></div>
                                    <div className="space-y-2">
                                        <div className="bg-gray-300 dark:bg-gray-700 rounded h-4 w-32"></div>
                                        <div className="bg-gray-300 dark:bg-gray-700 rounded h-3 w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Swiper Section */}
                {!isLoading && (
                    <div className="relative">
                        <Swiper
                            ref={swiperRef}
                            modules={[Navigation, Autoplay]}
                            navigation={{
                                prevEl: '.popular-prev',
                                nextEl: '.popular-next',
                            }}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            loop={true}
                            speed={800}
                            spaceBetween={20}
                            slidesPerView="auto"
                            breakpoints={{
                                320: {
                                    slidesPerView: 2,
                                    spaceBetween: 16,
                                    slidesOffsetBefore: 16,
                                    slidesOffsetAfter: 16,
                                },
                                480: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    slidesOffsetBefore: 16,
                                    slidesOffsetAfter: 16,
                                },
                                640: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                    slidesOffsetBefore: 0,
                                    slidesOffsetAfter: 0,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 24,
                                    slidesOffsetBefore: 0,
                                    slidesOffsetAfter: 0,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 24,
                                    slidesOffsetBefore: 0,
                                    slidesOffsetAfter: 0,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    spaceBetween: 24,
                                    slidesOffsetBefore: 0,
                                    slidesOffsetAfter: 0,
                                },
                                1536: {
                                    slidesPerView: 5,
                                    spaceBetween: 24,
                                    slidesOffsetBefore: 0,
                                    slidesOffsetAfter: 0,
                                }
                            }}
                            className="!overflow-hidden"
                            style={{
                                overflow: 'hidden',
                                padding: '0px',
                                margin: '0px'
                            }}
                        >
                            {popular && popular.length > 0 ? (
                                popular.map((movie) => (
                                    <SwiperSlide
                                        key={movie.id}
                                        className="!h-auto !flex justify-center"
                                        style={{
                                            width: 'auto',
                                            height: 'auto'
                                        }}
                                    >
                                        <div className="w-full max-w-[200px] py-2 sm:max-w-[220px] md:max-w-[240px] transform transition-transform duration-300 hover:scale-105">
                                            <MovieCard {...movie} />
                                        </div>
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide className="!w-full">
                                    <div className="w-full flex flex-col items-center justify-center py-16 text-center">
                                        <div className="text-6xl mb-4 text-gray-400">🎬</div>
                                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                            No popular movies found
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-500">
                                            Check back later for trending movies
                                        </p>
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>

                        {/* Gradient overlays for better UX - Only show when needed */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none z-10 opacity-0 sm:opacity-100 transition-opacity"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none z-10 opacity-0 sm:opacity-100 transition-opacity"></div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularSection;