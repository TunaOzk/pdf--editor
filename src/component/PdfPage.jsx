import React from 'react';
import { Page } from 'react-pdf';
import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import { ReactComponent as AddIcon } from '../assets/remove.svg';

function PdfPage({
  pageNum, width, scale, index, onDelete,
}) {
  const pageNumStr = pageNum.toString();
  return (
    <Draggable draggableId={pageNumStr} index={index}>
      {(provided) => (
        <div
          className="flex flex-col relative"
          ref={provided.innerRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.draggableProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.dragHandleProps}
        >
          <Page
            className="rounded-md border-4 border-indigo-500"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            pageNumber={pageNum}
            width={width}
            scale={scale}

          />
          <button type="submit" onClick={() => onDelete(pageNum)} className="absolute hover:bg-[#dc2626] duration-100 border-2 rounded-md border-indigo-500">
            <AddIcon />
          </button>
        </div>

      )}
    </Draggable>

  );
}

PdfPage.propTypes = {
  pageNum: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PdfPage;
