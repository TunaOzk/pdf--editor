import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import pdfImg from '../assets/file-pdf-solid-240.png';

function DragDrop(props) {
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

  const wrapperRef = useRef(null);

  const [fileList, setFileList] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [fileCountError, setFileCountError] = useState(false);
  const [fileSizeState, setFileSizeState] = useState(false);
  const [fileExtentionState, setFileExtentionState] = useState(false);

  const onDragEnter = () => wrapperRef.current.classList.add('dragover');

  const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

  const onDrop = () => wrapperRef.current.classList.remove('dragover');

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFile = event.dataTransfer.files[0];

    if (event.dataTransfer.files && newFile && fileCount === 0) {
      convertFileToUint8Array(newFile);

      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      setFileCountError(false);
      setFileCount(fileCount + 1);
    } else {
      setFileCountError(true);
    }
  };
  function getExtension(filename) {
    return filename.split('.').pop();
  }

  const handleChange = (event) => {
    const newFile = event.target.files[0];
    const tenMB = 10485760;
    const fileExtention = getExtension(event.target.files[0].name).toLowerCase();
    const fileSize = event.target.files[0].size;
    if (newFile && fileCount === 0 && fileSize <= tenMB && fileExtention === 'pdf') {
      convertFileToUint8Array(newFile);

      const updatedList = [...fileList, newFile];
      console.log(updatedList);

      setFileList(updatedList);
      setFileCountError(false);
      setFileSizeState(false);
      setFileExtentionState(false);
      setFileCount(fileCount + 1);
    } else if (fileExtention !== 'pdf') {
      setFileExtentionState(true);
      setFileSizeState(false);
      setFileCountError(false);
    } else if (fileSize > tenMB && fileCount === 0) {
      setFileSizeState(true);
      setFileExtentionState(false);
    } else {
      setFileCountError(true);
      setFileExtentionState(false);
      setFileSizeState(false);
    }
  };
  const fileRemove = (file) => {
    setFileCount(fileCount - 1);
    const updatedList = [...fileList];
    const updatedList2 = updatedList.slice(fileList.indexOf(file), 0);
    console.log(updatedList2);
    setFileList(updatedList2);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-200">
      <div className="flex flex-col items-center justify-center w-1/2 bg-slate-100 shadow-2xl">
        <div
          className="flex items-center  mt-8 justify-center w-1/2 border-2 border-dashed bg-violet-50 border-neutral-300 rounded-md h-96 group my-2"
          role="button"
          tabIndex={0}
          onKeyDown={() => { }}
          ref={wrapperRef}
          onClick={handleClick}
          onDragOver={handleDrop}
          onDragEnter={handleDrop}
          onDragLeave={handleDrop}
          onDrop={handleDrop}
        >
          <h1 className="opacity-50 text-xl transition ease-in-out group-hover:-translate-y-2">Drag or click to upload your PDF file</h1>
          <input className="hidden" type="file" id="file" ref={inputFile} onChange={handleChange} />
        </div>
        <p className="text-red-600 text-xl">{fileSizeState ? 'You can upload max 10 MB file' : null}</p>
        <p className="text-red-600 text-xl">{fileExtentionState ? 'You can upload just .pdf extention files' : null}</p>

        {
          fileList.length > 0 ? (
            <div className="">
              <div className="flex flex-col items-center justify-center text-red-600 text-xl">
                <p>{fileCountError ? 'You can upload just one file' : null}</p>
              </div>
              <p className="flex flex-col items-center justify-center">
                Ready to upload
              </p>

              {
                fileList.map((item, index) => (
                  <div key={index.id} className="flex relavtive mb-6 mt-6 bg-slate-200 rounded-xl">
                    <img src={pdfImg} alt="" className="w-10 mr-5 mt-2 mb-2" />
                    <div className="flex flex-col justify-between mx-0 my-auto w-96">
                      <p>{item.name}</p>
                    </div>
                    <span className="hover:bg-slate-300 rounded-xl w-10 h-10 mx-0 my-auto flex items-center justify-center cursor-pointer" onClick={() => fileRemove(item)} tabIndex={0} onKeyDown={() => { }} role="button">x</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
        <form className="flex justify-between mt-2 w-1/2">
          <button className="bg-purple-500 opacity-50 text-white hover:opacity-100 rounded-md w-screen mb-2 h-8" type="button" onClick={() => navigate('/pdf-edit', { state: fileData })}>
            Submit
          </button>
        </form>
      </div>

    </div>
  );
}

export default DragDrop;
