import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenres } from "../features/Movies/movieSlice";

const SidebarFilter = ({ setSelectedGenre, selectedGenre, setPage }) => {
    const dispatch = useDispatch();
    const { genres } = useSelector((state) => state.movies);

    useEffect(() => {
        dispatch(fetchGenres());
    }, [dispatch]);

    const handleGenreClick = (genreId) => {
        setSelectedGenre(genreId);
        setPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Genres
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2 scrollbar scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {genres.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => handleGenreClick(genre.id)}
                        className={`text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium border
                            ${selectedGenre === genre.id
                                ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            }`}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SidebarFilter;