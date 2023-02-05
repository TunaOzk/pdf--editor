import React, { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';
import uuid from 'react-uuid';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import PdfPage from './PdfPage';

function ScrollPdf({ docFile }) {
  const [pdfPageList, setPdfPageList] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const dragItem = useRef();
  const dragItemPageNum = useRef(0);
  let dragging = false;

  const handleOnDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    setPdfPageList([...Array(pdf.numPages).keys()]);
  };

  const handleDragEnd = () => {
    dragItem.current.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragItemPageNum.current = 0;
  };

  const handleDragEnter = (event, pageNum) => {
    if (dragItemPageNum.current !== pageNum && dragging) {
      dragging = false;
      setPdfPageList((oldList) => {
        const newList = [...oldList];
        [newList[pageNum], newList[dragItemPageNum.current]] = [
          newList[dragItemPageNum.current], newList[pageNum]];
        // dragItemPageNum.current = pageNum;
        return newList;
      });
    }
  };

  const handleDragStart = (event, pageNum) => {
    dragging = true;
    dragItem.current = event.target;
    dragItemPageNum.current = pageNum;
    dragItem.current.addEventListener('dragend', handleDragEnd);
  };

  return (
    <div className="flex flex-col items-center">
      <AddIcon className=" border-2 rounded-full border-indigo-500" />
      <Document file={docFile} onLoadSuccess={handleOnDocumentLoadSuccess}>
        { pdfPageList.map((value, index) => (
          <div className="flex flex-col items-center" key={uuid()}>
            <PdfPage
              width={100}
              scale={2}
              pageNumber={value + 1}
              dragEnter={handleDragEnter}
              dragStart={handleDragStart}
              numPages={numPages}
              pageIndex={index}
            />
            <div>
              <AddIcon className=" border-2 rounded-full border-indigo-500" />
            </div>
          </div>
        ))}
      </Document>

    </div>
  );
}

ScrollPdf.propTypes = {
  docFile: PropTypes.shape({ data: PropTypes.objectOf(number) }).isRequired,
};

export default ScrollPdf;
