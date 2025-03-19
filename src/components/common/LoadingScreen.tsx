
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cendy-gray">
      <div className="animate-pulse text-center">
        <div className="mb-4 h-12 w-12 rounded-full border-4 border-t-transparent border-cendy-blue animate-spin mx-auto"></div>
        <h1 className="text-2xl font-bold text-cendy-blue">Loading...</h1>
        
        {/* Loading animation styles */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LoadingScreen;
