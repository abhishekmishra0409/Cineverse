import React, { useCallback, useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { useDispatch, useSelector } from 'react-redux';
import { dayTrendingMovies, weekTrendingMovies } from '../features/Movies/movieSlice';
import Loading from './Loading';

const TrendingSection = () => {
    const [trendType, setTrendType] = useState('day');
    const [isSwitching, setIsSwitching] = useState(false);
    const [displayData, setDisplayData] = useState([]);
    const { trendingDay, trendingWeek, isLoading } = useSelector((state) => state.movies);
    const dispatch = useDispatch();

    const fetchData = useCallback(async (type) => {
        setIsSwitching(true);
        try {
            if (type === 'day') {
                await dispatch(dayTrendingMovies());
            } else {
                await dispatch(weekTrendingMovies());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSwitching(false);
        }
    }, [dispatch]);

    useEffect(() => {
        const selectedData = trendType === 'day' ? trendingDay : trendingWeek;
        if (selectedData && selectedData.length > 0) {
            setDisplayData(selectedData);
            setIsSwitching(false);
            return;
        }

        fetchData(trendType);
    }, [fetchData, trendType, trendingDay, trendingWeek]);

    const handleTrendChange = (type) => {
        if (type === trendType) return;
        setTrendType(type);
    };

    const showInitialLoader = isLoading && displayData.length === 0;

    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12">
                    <div className="space-y-3">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                            Trending Movies
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            What's popular {trendType === 'day' ? 'today' : 'this week'}
                        </p>
                    </div>

                    {/* Trend Type Toggle */}
                    <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl border border-gray-300 dark:border-gray-700">
                        <button
                            onClick={() => handleTrendChange('day')}
                            className={`px-6 py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 min-w-[100px] ${trendType === 'day'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-300 dark:border-gray-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => handleTrendChange('week')}
                            className={`px-6 py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 min-w-[100px] ${trendType === 'week'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-300 dark:border-gray-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            This Week
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {showInitialLoader ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <Loading />
                            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
                                Loading trending movies...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Movies Grid */}
                        {displayData && displayData.length > 0 ? (
                            <div className="relative">
                                {isSwitching && (
                                    <div className="absolute inset-0 z-20 bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                                        <Loading />
                                    </div>
                                )}

                                <div className="
                                grid 
                                grid-cols-2 
                                sm:grid-cols-3 
                                md:grid-cols-4 
                                lg:grid-cols-5 
                                xl:grid-cols-5
                                2xl:grid-cols-5
                                gap-4 sm:gap-5
                            ">
                                    {displayData.slice(0, 12).map((movie, index) => (
                                        <div key={movie.id} className="flex justify-center">
                                            <div className="relative group">
                                                {/* Trending Badge for Top 3 */}
                                                {index < 3 && (
                                                    <div className={`
                                                    absolute -top-2 -left-2 z-10 
                                                    px-3 py-1 rounded-full text-xs font-bold text-white
                                                    shadow-lg transform group-hover:scale-110 transition-transform duration-300
                                                    ${index === 0
                                                            ? 'bg-yellow-500'
                                                            : index === 1
                                                                ? 'bg-gray-500'
                                                                : 'bg-amber-700'
                                                        }
                                                `}>
                                                        #{index + 1}
                                                    </div>
                                                )}
                                                <MovieCard {...movie} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-6xl mb-4 text-gray-400">📊</div>
                                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                                    No Trending Movies
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500 max-w-md text-lg mb-6">
                                    No trending movies found for {trendType === 'day' ? 'today' : 'this week'}.
                                    Check back later for updates.
                                </p>
                                <button
                                    onClick={() => fetchData(trendType)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}


                    </>
                )}

            </div>
        </section>
    );
};

export default TrendingSection;