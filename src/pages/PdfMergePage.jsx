import React, { useMemo, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';
import { ExportIcon } from '../assets';
import LoadingScreen from '../component/LoadingScreen';
import DropDown from '../component/DropDown';
import pdfIcon from '../assets/pdf_img.svg';

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
  const [selectPdfName, setSelectPdfName] = useState({ img: pdfIcon, label: 'PDF 1' });

  const handleOptionClick = (val) => {
    setSelectPdfName({ label: val, img: pdfIcon });
    const index = Number(val.split(' ')[1]) - 1;
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

  const selectDropDownContent = [...Array(numOfFiles)].map((value, index) => (
    {
      id: index, img: pdfIcon, label: `PDF ${index + 1}`, action: `PDF ${index + 1}`,
    }));

  return (
    <div className="flex flex-row h-screen bg-[#fbf8fd]">
      <div className="h-full w-1/5 overflow-hidden">{memoizedPdfScrollArea}</div>

      <div className="flex flex-col w-4/5 h-full">
        <div className="flex justify-end items-center drop-shadow-xl bg-[#fffbff] z-10">
          <div className="rounded-xl h-fit bg-[#e4dff9] mr-8">
            <DropDown
              menuItemContent={selectDropDownContent}
              onAction={handleOptionClick}
              menuItemHeader={selectPdfName}
            />
          </div>
          <button
            className="relative group flex rounded-xl drop-shadow-xl items-center mr-2 my-1 p-3 w-fit bg-[#4f33ff]"
            type="button"
            onClick={(event) => postIndex(event)}
          >
            <div className="transition-all ease-in-out delay-100 absolute h-full w-full opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl" />
            <ExportIcon className="fill-white" />
            <p className="ml-2 text-white">Export PDF</p>
          </button>

          <button
            className="relative group flex rounded-xl drop-shadow-xl items-center mr-2 my-1 p-3 w-fit bg-[#4f33ff]"
            type="button"
            onClick={(event) => postMerge(event)}
          >
            <div className="transition-all ease-in-out delay-100 absolute h-full w-full opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl" />
            <ExportIcon className="fill-white" />
            <p className="ml-2 text-white">Merge PDFs</p>
          </button>
        </div>

        <div className="flex justify-center items-center flex-grow">
          {isLoading && <LoadingScreen />}
          <div className=" overflow-y-auto">
            <PdfPreviewArea
              file={currentFile}
              setPageIndex={setPageIndex}
              pageIndex={pageIndex}
              currentPdfPages={currentPdfPages}
              width={500}
            />
          </div>
        </div>
      </div>

    </div>

  );
}

export default PdfEditPage;
