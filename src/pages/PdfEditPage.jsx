import React, { useMemo, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)].map((value, index) => location.state[index].base64);
  const fileNames = [...Array(numOfFiles)].map((value, index) => location.state[index].name);

  const [pdfPagesList, setPdfPagesList] = useState([...Array(numOfFiles)].map(() => []));
  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(fileList[0]);
  const [pageIndex, setPageIndex] = useState(0);
  const [fileListIndex, setFileListIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionClick = (e) => {
    const index = Number(e.target.value);
    setFileListIndex(index);
    setCurrentFile(fileList[index]);
  };
  async function postIndex(event) {
    event.preventDefault();
    setIsLoading(true);
    const currentFileName = fileNames[fileListIndex];
    try {
      await axios.post('http://localhost:4000/pdfFileIndex', {
        currentPdfPages,
        currentFile,
        currentFileName,
      }).then((res) => {
        setIsLoading(false);
        const a = document.createElement('a');
        a.href = res.data;
        a.download = currentFileName;
        a.click();
        a.remove();
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async function postMerge(event) {
    event.preventDefault();
    setIsLoading(true);
    const currentFileName = fileNames[fileListIndex];
    const temp = pdfPagesList.map((value, index) => (!value.length
      ? pdfjs.getDocument(fileList[index]).promise
        .then((pdf) => Array.from(Array(pdf.numPages).keys())) : pdfPagesList[index]));
    const finalPagesList = await Promise.all(temp);
    try {
      await axios.post('http://localhost:4000/pdfMerge', {
        finalPagesList,
        fileList,
        currentFileName,
      }).then((res) => {
        const a = document.createElement('a');
        a.href = res.data;
        a.download = 'MergedPdf.pdf';
        a.click();
        a.remove();
        setIsLoading(false);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfScrollArea
      currentPdfPages={currentPdfPages}
      setCurrentPdfPages={setCurrentPdfPages}
      file={currentFile}
      currFileIndex={fileListIndex}
      setPageIndex={setPageIndex}
      pdfPagesList={pdfPagesList}
      setPdfPagesList={setPdfPagesList}
    />
  ), [currentPdfPages, currentFile, fileListIndex, pdfPagesList, setPdfPagesList]);

  const loadingPopUp = (
    <div className="absolute z-10 flex fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm
  flex justify-center items-center"
    >
      <div className="flex flex-col bg-white w-1/2 h-1/3 p-2 rounded flex items-center justify-center">
        <LoadingIcon className="animate-spin" />
        <p className="text-purple-500 text-xl">We are getting everything ready for you. Please take a moment...</p>

      </div>

    </div>
  );

  return (
    <div className="flex h-screen bg-stone-200">
      {memoizedPdfScrollArea}
      {isLoading && loadingPopUp}
      <form className="relative flex flex-col items-center justify-center w-4/5">

        <div className="absolute top-0 left-0 rounded-md border-4 border-violet-400">
          <select value={fileListIndex} onChange={handleOptionClick} name="pdfSelect">
            {[...Array(numOfFiles)].map((value, index) => (
              <option key={`pdf_${index + 1}`} value={index}>
                PDF
                {index + 1}
              </option>
            ))}
          </select>
        </div>

        <button
          className="transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100
  rounded-md absolute bottom-10 right-10 p-4"
          type="button"
          onClick={(event) => postMerge(event)}
        >
          Merge Your All PDF Files

        </button>
        <button
          className="transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100 rounded-md
      absolute bottom-28 right-10 p-4"
          type="button"
          onClick={(event) => postIndex(event)}
        >
          Export The Current File

        </button>
        <PdfPreviewArea
          file={currentFile}
          setPageIndex={setPageIndex}
          pageIndex={pageIndex}
          currentPdfPages={currentPdfPages}
        />
      </form>
    </div>

  );
}

export default PdfEditPage;
