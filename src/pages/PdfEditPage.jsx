import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import uuid from 'react-uuid';
import ScrollPdf from '../component/ScrollPdf';
import { ReactComponent as AddIcon } from '../assets/add.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const [file, setFile] = useState('./sample.pdf');
  const [numPages, setNumPages] = useState(null);

  const handleOnDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
  };

  return (
    <div className="flex max-h-screen">
      <div className="flex flex-col items-center w-1/5 min-h-screen border-4 border-black overflow-y-auto">
        <ScrollPdf
          docFile={file}
          onLoadSuccess={handleOnDocumentLoadSuccess}
          numPages={numPages}
        />

      </div>
      <div className="w-4/5" />
    </div>

  );
}

export default PdfEditPage;
