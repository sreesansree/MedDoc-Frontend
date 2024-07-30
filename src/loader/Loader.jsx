import React from 'react';

function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="loader mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 animate-fade">
         MedDoc....
        </h1>
      </div>
    </div>
  );
}

export default Loader;
