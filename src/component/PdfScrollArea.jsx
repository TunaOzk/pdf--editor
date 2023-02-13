import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Document } from 'react-pdf';
import uuid from 'react-uuid';
import PropTypes from 'prop-types';
import PdfPage from './PdfPage';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfScrollArea({
  file, currFileIndex, numOfFiles, setPageNum, setNoPagesLeftBoolean, noPageLeft,
}) {
  const currentPageIndex = useRef(0);
  const [currentPdfPages, setCurrentPdfPages] = useState([]);
  const [pdfPagesList, setPdfPagesList] = useState([...Array(numOfFiles)].map(() => []));
  const handleLoading = () => <LoadingIcon className="animate-spin" />;

  const handleOnDocumentLoadSuccess = (pdf) => {
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrentPdfPages(() => {
      if (pdfPagesList[currFileIndex][0] === -1) {
        setNoPagesLeftBoolean(true);
      }
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

  const handleClick = (e, num, index) => {
    setPageNum(num);
    currentPageIndex.current = index;
  };

  const handleDelete = (num, pageIndex) => {
    setCurrentPdfPages((prevList) => {
      const newList = prevList.filter((item, index) => item !== num - 1);

      setPdfPagesList((prevPagesList) => {
        const newPagesList = [...prevPagesList];
        if (!newList.length) {
          newPagesList[currFileIndex] = [-1];
          setNoPagesLeftBoolean(true);
        } else { newPagesList[currFileIndex] = newList; }
        return newPagesList;
      });

      return newList;
    });

    if (pageIndex === currentPageIndex.current) {
      const nextPageIndex = (currentPageIndex.current + 1) % currentPdfPages.length;
      setPageNum(currentPdfPages[nextPageIndex] + 1);
    }
    if (pageIndex < currentPageIndex.current) { currentPageIndex.current -= 1; }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center w-1/5 border-4 border-violet-400 overflow-y-auto">
        <Document
          file={file}
          onLoadSuccess={handleOnDocumentLoadSuccess}
          loading={handleLoading}
        >
          <Droppable droppableId={uuid().toString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                {...provided.droppableProps}
                className="flex flex-col items-center"
              >
                {!noPageLeft && currentPdfPages.map((value, index) => (
                  <PdfPage
                    key={value}
                    pageNum={value + 1}
                    width={100}
                    scale={2}
                    index={index}
                    onDelete={handleDelete}
                    onClick={handleClick}
                  />

                ))}
                {provided.placeholder}

              </div>

            )}
          </Droppable>
        </Document>
      </div>
    </DragDropContext>
  );
}

PdfScrollArea.propTypes = {
  file: PropTypes.string.isRequired,
  numOfFiles: PropTypes.number.isRequired,
  currFileIndex: PropTypes.number.isRequired,
  setPageNum: PropTypes.func.isRequired,
  setNoPagesLeftBoolean: PropTypes.func.isRequired,
  noPageLeft: PropTypes.bool.isRequired,
};

export default PdfScrollArea;