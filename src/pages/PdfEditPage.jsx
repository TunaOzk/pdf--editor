import React, { useRef, useState } from 'react';
import {
  Document, Page, pdfjs,
} from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import uuid from 'react-uuid';
import PdfPage from '../component/PdfPage';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();
  const fileRef = useRef({ data: location.state });
  const [numPages, setNumPages] = useState(0);
  const [pdfPageList, setPdfPageList] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const pageNumIndex = useRef(0);

  const handleOnDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    setPdfPageList([...Array(pdf.numPages).keys()]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    switch (pageNumIndex.current) {
      case result.source.index:
        pageNumIndex.current = result.destination.index;
        break;
      case result.destination.index:
        pageNumIndex.current = result.source.index;
        break;
      default:
        break;
    }
    const newPageList = pdfPageList;
    const [reorderedPage] = newPageList.splice(result.source.index, 1);
    newPageList.splice(result.destination.index, 0, reorderedPage);
    setPdfPageList(newPageList);
  };

  const handleDelete = (num) => {
    setPdfPageList((prevList) => prevList.filter((item, index) => item !== num - 1));
  };

  const handleClick = (e, num) => {
    if (pageNum !== num) { setPageNum(num); }
  };

  const handleNavigationClickForward = () => {
    if (pdfPageList.length === 1) return;
    pageNumIndex.current = (pageNumIndex.current + 1) % pdfPageList.length;
    setPageNum(pdfPageList[pageNumIndex.current] + 1);
  };

  const handleNavigationClickBack = () => {
    if (pdfPageList.length === 1) return;
    pageNumIndex.current = pageNumIndex.current === 0
      ? pdfPageList.length - 1 : (pageNumIndex.current - 1) % pdfPageList.length;
    setPageNum(pdfPageList[pageNumIndex.current] + 1);
  };

  return (
    <div className="flex h-screen">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center w-1/5 border-4 border-black overflow-y-auto">
          <Document file={fileRef.current} onLoadSuccess={handleOnDocumentLoadSuccess}>
            <Droppable droppableId={uuid().toString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...provided.droppableProps}
                  className="flex flex-col items-center"
                >
                  {pdfPageList.map((value, index) => (
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

      <div className="relative flex flex-col items-center justify-center w-4/5">
        <form className="absolute top-0 left-0 rounded-md border-4 border-indigo-500">
          <select name="pdfSelect">
            <option>PDF1</option>
            <option>PDF2</option>
            <option>PDF3</option>
          </select>
        </form>
        <button
          onClick={handleNavigationClickForward}
          className="transition ease-in-out duration-300 hover:bg-sky-500 rounded-md border-4 border-indigo-500 absolute right-0"
          type="button"
        >
          <ForwardIcon />
        </button>
        <button
          onClick={handleNavigationClickBack}
          className="transition ease-in-out duration-300 hover:bg-sky-500 rounded-md border-4 border-indigo-500 absolute left-0"
          type="button"
        >
          <BackIcon />
        </button>

        <Document
          file={fileRef.current}
          onLoadSuccess={handleOnDocumentLoadSuccess}
        >
          <Page
            className="rounded-md border-4 border-indigo-500"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            pageNumber={pageNum}
            width={500}
          />

        </Document>
      </div>
    </div>

  );
}

export default PdfEditPage;
