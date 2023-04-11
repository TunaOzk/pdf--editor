import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfImg from '../assets/file-pdf-solid-240.png';
import PdfAsset from '../assets/pdf_asset.png';
import { ReactComponent as PdfLogo } from '../assets/pdf_logo.svg';
import { ReactComponent as MainPageBackground } from '../assets/rose-petals.svg';

import PopUp from './PopUp';

function DragDrop() {
  const inputFile = useRef(null);
  const [fileData, setFileData] = useState([]);
  const navigate = useNavigate();
  const convertFileToUint8Array = (file) => {
    const fReader = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onloadend = ((event) => {
      const uri = event.target.result;
      setFileData((prevData) => {
        const newArr = [...prevData, { base64: uri, name: file.name }];
        return newArr;
      });
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
  const [showPopUp, setshowPopUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  function getExtension(filename) {
    return filename.split('.').pop();
  }

  function checkPopUp() {
    if (fileSizeState) {
      setErrorMessage('You can upload max 10 MB file');
      setshowPopUp(false);
    } else if (fileCountError) {
      setErrorMessage('You can not upload more than three files');
      setshowPopUp(false);
    } else if (fileExtentionState) {
      setErrorMessage('You can upload just .pdf extention files');
      setshowPopUp(false);
    }
  }
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFile = event.dataTransfer.files[0];
    const tenMB = 10485760;
    const fileExtention = getExtension(newFile.name).toLowerCase();
    const fileSize = newFile.size;

    if (event.dataTransfer.files && newFile && fileCount < 3 && fileSize <= tenMB && fileExtention === 'pdf') {
      convertFileToUint8Array(newFile);

      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      setFileCountError(false);
      setFileSizeState(false);
      setFileExtentionState(false);
      setFileCount(fileCount + 1);
    } else if (fileExtention !== 'pdf') {
      setFileExtentionState(true);
      setFileSizeState(false);
      setFileCountError(false);
      setshowPopUp(false);
      setErrorMessage('You can upload just .pdf extention files');

      checkPopUp();
    } else if (fileSize > tenMB && fileCount < 3) {
      setFileSizeState(true);
      setFileExtentionState(false);
      setshowPopUp(false);
      setErrorMessage('You can upload max 10 MB file');

      checkPopUp();
    } else if (fileCount === 3) {
      setFileCountError(true);
      setFileExtentionState(false);
      setFileSizeState(false);
      setshowPopUp(false);
      setErrorMessage('You can not upload more than three files');

      checkPopUp();
    }
  };

  const handleChange = (event) => {
    const newFile = event.target.files[0];
    const tenMB = 10485760;
    const fileExtention = getExtension(newFile.name).toLowerCase();
    const fileSize = newFile.size;
    if (newFile && fileCount < 3 && fileSize <= tenMB && fileExtention === 'pdf') {
      convertFileToUint8Array(newFile);

      const updatedList = [...fileList, newFile];

      setFileList(updatedList);
      setFileCountError(false);
      setFileSizeState(false);
      setFileExtentionState(false);
      setFileCount(fileCount + 1);
    } else if (fileExtention !== 'pdf') {
      setFileExtentionState(true);
      setFileSizeState(false);
      setFileCountError(false);
      setshowPopUp(false);
      setErrorMessage('You can upload just .pdf extention files');

      checkPopUp();
    } else if (fileSize > tenMB && fileCount < 3) {
      setFileSizeState(true);
      setFileExtentionState(false);
      setshowPopUp(false);
      setErrorMessage('You can upload max 10 MB file');

      checkPopUp();
    } else if (fileCount === 3) {
      setFileCountError(true);
      setFileExtentionState(false);
      setFileSizeState(false);
      setshowPopUp(false);
      setErrorMessage('You can not upload more than three files');

      checkPopUp();
    }
  };
  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    setFileCount(fileCount - 1);
    setFileData((prevData) => prevData.filter((item, index) => item.name !== file.name));
  };

  const handleOnClose = () => setshowPopUp(true);
  return (

    <div className=" flex items-center justify-center h-screen bg-stone-200">
      <div className="flex bg-[url('../assets/rose-petals.svg')]  h-full w-1/2 bg-cover bg-center ml-0 mr-auto">
        <div className="flex flex-col items-center justify-center">
          <PdfLogo className="w-32 p-4 fill-fuchsia-300" />
          <h1 className="max-[600px]:text-lg  max-[600px]:ml-4 max-[600px]:font-medium min-[600px]:text-3xl min-[600px]:font-semibold text-white mb-8">Manipulate The PDFs Documents</h1>
          <p className="max-[600px]:text-sm min-[300px]:w-4/6 text-white lg:w-2/5 text-xl mb-8">
            With PDF Editor, you have a dedicated tool for editing your PDF documents.
            Add text, fillable texts or you can merge, split and replace the pdf pages
            and even drawings. Manipulate PDF as you want.
          </p>
        </div>
      </div>
      <div className="min-[300px]:overflow-hidden min-[300px]:rounded-lg flex flex-col items-center justify-center w-1/2 bg-slate-100 shadow-2xl h-screen">

        <div
          className="min-[300px]:w-5/6  flex items-center  mt-8 justify-center lg:w-3/5 border-2 border-dashed bg-violet-50 border-neutral-300 rounded-md md:h-96 min-[300px]:h-96 group my-2"
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
        {
          fileList.length > 0 ? (
            <div className="">
              <p className="flex flex-col items-center justify-center">
                Ready to upload
              </p>

              {
                fileList.map((item, index) => (
                  <div key={item.name} className="flex relavtive mb-6 mt-6 bg-slate-200 rounded-xl">
                    <img src={pdfImg} alt="" className="w-10 mr-5 mt-2 mb-2" />
                    <div className="min-[300px]:w-auto flex flex-col justify-between mx-0 my-auto md:w-96">
                      <p className="min-[300px]:text-xs sm:text-sm md:text-base">{item.name}</p>
                    </div>
                    <span className=" hover:bg-slate-300 rounded-xl mr-0 ml-auto w-10 h-10 mx-0 my-auto flex items-center justify-center cursor-pointer" onClick={() => fileRemove(item)} tabIndex={0} onKeyDown={() => { }} role="button">x</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
        <form id="form" className="flex justify-between mt-2 w-1/2">
          <button
            className=" bg-purple-500 opacity-50 text-white hover:opacity-100 rounded-md w-screen mb-2 h-12"
            type="button"
            onClick={() => { navigate('/select-operation', { state: fileData }); }}
          >
            Modify the PDFs
          </button>
        </form>
      </div>

      <PopUp alert={showPopUp} onClose={handleOnClose} errorMessages={errorMessage} />

    </div>
  );
}

export default DragDrop;
