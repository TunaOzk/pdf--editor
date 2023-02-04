import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DragDrop() {
  const inputFile = useRef(null);
  const [fileData, setFileData] = useState(null);
  const navigate = useNavigate();

  function convertDataURIToBinary(dataURI) {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i += 1) {
      array[i] = raw.charCodeAt(i);
    }
    setFileData(array);
  }

  const convertFileToUint8Array = (file) => {
    const fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onloadend = ((event) => {
      const uri = event.target.result;
      convertDataURIToBinary(uri);
    });
  };

  const handleClick = () => {
    inputFile.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      convertFileToUint8Array(file);
    }
  };

  const handleChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      convertFileToUint8Array(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">

      <div className="flex items-center justify-center w-1/2 border-4 border-sky-500 rounded-md h-96 group" role="button" tabIndex={0} onKeyDown={() => { }} onClick={handleClick} onDragOver={handleDrop} onDragEnter={handleDrop} onDrop={handleDrop}>
        <h1 className="opacity-50 text-xl transition ease-in-out group-hover:-translate-y-2">Drag or click to upload your PDF file</h1>
        <input className="hidden" type="file" id="file" ref={inputFile} onChange={handleChange} />
      </div>

      <form className="flex mt-2 justify-between w-1/2">
        <button className="bg-indigo-500 rounded-md w-screen h-8" type="button" onClick={() => navigate('/pdf-edit', { state: fileData })}>
          Submit
        </button>
      </form>

    </div>
  );
}

export default DragDrop;
