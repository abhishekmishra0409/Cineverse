import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaKey, FaEdit } from 'react-icons/fa';

const UserCard = (user) => {
    const userInfo = [
        {
            icon: FaUser,
            label: 'Username',
            value: user.username,
            color: 'blue'
        },
        {
            icon: FaEnvelope,
            label: 'Email',
            value: user.email,
            color: 'green'
        },
        {
            icon: FaPhone,
            label: 'Phone',
            value: user.phone || 'Not provided',
            color: 'purple'
        },
        {
            icon: FaKey,
            label: 'Password',
            value: '••••••••',
            color: 'red'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <FaUser className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user.username}</h1>
                            <p className="text-blue-100">Movie Enthusiast</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Information */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userInfo.map((info, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                        >
                            <div className={`p-3 bg-${info.color}-100 dark:bg-${info.color}-900/30 rounded-lg`}>
                                <info.icon className={`text-${info.color}-600 dark:text-${info.color}-400 text-lg`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {info.label}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                    {info.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default UserCard;