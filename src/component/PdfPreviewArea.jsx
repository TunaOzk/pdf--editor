import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';

function PdfPreviewArea({
  file, pageList, pageNum,
}) {
  const handleLoading = () => <LoadingIcon className="animate-spin" />;
  return (
    <Document
      file={file}
      loading={handleLoading}
    >
      {pageList.length > 0 && (
      <Page
        className="rounded-md border-4 border-purple-500 shadow-2xl"
        renderTextLayer={false}
        renderAnnotationLayer={false}
        loading={() => {}}
        pageNumber={pageNum}
        width={500}
      />
      )}

    </Document>
  );
}

PdfPreviewArea.propTypes = {
  file: PropTypes.shape({ data: PropTypes.objectOf(number) }).isRequired,
  pageList: PropTypes.arrayOf(number).isRequired,
  pageNum: PropTypes.number.isRequired,
};

export default PdfPreviewArea;
