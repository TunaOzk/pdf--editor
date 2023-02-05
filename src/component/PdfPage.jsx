import React, { useRef, useState } from 'react';
import { Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';

function PdfPage({
  width, scale, pageNumber, pageIndex, dragStart, dragEnter,
}) {
  return (
    <div
      draggable
      onDragEnter={(e) => dragEnter(e, pageIndex)}
      onDragStart={(e) => dragStart(e, pageIndex)}
    >
      <Page
        className="rounded-md border-4 border-indigo-500"
        renderTextLayer={false}
        renderAnnotationLayer={false}
        width={width}
        scale={scale}
        pageNumber={pageNumber}
      />
    </div>
  );
}

PdfPage.propTypes = {
  width: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  dragStart: PropTypes.func.isRequired,
  dragEnter: PropTypes.func.isRequired,
};

export default PdfPage;
