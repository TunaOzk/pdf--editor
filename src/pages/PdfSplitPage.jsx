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
  const [splitPdfPages, setSplitPdfPages] = useState([]);
  // array1 = array1.filter(val => !array2.includes(val));

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfSplitPreviewArea
      setCurrentPdfPages={setCurrentPdfPages}
      setSplitPdfPages={setSplitPdfPages}
      file={currentFile}
    />
  ), [currentFile]);
  return (
    <div className="flex flex-col  items-center  justify-center h-screen overflow-hidden">
      {memoizedPdfScrollArea}
      {console.log(splitPdfPages)}
      <div className="">
        {console.log(splitPdfPages)}

        <button
          className="transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100
  rounded-md absolute bottom-10 right-10 p-4"
          type="button"
        >
          bana bas

        </button>
      </div>
    </div>
  );
}

export default PdfSplitPage;
