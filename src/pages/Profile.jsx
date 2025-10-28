import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchFavourite,
    fetchLastViewed,
    fetchWatchnext,
    removeFavourite,
    removeLastviewed,
    removeWatchnext,
} from "../features/Profile/profileSlice";
import UserCard from "../components/UserCard";
import MovieCard from "../components/MovieCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { FaHeart, FaClock, FaHistory, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Profile = () => {
    const dispatch = useDispatch();
    const { favourite, watchnext, lastviewed, isLoading } = useSelector((state) => state.profile);
    const { user } = useSelector((state) => state.users);

    const swiperRefs = useRef({});
    const navigationPrevRefs = useRef({});
    const navigationNextRefs = useRef({});

    const fetchData = useCallback(
        async (id) => {
            try {
                await dispatch(fetchFavourite(id));
                await dispatch(fetchWatchnext(id));
                await dispatch(fetchLastViewed(id));
            } catch (error) {
                console.error("fetch error:", error);
            }
        },
        [dispatch]
    );

    const removeFav = (id, idx) => {
        dispatch(removeFavourite({ id, idx }));
        toast.info("Removed from Favourites");
    };

    const removeNext = (id, idx) => {
        dispatch(removeWatchnext({ id, idx }));
        toast.info("Removed from Watch Next");
    };

    const removelast = (id, idx) => {
        dispatch(removeLastviewed({ id, idx }));
        toast.info("Removed from Last Viewed");
    };

    useEffect(() => {
        window.scrollTo({ top: 0 });
        if (user?.id) fetchData(user.id);
    }, [fetchData, user]);

    const sections = [
        {
            key: 'favourite',
            title: 'Favourite Movies',
            icon: FaHeart,
            data: favourite,
            removeHandler: removeFav,
            color: 'red',
            emptyMessage: 'No favourite movies yet. Start adding some movies to your favourites!'
        },
        {
            key: 'watchnext',
            title: 'Watch Next',
            icon: FaClock,
            data: watchnext,
            removeHandler: removeNext,
            color: 'blue',
            emptyMessage: 'Your watchlist is empty. Add movies you want to watch later!'
        },
        {
            key: 'lastviewed',
            title: 'Recently Viewed',
            icon: FaHistory,
            data: lastviewed,
            removeHandler: removelast,
            color: 'green',
            emptyMessage: 'No recently viewed movies. Start browsing to build your history!'
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* User Profile Section */}
                <div className="mb-12">
                    <UserCard {...user} />
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <FaHeart className="text-2xl text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {favourite?.length || 0}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">Favourites</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <FaClock className="text-2xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {watchnext?.length || 0}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">Watchlist</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <FaHistory className="text-2xl text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {lastviewed?.length || 0}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">Recently Viewed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Movie Sections */}
                {sections.map((section, sectionIndex) => (
                    <div key={section.key} className="mb-16">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 bg-${section.color}-100 dark:bg-${section.color}-900/30 rounded-xl`}>
                                    <section.icon className={`text-2xl text-${section.color}-600 dark:text-${section.color}-400`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {section.data?.length || 0} items
                                    </p>
                                </div>
                            </div>

                            {section.data && section.data.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        ref={el => navigationPrevRefs.current[section.key] = el}
                                        className={`prev-${section.key} p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md`}
                                        aria-label={`Previous ${section.title}`}
                                    >
                                        <IoChevronBackOutline className="w-5 h-5" />
                                    </button>
                                    <button
                                        ref={el => navigationNextRefs.current[section.key] = el}
                                        className={`next-${section.key} p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md`}
                                        aria-label={`Next ${section.title}`}
                                    >
                                        <IoChevronForwardOutline className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Movie Slider */}
                        {section.data && section.data.length > 0 ? (
                            <div className="relative">
                                <Swiper
                                    modules={[Navigation]}
                                    navigation={{
                                        prevEl: `.prev-${section.key}`,
                                        nextEl: `.next-${section.key}`,
                                    }}
                                    slidesPerView={2}
                                    spaceBetween={20}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 2,
                                            spaceBetween: 12
                                        },
                                        480: {
                                            slidesPerView: 2,
                                            spaceBetween: 16
                                        },
                                        640: {
                                            slidesPerView: 3,
                                            spaceBetween: 18
                                        },
                                        768: {
                                            slidesPerView: 4,
                                            spaceBetween: 20
                                        },
                                        1024: {
                                            slidesPerView: 4,
                                            spaceBetween: 24
                                        },
                                        1280: {
                                            slidesPerView: 5,
                                            spaceBetween: 24
                                        },
                                    }}
                                    className="px-2"
                                >
                                    {[...section.data].reverse().map((item, idx) => {
                                        const originalIdx = section.data.length - 1 - idx;
                                        return (
                                            <SwiperSlide key={item?.id}>
                                                <div className="relative group pb-4">
                                                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button
                                                            onClick={() => section.removeHandler(item?.id, originalIdx)}
                                                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                                                            aria-label={`Remove from ${section.title}`}
                                                        >
                                                            <FaTrash className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="transform transition-transform duration-300 group-hover:scale-105">
                                                        <MovieCard {...item?.movie} />
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>
                        ) : (
                            // Empty State
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                                <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">
                                    <section.icon />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                                    {section.title} is Empty
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto text-lg">
                                    {section.emptyMessage}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;