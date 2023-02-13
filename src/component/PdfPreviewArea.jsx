import React, { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';

function PdfPreviewArea({
  file, noPageLeft, pageNum, setPageNum,
}) {
  const pdfLength = useRef(0);

  const handleNavigationClickForward = () => {
    setPageNum((prev) => (prev === pdfLength.current - 1
      ? pdfLength.current : (prev + 1) % pdfLength.current));
  };

  const handleNavigationClickBack = () => {
    setPageNum((prev) => (prev === 1
      ? pdfLength.current : (prev - 1) % pdfLength.current));
  };

  const handleLoadSucces = (pdf) => {
    pdfLength.current = pdf.numPages;
  };

  const handleLoading = () => <LoadingIcon className="animate-spin" />;
  return (
    <div className="flex items-center">
      <Document
        file={file}
        loading={handleLoading}
        onLoadSuccess={handleLoadSucces}
      >
        {!noPageLeft && (
        <Page
          className="rounded-md border-4 border-purple-500 shadow-2xl"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={() => {}}
          pageNumber={pageNum}
          width={1}
          scale={500}
        />
        )}
      </Document>
      <button
        onClick={handleNavigationClickForward}
        className="transition ease-in-out duration-300 hover:bg-purple-300
  rounded-md border-4 border-violet-400 absolute right-0"
        type="button"
      >
        <ForwardIcon />
      </button>
      <button
        onClick={handleNavigationClickBack}
        className="transition ease-in-out duration-300 hover:bg-purple-300 rounded-md
  border-4 border-violet-400 absolute left-0"
        type="button"
      >
        <BackIcon />
      </button>
    </div>

  );
}

PdfPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  pageNum: PropTypes.number.isRequired,
  noPageLeft: PropTypes.bool.isRequired,
  setPageNum: PropTypes.func.isRequired,
};

export default PdfPreviewArea;
