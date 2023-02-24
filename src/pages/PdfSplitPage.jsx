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
  const fileNames = [...Array(numOfFiles)].map((value, index) => location.state[index].name);
  const [pdfPagesList, setPdfPagesList] = useState([...Array(numOfFiles)].map(() => []));

  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(fileList[0]);
  const [pageIndex, setPageIndex] = useState(0);
  const [fileListIndex, setFileListIndex] = useState(0);
  const [noPagesLeftBoolean, setNoPagesLeftBoolean] = useState(false);

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfSplitPreviewArea
      currentPdfPages={currentPdfPages}
      setCurrentPdfPages={setCurrentPdfPages}
      file={currentFile}
      currFileIndex={fileListIndex}
      setPageIndex={setPageIndex}
      setNoPagesLeftBoolean={setNoPagesLeftBoolean}
      noPageLeft={noPagesLeftBoolean}
      numOfFiles={numOfFiles}
      pdfPagesList={pdfPagesList}
      setPdfPagesList={setPdfPagesList}
    />
  ), [currentPdfPages, currentFile, fileListIndex, noPagesLeftBoolean,
    numOfFiles, pdfPagesList, setPdfPagesList]);
  return (
    <div>
      {memoizedPdfScrollArea}

      <h1>deneme</h1>
    </div>
  );
}

export default PdfSplitPage;
