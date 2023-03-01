import React, { useMemo, useEffect, useState } from 'react';
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

  const postSplitPdf = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:4000/pdfSplitFileIndex', {
        currentFile,
        splitPdfPages,
      }).then((res) => {
        const firstDownload = document.createElement('a');
        const allPdfs = res.data;
        // eslint-disable-next-line prefer-destructuring
        firstDownload.href = allPdfs[0];
        firstDownload.download = 'firstSplit.pdf';
        firstDownload.click();
        firstDownload.remove();
        const secondDownload = document.createElement('a');
        // eslint-disable-next-line prefer-destructuring
        secondDownload.href = allPdfs[1];
        secondDownload.download = 'secondSplit.pdf';
        secondDownload.click();
        secondDownload.remove();
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfSplitPreviewArea
      setCurrentPdfPages={setCurrentPdfPages}
      setSplitPdfPages={setSplitPdfPages}
      file={currentFile}
    />
  ), [currentFile]);
  useEffect(() => {
    const a = currentPdfPages.filter((val) => !splitPdfPages.includes(val));
    console.log(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPdfPages, splitPdfPages]);

  return (
    <div className="flex flex-col  items-center  justify-center h-screen overflow-hidden">
      {memoizedPdfScrollArea}
      <div className="ablolute -10">
        {console.log(splitPdfPages)}
        {console.log(currentPdfPages)}

        <button
          className="transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100
  rounded-md absolute md:bottom-10  max-[770px]:bottom-4 max-[770px]:inset-x-2 md:right-14 p-4"
          type="button"
          onClick={(event) => postSplitPdf(event)}
        >
          Split Pages

        </button>
      </div>
    </div>
  );
}

export default PdfSplitPage;
