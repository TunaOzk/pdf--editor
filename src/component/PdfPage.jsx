import React from 'react';
import { Page } from 'react-pdf';
import PropTypes from 'prop-types';

function PdfPage({ width, scale, pageNumber }) {
  return (
    <div draggable>
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
};

export default PdfPage;
