import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState('./sample.pdf');

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  };

  return (
    <div className="flex w-screen h-screen">
      <div>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <p>
          Page
          {' '}
          {pageNumber}
          {' '}
          of
          {' '}
          {numPages}
        </p>
      </div>
      {/* <div className="w-1/5 h-screen border-4 border-black" />
      <div className="w-4/5 h-screen" /> */}
    </div>
  );
}

export default PdfEditPage;
