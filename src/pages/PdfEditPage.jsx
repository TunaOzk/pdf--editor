import React, { useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import uuid from 'react-uuid';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';
import PdfScrollArea from '../component/PdfScrollArea';
import PdfPreviewArea from '../component/PdfPreviewArea';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();

  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)]
    .map((value, index) => ({ data: location.state[index] }));

  const currentPageIndex = useRef(0);
  const currentFileIndex = useRef(0);

  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [currentFile, setCurrentFile] = useState({ data: location.state[0] });
  const [pageNum, setPageNum] = useState(1);
  const [pdfPagesList, setPdfPagesList] = useState([...Array(numOfFiles)].map(() => []));
  const [selectedPdfOnDropDown, setSelectedPdfOnDropDown] = useState(0);

  const handleOnDocumentLoadSuccess = (pdf) => {
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrentPdfPages(() => {
      if (!pdfPagesList[currentFileIndex.current].length) {
        pdfPagesList[currentFileIndex.current] = pdfPages;
        return pdfPages;
      }
      return pdfPagesList[currentFileIndex.current];
    });
    currentPageIndex.current = 0;
    setPageNum(1);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    switch (currentPageIndex.current) {
      case result.source.index:
        currentPageIndex.current = result.destination.index;
        break;
      case result.destination.index:
        currentPageIndex.current = result.source.index;
        break;
      default:
        break;
    }
    const newPageList = currentPdfPages;
    const [reorderedPage] = newPageList.splice(result.source.index, 1);
    newPageList.splice(result.destination.index, 0, reorderedPage);
    setCurrentPdfPages(newPageList);
  };

  const handleDelete = (num, pageIndex) => {
    setCurrentPdfPages((prevList) => prevList.filter((item, index) => item !== num - 1));
    if (pageIndex === currentPageIndex.current) {
      const nextPageIndex = (currentPageIndex.current + 1) % currentPdfPages.length;
      setPageNum(currentPdfPages[nextPageIndex] + 1);
    }
    if (pageIndex < currentPageIndex.current) { currentPageIndex.current -= 1; }
  };

  const handleClick = (e, num, index) => {
    if (pageNum !== num) {
      setPageNum(num);
      currentPageIndex.current = index;
    }
  };

  const handleNavigationClickForward = () => {
    if (currentPdfPages.length === 1) return;
    currentPageIndex.current = (currentPageIndex.current + 1) % currentPdfPages.length;
    setPageNum(currentPdfPages[currentPageIndex.current] + 1);
  };

  const handleNavigationClickBack = () => {
    if (currentPdfPages.length === 1) return;
    currentPageIndex.current = currentPageIndex.current === 0
      ? currentPdfPages.length - 1 : (currentPageIndex.current - 1) % currentPdfPages.length;
    setPageNum(currentPdfPages[currentPageIndex.current] + 1);
  };

  const handleOptionClick = (e) => {
    const index = e.target.value;
    setSelectedPdfOnDropDown(index);
    currentFileIndex.current = index;
    setCurrentFile(fileList[index]);
  };

  return (
    <div className="flex h-screen bg-stone-200">
      <PdfScrollArea
        dragEnd={handleDragEnd}
        file={currentFile}
        pageList={currentPdfPages}
        docLoadSucces={handleOnDocumentLoadSuccess}
        onDelete={handleDelete}
        onClick={handleClick}
      />

      <div className="relative flex flex-col items-center justify-center w-4/5">

        <form className="absolute top-0 left-0 rounded-md border-4 border-violet-400">
          <select value={selectedPdfOnDropDown} onChange={handleOptionClick} name="pdfSelect">
            {[...Array(numOfFiles)].map((value, index) => (
              <option key={uuid()} value={index}>
                PDF
                {index + 1}
              </option>
            ))}
          </select>
        </form>

        <button
          onClick={handleNavigationClickForward}
          className="transition ease-in-out duration-300 hover:bg-purple-300 rounded-md border-4 border-violet-400 absolute right-0"
          type="button"
        >
          <ForwardIcon />
        </button>
        <button
          onClick={handleNavigationClickBack}
          className="transition ease-in-out duration-300 hover:bg-purple-300 rounded-md border-4 border-violet-400 absolute left-0"
          type="button"
        >
          <BackIcon />
        </button>

        <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100 rounded-md absolute bottom-10 right-10 p-4" type="button">Merge Your PDF Files</button>
        <PdfPreviewArea
          file={currentFile}
          pageList={currentPdfPages}
          pageNum={pageNum}
        />
      </div>
    </div>

  );
}

export default PdfEditPage;
