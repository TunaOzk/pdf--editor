import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDF_EDIT_PAGE_PATH, EDIT_PDF_PAGE_PATH, PDF_SPLIT_PAGE_PATH } from '../constants/routePaths';
import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as MergeIcon } from '../assets/merge.svg';
import { ReactComponent as SplitIcon } from '../assets/split.svg';

function OperationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex items-center justify-around bg-stone-200">
      <div
        onClick={() => navigate(EDIT_PDF_PAGE_PATH, { state: location.state })}
        tabIndex={0}
        onKeyDown={() => { }}
        role="button"
        className="transition ease-in-out delay-200 hover:scale-110 group"
      >

        <div>
          <EditIcon />
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

      <div
        onClick={() => navigate(PDF_EDIT_PAGE_PATH, { state: location.state })}
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
        onClick={() => navigate(PDF_SPLIT_PAGE_PATH, { state: location.state })}
        tabIndex={0}
        onKeyDown={() => { }}
        role="button"
        className="transition ease-in-out delay-200 hover:scale-110 group"
      >

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
