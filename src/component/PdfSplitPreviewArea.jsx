import React, { useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';
import NavBar from './NavBar';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfSplitPreviewArea({
  file, currentPdfPages,
}) {
  const [pdfLength, setPdfLength] = useState(0);

  const handleLoadSucces = (pdf) => {
    setPdfLength(pdf.numPages);
  };
  const handleLoading = () => <LoadingIcon className="animate-spin" />;

  return (
    <div className="relative flex flex-col items-center w-1/5 border-4 border-violet-400 overflow-y-auto">

      <Document
        file={file}
        onLoadSuccess={handleLoadSucces}
        loading={handleLoading}
      >
        <Page
          className="rounded-md border-4 border-purple-500 shadow-2xl"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={() => {}}
          pageNumber={currentPdfPages[0] + 1}
          width={300}
        />
      </Document>
    </div>
  );
}

PdfSplitPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  currentPdfPages: PropTypes.arrayOf(number).isRequired,
};

export default PdfSplitPreviewArea;
