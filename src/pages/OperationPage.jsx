import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDF_MERGE_PAGE_PATH, EDIT_PDF_PAGE_PATH } from '../constants/routePaths';
import pdfImg from '../assets/file-pdf-solid-240.png';
import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as MergeIcon } from '../assets/merge.svg';
import { ReactComponent as SplitIcon } from '../assets/split.svg';

function OperationPage() {
  const location = useLocation();
  const fileNames = [...Array(location.state.length)]
    .map((value, index) => location.state[index].name);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="h-screen w-screen flex items-center justify-around bg-stone-200">
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

      <div className="transition ease-in-out delay-200 hover:scale-110 group">

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

    </div>
  );
}

export default OperationPage;
