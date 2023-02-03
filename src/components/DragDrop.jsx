import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

function DragDrop() {
  const inputFile = useRef(null);

  const handleClick = () => {
    inputFile.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      console.log(file);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">

      <div className="flex items-center justify-center w-1/2 border-4 border-sky-500 rounded-md h-96 group" role="button" tabIndex={0} onKeyDown={() => { }} onClick={handleClick} onDragOver={handleDrop} onDragEnter={handleDrop} onDrop={handleDrop}>
        <h1 className="opacity-50 text-xl transition ease-in-out group-hover:-translate-y-2">Drag or click to upload your PDF file</h1>
        <input className="hidden" type="file" id="file" ref={inputFile} />
      </div>

      <form className="flex mt-2 justify-between w-1/2">
        <button className="bg-indigo-500 rounded-md w-screen h-8" type="button">

          <div className="flex justify-center">
            <Link className="flex-1" to="/pdf-edit">
              Submit
            </Link>
          </div>

        </button>
      </form>

    </div>
  );
}

export default DragDrop;
