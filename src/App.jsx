import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './styles/output.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState('./sample.pdf');

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  };

  return (
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
  );
}

export default App;
