import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import pdfImg from '../assets/file-pdf-solid-240.png';
import { PDF_MERGE_PAGE_PATH, EDIT_PDF_PAGE_PATH, PDF_SPLIT_PAGE_PATH } from '../constants/routePaths';
import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as MergeIcon } from '../assets/merge.svg';
import { ReactComponent as SplitIcon } from '../assets/split.svg';

function OperationPage() {
  const location = useLocation();
  const fileNames = [...Array(location.state.length)]
    .map((value, index) => location.state[index].name);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-stone-200">
      <h1 className="mr-12 text-4xl">Operations</h1>
      <h2 className="mt-6 mr-12 text-l">Select an operation to start modify your PDF documents</h2>
      <div className="mt-16 flex grid grid-cols-3 gap-12">
        <div
          onClick={() => setIsVisible((prev) => !prev)}
          tabIndex={0}
          onKeyDown={() => { }}
          role="button"
          className={`flex transition ease-in-out delay-200 ${!isVisible ? 'hover:scale-110' : 'scale-110'} group`}
        >
          <div className={`transition-opacity ease-in duration-300 ${isVisible ? 'opacity-0' : 'opacity-100'}`}>
            <div>
              <EditIcon className="relative z-10" />
              <h1 className="text-xl ml-8">PDF Edit</h1>
            </div>

            <br />
            <p className="opacity-0 group-hover:opacity-100 duration-300">
              Edit your PDF file. Add text,
              <br />
              shapes, images or freehand
              <br />
              annotations to your file.
            </p>
          </div>

          <div className={`absolute transition-opacity ease-in duration-300
        ${!isVisible ? 'opacity-0' : 'opacity-100'} grid grid-rows-${fileNames.length} gap-4`}
          >
            <p className="text-center text-xl">Please select a PDF</p>
            {fileNames.map((val, index) => (
              <button
                disabled={!isVisible}
                type="button"
                onClick={() => navigate(EDIT_PDF_PAGE_PATH, { state: location.state[index] })}
                className="flex px-2 items-center bg-slate-200 rounded-xl"
                key={`file_${val}`}
              >
                <img src={pdfImg} alt="" className="w-10" />
                <p className="hover:cursor-pointer">{val}</p>
              </button>
            ))}
          </div>
        </div>

        <div
          onClick={() => navigate(PDF_MERGE_PAGE_PATH, { state: location.state })}
          tabIndex={0}
          onKeyDown={() => { }}
          role="button"
          className="transition ease-in-out delay-200 hover:scale-110 group"
        >

          <div>
            <MergeIcon />
            <h1 className="text-xl ml-6">PDF Merge</h1>
          </div>

          <br />
          <p className="opacity-0 group-hover:opacity-100 duration-300">
            Merge your PDF files and
            <br />
            reorder the pages of PDFs.
          </p>

        </div>

        <div
          onClick={() => setIsVisible2((prev) => !prev)}
          tabIndex={0}
          onKeyDown={() => { }}
          role="button"
          className={`flex transition ease-in-out delay-200 ${!isVisible2 ? 'hover:scale-110' : 'scale-110'} group`}
        >
          <div className={`transition-opacity ease-in duration-300 ${isVisible2 ? 'opacity-0' : 'opacity-100'}`}>
            <div>
              <SplitIcon />
              <h1 className="text-xl ml-8">PDF Split</h1>
            </div>

            <p className="opacity-0 group-hover:opacity-100 duration-300">
              <br />
              Split your PDF files and
              <br />
              reorder the pages of PDFs.
            </p>

          </div>

          <div className={`absolute transition-opacity ease-in duration-300
        ${!isVisible2 ? 'opacity-0' : 'opacity-100'} grid grid-rows-${fileNames.length} gap-4`}
          >
            <p className="text-center text-xl">Please select a PDF</p>
            {fileNames.map((val, index) => (
              <button
                disabled={!isVisible2}
                type="button"
                onClick={() => navigate(PDF_SPLIT_PAGE_PATH, { state: location.state[index] })}
                className="flex px-2 items-center bg-slate-200 rounded-xl"
                key={`file_${val}`}
              >
                <img src={pdfImg} alt="" className="w-10" />
                <p className="hover:cursor-pointer">{val}</p>
              </button>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

export default OperationPage;
