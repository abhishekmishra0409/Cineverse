import React from 'react';
import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Social Links */}
                    <div className="flex space-x-4">
                        <a target='_blank' rel="noopener noreferrer" href="https://github.com/abhishekmishra0409/" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors duration-200">
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/abhishekmishra04/" className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors duration-200">
                            <FaLinkedin className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © {currentYear} All rights reserved.
                        </p>
                        <p className="font-medium mt-1 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1">
                            Made with <FaHeart className="text-red-500 w-3 h-3" /> by Abhishek Mishra
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;