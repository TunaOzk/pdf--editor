import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Document } from 'react-pdf';
import uuid from 'react-uuid';
import PropTypes, { arrayOf, number } from 'prop-types';
import PdfPage from './PdfPage';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfSplitPreviewArea({
  file, currFileIndex, setPageIndex,
  currentPdfPages, setCurrentPdfPages, pdfPagesList, setPdfPagesList,
}) {
  const currentPageIndex = useRef(0);
  const [disableDeleteOnLastRemainingPage, setDisableDeleteOnLastRemainingPage] = useState(false);
  const handleLoading = () => <LoadingIcon className="animate-spin" />;

  const handleOnDocumentLoadSuccess = (pdf) => {
    setDisableDeleteOnLastRemainingPage(pdfPagesList[currFileIndex].length === 1);
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrentPdfPages(() => {
      if (!pdfPagesList[currFileIndex].length) {
        setPdfPagesList((prevList) => {
          const newList = [...prevList];
          newList[currFileIndex] = pdfPages;
          return newList;
        });
        return pdfPages;
      }
      return pdfPagesList[currFileIndex];
    });
    currentPageIndex.current = 0;
    setPageIndex(0);
  };

  const handleClick = (e, num, index) => {
    setPageIndex(index);
    currentPageIndex.current = index;
  };

  return (
    <div className="relative flex flex-col items-center w-1/5 border-4 border-violet-400 overflow-y-auto">
      <Document
        file={file}
        onLoadSuccess={handleOnDocumentLoadSuccess}
        loading={handleLoading}
      />
    </div>
  );
}

PdfSplitPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  currFileIndex: PropTypes.number.isRequired,
  setPageIndex: PropTypes.func.isRequired,
  currentPdfPages: PropTypes.arrayOf(number).isRequired,
  setCurrentPdfPages: PropTypes.func.isRequired,
  pdfPagesList: PropTypes.arrayOf(arrayOf(number)).isRequired,
  setPdfPagesList: PropTypes.func.isRequired,
};

export default PdfSplitPreviewArea;
