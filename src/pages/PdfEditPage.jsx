import React, { useMemo, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import uuid from 'react-uuid';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = location.state;

  // const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState(fileList[0]);
  const [pageNum, setPageNum] = useState(1);
  // const [pdfPagesList, setPdfPagesList] = useState([...Array(numOfFiles)].map(() => []));
  const [fileListIndex, setFileListIndex] = useState(0);
  const [noPagesLeftBoolean, setNoPagesLeftBoolean] = useState(false);

  // const handleOnDocumentLoadSuccess = (pdf) => {
  //   const pdfPages = [...Array(pdf.numPages).keys()];
  //   setCurrentPdfPages(() => {
  //     if (!pdfPagesList[currentFileIndex.current].length) {
  //       pdfPagesList[currentFileIndex.current] = pdfPages;
  //       return pdfPages;
  //     }
  //     return pdfPagesList[currentFileIndex.current];
  //   });
  //   currentPageIndex.current = 0;
  //   setPageNum(1);
  // };

  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;
  //   switch (currentPageIndex.current) {
  //     case result.source.index:
  //       currentPageIndex.current = result.destination.index;
  //       break;
  //     case result.destination.index:
  //       currentPageIndex.current = result.source.index;
  //       break;
  //     default:
  //       break;
  //   }
  //   const newPageList = currentPdfPages;
  //   const [reorderedPage] = newPageList.splice(result.source.index, 1);
  //   newPageList.splice(result.destination.index, 0, reorderedPage);
  //   setCurrentPdfPages(newPageList);
  // };

  // const handleDelete = (num, pageIndex) => {
  //   setCurrentPdfPages((prevList) => {
  //     const newList = prevList.filter((item, index) => item !== num - 1);
  //     if (!newList.length) { setNoPagesLeftBoolean(true); }
  //     return newList;
  //   });
  //   if (pageIndex === currentPageIndex.current) {
  //     const nextPageIndex = (currentPageIndex.current + 1) % currentPdfPages.length;
  //     setPageNum(currentPdfPages[nextPageIndex] + 1);
  //   }
  //   if (pageIndex < currentPageIndex.current) { currentPageIndex.current -= 1; }
  // };

  // const handleClick = (e, num, index) => {
  //   if (pageNum !== num) {
  //     setPageNum(num);
  //     currentPageIndex.current = index;
  //   }
  // };

  // const handleNavigationClickForward = () => {
  //   if (currentPdfPages.length === 1) return;
  //   currentPageIndex.current = (currentPageIndex.current + 1) % currentPdfPages.length;
  //   setPageNum(currentPdfPages[currentPageIndex.current] + 1);
  // };

  // const handleNavigationClickBack = () => {
  //   if (currentPdfPages.length === 1) return;
  //   currentPageIndex.current = currentPageIndex.current === 0
  //     ? currentPdfPages.length - 1 : (currentPageIndex.current - 1) % currentPdfPages.length;
  //   setPageNum(currentPdfPages[currentPageIndex.current] + 1);
  // };

  const handleOptionClick = (e) => {
    const index = Number(e.target.value);
    setFileListIndex(index);
    setCurrentFile(fileList[index]);
    setNoPagesLeftBoolean(false);
  };

  // const memoizedPdfPreviewArea = useMemo(() => (
  //   <PdfPreviewArea
  //     file={currentFile}
  //     noPageLeft={noPagesLeftBoolean}
  //     pageNum={pageNum}
  //   />
  // ), [currentFile, noPagesLeftBoolean, pageNum]);

  const memoizedPdfScrollArea = useMemo(() => (
    <PdfScrollArea
      file={currentFile}
      currFileIndex={fileListIndex}
      setPageNum={setPageNum}
      setNoPagesLeftBoolean={setNoPagesLeftBoolean}
      noPageLeft={noPagesLeftBoolean}
      numOfFiles={numOfFiles}
    />
  ), [currentFile, fileListIndex, noPagesLeftBoolean, numOfFiles]);
  return (
    <div className="flex h-screen bg-stone-200">
      {memoizedPdfScrollArea}
      {/* <PdfScrollArea
        file={currentFile}
        currFileIndex={currentFileIndex.current}
        setPageNum={setPageNum}
        setNoPagesLeftBoolean={setNoPagesLeftBoolean}
        numOfFiles={numOfFiles}
      /> */}

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
