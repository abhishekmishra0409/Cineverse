import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/userSlice";
import { FaUserCircle, FaMoon, FaSun, FaFilm, FaTv } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { MdHome } from "react-icons/md";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.users);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowMobileSearch(false);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        dispatch(logout());
        navigate("/login");
        setDropdownOpen(false);
    };

    const closeAllMenus = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        setShowMobileSearch(false);
    };

    return (
        <>
            <nav
                className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg"
                    : "bg-white dark:bg-gray-900 shadow-md"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link
                            onClick={closeAllMenus}
                            to="/"
                            className="flex items-center space-x-2 md:space-x-3 group"
                        >
                            <img
                                src="/logo.png"
                                className="h-8 md:h-10 object-cover transition-transform duration-300 group-hover:scale-110"
                                alt="CineVerse Logo"
                            />
                            <span className="hidden sm:block text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                CineVerse
                            </span>
                        </Link>

                        {/* Desktop Search */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden lg:flex items-center flex-1 max-w-md mx-8"
                        >
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <CiSearch className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search movies, TV shows..."
                                    className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                                >
                                    <CiSearch className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-1">
                            <Link
                                onClick={closeAllMenus}
                                to="/"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                            >
                                <MdHome className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <Link
                                onClick={closeAllMenus}
                                to="/movies"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                            >
                                <FaFilm className="w-4 h-4" />
                                <span>Movies</span>
                            </Link>
                            <Link
                                onClick={closeAllMenus}
                                to="/tv-shows"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                            >
                                <FaTv className="w-4 h-4" />
                                <span>TV Shows</span>
                            </Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 md:space-x-3">
                            {/* Mobile Search Icon */}
                            <button
                                onClick={() => setShowMobileSearch(true)}
                                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                <CiSearch className="w-6 h-6" />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-700 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                {theme === "light" ? (
                                    <FaMoon className="w-5 h-5" />
                                ) : (
                                    <FaSun className="w-5 h-5" />
                                )}
                            </button>

                            {/* User Menu */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 px-3 md:px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <FaUserCircle className="w-5 h-5" />
                                        <span className="hidden sm:inline text-sm">
                                            {user.username}
                                        </span>
                                    </button>

                                    {dropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden animate-dropdown">
                                                <Link
                                                    onClick={closeAllMenus}
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                >
                                                    <FaUserCircle className="w-4 h-4" />
                                                    <span>Profile</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                >
                                                    <IoClose className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" onClick={closeAllMenus}>
                                    <button className="px-4 md:px-5 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
                                        Login
                                    </button>
                                </Link>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                {mobileMenuOpen ? (
                                    <IoClose className="w-6 h-6" />
                                ) : (
                                    <IoMenu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slide-down">
                        <div className="px-4 py-4 space-y-2">
                            <Link
                                onClick={closeAllMenus}
                                to="/"
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                <MdHome className="w-5 h-5" />
                                <span className="font-medium">Home</span>
                            </Link>
                            <Link
                                onClick={closeAllMenus}
                                to="/movies"
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                <FaFilm className="w-5 h-5" />
                                <span className="font-medium">Movies</span>
                            </Link>
                            <Link
                                onClick={closeAllMenus}
                                to="/tv-shows"
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                <FaTv className="w-5 h-5" />
                                <span className="font-medium">TV Shows</span>
                            </Link>
                            {!user && (
                                <Link to="/login" onClick={closeAllMenus}>
                                    <button className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium transition-all duration-200 mt-2">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 animate-fade-in">
                    <div className="h-16 md:h-20 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
                        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3">
                            <div className="relative flex-1">
                                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search movies, TV shows..."
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowMobileSearch(false)}
                                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                <IoClose className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;