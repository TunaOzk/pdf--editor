import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Document } from 'react-pdf';
import uuid from 'react-uuid';
import PropTypes, { number } from 'prop-types';
import PdfPage from './PdfPage';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfScrollArea({
  dragEnd, docLoadSucces, file, pageList, onDelete, onClick,
}) {
  const handleLoading = () => <LoadingIcon className="animate-spin" />;

  return (
    <DragDropContext onDragEnd={dragEnd}>
      <div className="flex flex-col items-center w-1/5 border-4 border-violet-400 overflow-y-auto">
        <Document file={file} onLoadSuccess={docLoadSucces} loading={handleLoading}>
          <Droppable droppableId={uuid().toString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                {...provided.droppableProps}
                className="flex flex-col items-center"
              >
                {pageList.map((value, index) => (
                  <PdfPage
                    key={value}
                    pageNum={value + 1}
                    width={100}
                    scale={2}
                    index={index}
                    onDelete={onDelete}
                    onClick={onClick}
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
  dragEnd: PropTypes.func.isRequired,
  docLoadSucces: PropTypes.func.isRequired,
  file: PropTypes.shape({ data: PropTypes.objectOf(number) }).isRequired,
  pageList: PropTypes.arrayOf(number).isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PdfScrollArea;
