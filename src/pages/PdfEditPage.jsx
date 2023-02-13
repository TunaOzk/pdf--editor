import React, { useMemo, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import uuid from 'react-uuid';
import axios from 'axios';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)].map((value, index) => location.state[index].base64);
  const fileNames = [...Array(numOfFiles)].map((value, index) => location.state[index].name);

  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(fileList[0]);
  const [pageNum, setPageNum] = useState(1);
  const [fileListIndex, setFileListIndex] = useState(0);
  const [noPagesLeftBoolean, setNoPagesLeftBoolean] = useState(false);

  const handleOptionClick = (e) => {
    const index = Number(e.target.value);
    setFileListIndex(index);
    setCurrentFile(fileList[index]);
    setNoPagesLeftBoolean(false);
  };
  async function postIndex(event) {
    event.preventDefault();
    const currentFileName = fileNames[fileListIndex];
    try {
      await axios.post('http://localhost:4000/pdfFile2', {
        currentPdfPages,
        currentFile,
        currentFileName,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfScrollArea
      currentPdfPages={currentPdfPages}
      setCurrentPdfPages={setCurrentPdfPages}
      file={currentFile}
      currFileIndex={fileListIndex}
      setPageNum={setPageNum}
      setNoPagesLeftBoolean={setNoPagesLeftBoolean}
      noPageLeft={noPagesLeftBoolean}
      numOfFiles={numOfFiles}
    />
  ), [currentFile, fileListIndex, noPagesLeftBoolean,
    numOfFiles, currentPdfPages, setCurrentPdfPages]);

  return (
    <div className="flex h-screen bg-stone-200">
      {memoizedPdfScrollArea}

      <form className="relative flex flex-col items-center justify-center w-4/5">

        <div className="absolute top-0 left-0 rounded-md border-4 border-violet-400">
          <select value={fileListIndex} onChange={handleOptionClick} name="pdfSelect">
            {[...Array(numOfFiles)].map((value, index) => (
              <option key={uuid()} value={index}>
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
          setPageNum={setPageNum}
          noPageLeft={noPagesLeftBoolean}
          pageNum={pageNum}
        />
      </form>
    </div>

  );
}

export default PdfEditPage;
