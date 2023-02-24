import React, { useMemo, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfSplitPreviewArea from '../component/PdfSplitPreviewArea';
import PdfPreviewArea from '../component/PdfPreviewArea';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
function PdfSplitPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)].map((value, index) => location.state[index].base64);
  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(fileList[0]);

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfSplitPreviewArea
      currentPdfPages={currentPdfPages}
      file={currentFile}
    />
  ), [currentPdfPages, currentFile]);
  return (
    <div>
      {memoizedPdfScrollArea}
      <div>
        <h1>deneme</h1>

      </div>
    </div>
  );
}

export default PdfSplitPage;
