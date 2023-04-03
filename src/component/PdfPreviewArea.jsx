import React, { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfPreviewArea({
  file, pageIndex, setPageIndex, currentPdfPages, height, onLoadSuccessForEditPage,
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
          className="rounded-md border-2 border-[#1c1b1e] shadow-2xl"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={() => { handleLoading(); }}
          pageNumber={currentPdfPages[pageIndex] + 1}
          // eslint-disable-next-line no-restricted-globals
          // height={screen.height}
          // scale={0.6}
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
    </div>

  );
}

PdfPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  pageIndex: PropTypes.number.isRequired,
  setPageIndex: PropTypes.func.isRequired,
  currentPdfPages: PropTypes.arrayOf(PropTypes.number).isRequired,
  height: PropTypes.number,
  onLoadSuccessForEditPage: PropTypes.func,
};

PdfPreviewArea.defaultProps = {
  height: null,
  onLoadSuccessForEditPage: null,
};

export default PdfPreviewArea;
