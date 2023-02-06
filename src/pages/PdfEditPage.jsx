import React, { useRef, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import uuid from 'react-uuid';
import PdfPage from '../component/PdfPage';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfEditPage() {
  const location = useLocation();
  const fileRef = useRef({ data: location.state });
  const [numPages, setNumPages] = useState(0);
  const [pdfPageList, setPdfPageList] = useState([]);

  const handleOnDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    setPdfPageList([...Array(pdf.numPages).keys()]);
  };

  const handleDragEnd = (result) => {
    const newPageList = pdfPageList;
    const [reorderedPage] = newPageList.splice(result.source.index, 1);
    newPageList.splice(result.destination.index, 0, reorderedPage);
    setPdfPageList(newPageList);
  };

  return (
    <div className="flex max-h-screen">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center w-1/5 min-h-screen border-4 border-black overflow-y-auto">

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
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}

            </Droppable>

          </Document>
        </div>
      </DragDropContext>

      <div className="w-4/5" />
    </div>

  );
}

export default PdfEditPage;
