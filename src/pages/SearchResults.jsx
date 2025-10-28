import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { searchMovies } from "../features/Movies/movieSlice";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { FaSearch, FaFilm, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const SearchPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { movies, isLoading, totalResults } = useSelector((state) => state.movies);
    const [searchTime, setSearchTime] = useState(null);

    const query = new URLSearchParams(location.search).get("q");

    useEffect(() => {
        window.scrollTo({ top: 0 });
        if (query) {
            const startTime = Date.now();
            dispatch(searchMovies({ query })).then(() => {
                const endTime = Date.now();
                setSearchTime(endTime - startTime);
            });
        }
    }, [dispatch, query]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const formatSearchTime = (time) => {
        if (time < 1000) return `${time}ms`;
        return `${(time / 1000).toFixed(2)}s`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors duration-200"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <FaSearch className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                        Search Results
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Showing results for:{" "}
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">"{query}"</span>
                                    </p>
                                </div>
                            </div>

                            {/* Search Stats */}
                            {!isLoading && movies && (
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    {totalResults > 0 && (
                                        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                            <span className="font-semibold">{totalResults}</span> results
                                        </div>
                                    )}
                                    {searchTime && (
                                        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                            in <span className="font-semibold">{formatSearchTime(searchTime)}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loading />
                        <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">
                            Searching for "{query}"...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results Grid */}
                        {movies && movies.length > 0 ? (
                            <div className="space-y-6">
                                {/* Results Info */}
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Found <span className="font-semibold text-gray-900 dark:text-white">{movies.length}</span> movies
                                    </p>
                                </div>

                                {/* Movies Grid with Fixed Size Cards */}
                                <div className="
                                    grid 
                                    grid-cols-2 
                                    sm:grid-cols-3 
                                    md:grid-cols-4 
                                    lg:grid-cols-5 
                                    xl:grid-cols-5
                                    gap-4 sm:gap-5
                                ">
                                    {movies.map((movie) => (
                                        <div key={movie.id} className="flex justify-center">
                                            <div className="w-full w-[180px] sm:max-w-[200px]">
                                                <MovieCard {...movie} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Button (if you implement pagination) */}
                                {totalResults > movies.length && (
                                    <div className="flex justify-center mt-8">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-600/25">
                                            Load More Results
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="text-6xl mb-4 text-gray-400">
                                    <FaExclamationTriangle />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
                                    No Movies Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500 max-w-md text-lg mb-6">
                                    We couldn't find any movies matching "<span className="text-blue-600 dark:text-blue-400 font-semibold">{query}</span>".
                                    Try adjusting your search terms or browse our collection.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <button
                                        onClick={handleBackClick}
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={() => navigate('/movies')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Browse Movies
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;