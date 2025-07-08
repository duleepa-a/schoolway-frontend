import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <h1 className="text-4xl md:text-5xl font-bold text-primary-600 mb-2 tracking-wide">
        Oops! Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="text-7xl mb-4 animate-bounce">
        🎒
      </div>
      <a
        href="/"
        className="px-6 py-3 bg-primary hover:bg-primary-700 text-white rounded-full font-semibold shadow-md transition-colors"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;
