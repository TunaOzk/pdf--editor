import React, { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfPreviewArea({
  file, pageIndex, setPageIndex, currentPdfPages, width, onLoadSuccessForEditPage,
}) {
  const [scale, setScale] = useState(1);
  const [pdfLength, setPdfLength] = useState(0);
  const inputRef = useRef(null);

  const handleNavigationClickForward = () => {
    if (currentPdfPages.length === 1) return;
    setPageIndex((prev) => ((prev + 1) % currentPdfPages.length));
  };

  const handleNavigationClickBack = () => {
    if (currentPdfPages.length === 1) return;
    setPageIndex((prev) => (prev === 0
      ? currentPdfPages.length - 1 : (prev - 1) % currentPdfPages.length));
  };

  const handleLoadSucces = (pdf) => {
    setPdfLength(pdf.numPages);
  };

  const handleZoomIn = () => {
    setScale((prev) => prev * 2);
  };

  const handleZoomOut = () => {
    setScale((prev) => prev / 2);
  };

  const handleChange = (e) => {
    const pageNum = Number(e.target.value);
    if (pageNum > 0 && pageNum <= currentPdfPages.length) { setPageIndex(pageNum - 1); }
  };

  const handleLoading = () => <LoadingIcon className="animate-spin" />;
  return (
    <div className="flex flex-col items-center justify-center">
      <Document
        file={file}
        loading={handleLoading}
        onLoadSuccess={!onLoadSuccessForEditPage ? handleLoadSucces : onLoadSuccessForEditPage}
      >
        <Page
          className="rounded-md border-4 border-purple-500 shadow-2xl"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={() => {}}
          pageNumber={currentPdfPages[pageIndex] + 1}
          width={width}
          scale={scale}
        />
      </Document>
      <NavBar
        onClickBack={handleNavigationClickBack}
        onClickForward={handleNavigationClickForward}
        innerRef={inputRef}
        inputValue={pageIndex + 1}
        onChange={handleChange}
        pdfLength={currentPdfPages.length}
      />
      {/* <div className="flex transition ease-in-out p-4
      text-white text-lg delay-75 opacity-25 hover:opacity-
      100 absolute bottom-10 rounded-md bg-purple-500"
      >
        <div>
          <button
            onClick={handleNavigationClickBack}
            className="mr-2"
            type="button"
          >
            <BackIcon />
          </button>
          <input onChange={handleChange} defaultValue={1}
          onWheel={(e) => e.target.blur()} type="number" min={1}
          max={pdfLength + 1} className="text-base mr-2 text-black
          text-center h-6 w-10 resize-none rounded-md overflow-hidden" />
          /
          {' '}
          {pdfLength}
          <button
            onClick={handleNavigationClickForward}
            className="ml-2"
            type="button"
          >
            <ForwardIcon />
          </button>
        </div>

        <div className="flex">
          <button title="Zoom In" className="ml-4 transition ease-in-out
          delay-75 hover:-translate-y-1" type="button">
            <ZoomInIcon />
          </button>
          <button title="Zoom Out" className="ml-4 transition ease-in-out
          delay-75 hover:-translate-y-1" type="button">
            <ZoomOutIcon />
          </button>
        </div>

      </div> */}
    </div>

  );
}

PdfPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  pageIndex: PropTypes.number.isRequired,
  setPageIndex: PropTypes.func.isRequired,
  currentPdfPages: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number,
  onLoadSuccessForEditPage: PropTypes.func,
};

PdfPreviewArea.defaultProps = {
  width: null,
  onLoadSuccessForEditPage: null,
};

export default PdfPreviewArea;
