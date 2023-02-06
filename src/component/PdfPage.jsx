import React from 'react';
import { Page } from 'react-pdf';
import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';

function PdfPage({
  pageNum, width, scale, index,
}) {
  const pageNumStr = pageNum.toString();
  return (
    <Draggable draggableId={pageNumStr} index={index}>
      {(provided) => (
        <div
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
};

export default PdfPage;
