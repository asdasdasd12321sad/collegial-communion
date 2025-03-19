
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cendy-gray">
      <div className="text-center">
        <div className="mb-4 flex animate-pulse-subtle flex-col items-center">
          <h1 className="mb-2 text-3xl font-bold text-cendy-blue">Cendy</h1>
          <div className="h-1 w-12 bg-cendy-blue" />
        </div>
        
        <div className="relative h-6 w-48">
          <div className="absolute h-1 w-full rounded-full bg-cendy-gray-medium"></div>
          <div 
            className="absolute h-1 animate-pulse rounded-full bg-cendy-blue"
            style={{
              width: '30%',
              animation: 'loading 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          ></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { left: 0%; width: 0%; }
          50% { width: 30%; }
          100% { left: 100%; width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
