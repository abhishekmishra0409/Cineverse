import React from "react";
import { Link } from "react-router";

const MovieCard = ({ id, title, name, poster_path, release_date, first_air_date, vote_average, media_type }) => {
    const formatRating = (rating) => (rating ? rating.toFixed(1) : "NR");
    const formatDate = (dateString) => {
        if (!dateString) return "TBA";
        return new Date(dateString).getFullYear();
    };

    const isTV = media_type === "tv" || !!name;
    const finalTitle = title || name;
    const finalDate = release_date || first_air_date;

    const linkPath = isTV ? `/tv/${id}` : `/movie/${id}`;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
            <Link to={linkPath} className="block">
                {/* Poster */}
                <div className="w-full h-80 relative overflow-hidden">
                    {poster_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                            alt={finalTitle}
                            className="w-full h-[360px] object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <span className="text-lg font-medium">No Image</span>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900 dark:text-white">
                        {finalTitle}
                    </h3>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {formatDate(finalDate)}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-yellow-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-full">
                            ⭐ {formatRating(vote_average)}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;