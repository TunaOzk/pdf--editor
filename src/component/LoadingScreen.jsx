import React from 'react';
import { LoadingIcon } from '../assets';

function LoadingScreen() {
  return (
    <div className="absolute z-50 flex fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm
    flex justify-center items-center"
    >
      <div className="flex flex-col bg-white w-1/2 h-1/3 p-2 rounded flex items-center justify-center">
        <LoadingIcon className="animate-spin" />
        <p className="text-purple-500 text-xl">We are getting everything ready for you. Please take a moment...</p>

      </div>

    </div>
  );
}

export default LoadingScreen;
