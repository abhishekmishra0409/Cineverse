import React, { useCallback, useEffect, useState } from "react";
import { discoverMovies, moviesByGenre } from "../features/Movies/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../components/MovieCard";
import SidebarFilter from "../components/Sidebar";
import Loading from "../components/Loading";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Movies = () => {
    const { movies, isLoading, totalPages } = useSelector((state) => state.movies);
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filterType, setFilterType] = useState("discover");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            await dispatch(discoverMovies({ page, filterType }));
        } catch (e) {
            console.error(e);
        }
    }, [dispatch, page, filterType]);

    const fetchGenreData = useCallback(
        async (genreId, pageNum) => {
            try {
                await dispatch(moviesByGenre({ genreId, page: pageNum }));
            } catch (e) {
                console.error(e);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (!selectedGenre) {
            fetchData();
        } else {
            fetchGenreData(selectedGenre, page);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page, filterType, selectedGenre, fetchData, fetchGenreData]);

    const nextPage = () => page < totalPages && setPage((prev) => prev + 1);
    const prevPage = () => page > 1 && setPage((prev) => prev - 1);

    const handleFilter = (type) => {
        setFilterType(type);
        setDropdownOpen(false);
        setPage(1);
    };

    const handleGenreSelect = (genreId) => {
        setSelectedGenre(genreId);
        setPage(1);
        setSidebarOpen(false);
    };

    const clearFilters = () => {
        setSelectedGenre(null);
        setFilterType("discover");
        setPage(1);
    };

    // Generate pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than max visible
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            // Always show first page
            buttons.push(1);

            // Calculate start and end of visible pages
            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);

            // Adjust if we're near the start
            if (page <= 3) {
                end = 4;
            }

            // Adjust if we're near the end
            if (page >= totalPages - 2) {
                start = totalPages - 3;
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                buttons.push('...');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                buttons.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                buttons.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                buttons.push(totalPages);
            }
        }

        return buttons;
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Filters
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6  mx-auto">
                {/* Sidebar Filter - Responsive */}
                <div className={`
                    ${sidebarOpen ? 'block fixed inset-0 z-50 bg-black bg-opacity-50' : 'hidden'} 
                    lg:block lg:relative lg:z-auto
                `}>
                    <div className={`
                        bg-white dark:bg-gray-800 w-80 h-full lg:h-auto lg:rounded-xl shadow-xl lg:shadow-lg 
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}>
                        <div className="p-4 lg:p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <SidebarFilter
                                setSelectedGenre={handleGenreSelect}
                                selectedGenre={selectedGenre}
                                setPage={setPage}
                            />

                            {(selectedGenre || filterType !== "discover") && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedGenre ? 'Genre Movies' : 'All Movies'}
                                </h1>
                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                                    {movies.length} results
                                </span>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-lg px-4 py-2.5 transition-colors min-w-[160px] justify-between"
                                >
                                    <span>
                                        {filterType === "discover" ? "Discover" :
                                            filterType === "year" ? "By Year" : "Top Rated"}
                                    </span>
                                    <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20">
                                            <button
                                                onClick={() => handleFilter("discover")}
                                                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 first:rounded-t-lg last:rounded-b-lg last:border-b-0"
                                            >
                                                Discover
                                            </button>
                                            <button
                                                onClick={() => handleFilter("year")}
                                                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 first:rounded-t-lg last:rounded-b-lg last:border-b-0"
                                            >
                                                By Year
                                            </button>
                                            <button
                                                onClick={() => handleFilter("rating")}
                                                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 first:rounded-t-lg last:rounded-b-lg last:border-b-0"
                                            >
                                                Top Rated
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Movie Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            {/* Movie Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                                {movies.length > 0 ? (
                                    movies.map((movie) => (
                                        <div
                                            key={movie.id}
                                            className="flex justify-center items-start"
                                        >
                                            <div className="w-[220px] md:w-[240px] lg:w-[260px]">
                                                <MovieCard {...movie} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                        <div className="text-6xl mb-4 text-gray-400">🎬</div>
                                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                            No movies found
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-500 mb-4">
                                            Try adjusting your filters or search criteria
                                        </p>
                                        <button
                                            onClick={clearFilters}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>


                            {/* Pagination */}
                            {movies.length > 0 && totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
                                    {/* Page Info */}
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Page {page} of {totalPages}
                                    </div>

                                    {/* Desktop Pagination */}
                                    <div className="hidden sm:flex items-center gap-2">
                                        <button
                                            onClick={prevPage}
                                            disabled={page === 1}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 font-medium
                    ${page === 1
                                                    ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600"
                                                    : "cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            <FaChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1 overflow-x-auto max-w-[60vw] px-2">
                                            {renderPaginationButtons().map((pageNum, index) =>
                                                pageNum === "..." ? (
                                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`px-3 py-2 rounded-md border transition-colors font-medium min-w-[40px]
                                ${page === pageNum
                                                                ? "bg-blue-600 border-blue-600 text-white"
                                                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        <button
                                            onClick={nextPage}
                                            disabled={page === totalPages}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 font-medium
                    ${page === totalPages
                                                    ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600"
                                                    : "cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            Next
                                            <FaChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Mobile Pagination */}
                                    <div className="flex sm:hidden items-center justify-center gap-4 w-full">
                                        <button
                                            onClick={prevPage}
                                            disabled={page === 1}
                                            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border w-1/3
                    ${page === 1
                                                    ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600"
                                                    : "cursor-pointer bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            <FaChevronLeft className="w-4 h-4" />
                                            Prev
                                        </button>

                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {page}/{totalPages}
                                        </span>

                                        <button
                                            onClick={nextPage}
                                            disabled={page === totalPages}
                                            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border w-1/3
                    ${page === totalPages
                                                    ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-400 border-gray-300 dark:border-gray-600"
                                                    : "cursor-pointer bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            Next
                                            <FaChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Series per page */}
                                    <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                                        {movies.length} series per page
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Movies;