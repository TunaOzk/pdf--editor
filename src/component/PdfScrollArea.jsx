import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Document } from 'react-pdf';
import uuid from 'react-uuid';
import PropTypes, { number } from 'prop-types';
import PdfPage from './PdfPage';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfScrollArea({
  file, currFileIndex, numOfFiles, setPageIndex, setNoPagesLeftBoolean,
  noPageLeft, currentPdfPages, setCurrentPdfPages,
}) {
  const currentPageIndex = useRef(0);
  const numOfRenderedPages = useRef(0);

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
    setPageIndex(0);
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
    setPageIndex(index);
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
    if (pageIndex === currentPdfPages.length - 1) {
      setPageIndex(0);
    } else if (pageIndex < currentPageIndex.current) {
      currentPageIndex.current -= 1;
      setPageIndex(currentPageIndex.current);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="relative flex flex-col items-center w-1/5 border-4 border-violet-400 overflow-y-auto">
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
  setPageIndex: PropTypes.func.isRequired,
  setNoPagesLeftBoolean: PropTypes.func.isRequired,
  noPageLeft: PropTypes.bool.isRequired,
  currentPdfPages: PropTypes.arrayOf(number).isRequired,
  setCurrentPdfPages: PropTypes.func.isRequired,

};

export default PdfScrollArea;
