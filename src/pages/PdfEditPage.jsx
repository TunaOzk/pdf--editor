import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ScrollPdf from '../component/ScrollPdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const [file, setFile] = useState('./sample.pdf');

  return (
    <div className="flex max-h-screen">
      <div className="flex flex-col items-center w-1/5 min-h-screen border-4 border-black overflow-y-auto">
        <ScrollPdf docFile={file} />
      </div>
      <div className="w-4/5" />
    </div>

  );
}

export default PdfEditPage;
