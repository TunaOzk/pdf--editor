import React from 'react';
import { Page } from 'react-pdf';
import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';

function PdfPage({
  pageNum, width, scale, index, onDelete, onClick,
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
            onClick={(e) => onClick(e, pageNum, index)}
            className="rounded-md border-4 border-purple-500"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            pageNumber={pageNum}
            width={width}
            scale={scale}

          />
          <button type="submit" onClick={() => onDelete(pageNum)} className="absolute hover:bg-[#dc2626] transition ease-in-out duration-300 border-2 rounded-md border-purple-500">
            <RemoveIcon />
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
  onClick: PropTypes.func.isRequired,
};

export default PdfPage;
