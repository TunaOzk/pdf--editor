import React, { useMemo, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';
import LoadingScreen from '../component/LoadingScreen';

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
  const postIndex = async (event) => {
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
        const downloadFile = document.createElement('a');
        downloadFile.href = res.data;
        downloadFile.download = currentFileName;
        downloadFile.click();
        downloadFile.remove();
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  const postMerge = async (event) => {
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
  };

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

  return (
    <div className="flex flex-col h-screen bg-stone-200 ">
      <header className="bg-purple-400 w-full max-sm:h-[70px] sm:h-10 flex justify-between items-center py-4">
        <div className="left-header ">
          <h1 className="sm:text-lg text-neutral-100 p-2">Pdf Editor Logo</h1>
        </div>
        <div className="w-[500px] flex flex-row ">
          <button
            className=" bg-violet-600 opacity-80 text-white hover:opacity-100 p-2 w-full"
            type="submit"
            onClick={(event) => postMerge(event)}
          >
            Merge Your All PDF Files
          </button>
          <div className="w-[1px] bg-black" />
          <button
            className="transition ease-in-out delay-75
              bg-violet-600 opacity-80 text-white hover:opacity-100
              right-4 p-2 w-full"
            type="submit"
            onClick={(event) => postIndex(event)}
          >
            Export The Current File
          </button>
        </div>

      </header>
      <div className="flex flex-row h-screen overflow-hidden">
        {memoizedPdfScrollArea}
        {isLoading && <LoadingScreen />}
        <form className="relative flex flex-col items-center justify-center w-4/5">

          <div className="absolute top-0 left-0 rounded-sm border-2 border-violet-400">
            <select value={fileListIndex} onChange={handleOptionClick} name="pdfSelect">
              {[...Array(numOfFiles)].map((value, index) => (
                <option key={`pdf_${index + 1}`} value={index}>
                  PDF
                  {index + 1}
                </option>
              ))}
            </select>
          </div>

          <PdfPreviewArea
            file={currentFile}
            setPageIndex={setPageIndex}
            pageIndex={pageIndex}
            currentPdfPages={currentPdfPages}
            width={500}
          />

        </form>
      </div>
    </div>

  );
}

export default PdfEditPage;
