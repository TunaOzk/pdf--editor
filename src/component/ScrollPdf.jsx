import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';

function ScrollPdf({ docFile }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState('./sample.pdf');

  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
  };

  return (
    <div className="flex flex-col">
      <Document file={docFile} onLoadSuccess={onDocumentLoadSuccess}>
        { [
          ...Array(numPages),
        ].map((value, index) => (
          <Page
            className="rounded-md border-4 border-indigo-500 mb-8"
            key={uuid()}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={100}
            scale={2}
            pageNumber={index + 1}
          />
        ))}
      </Document>
    </div>
  );
}

ScrollPdf.propTypes = {
  docFile: PropTypes.string.isRequired,
};

export default ScrollPdf;
