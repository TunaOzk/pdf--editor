import React from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import PdfPage from './PdfPage';

function ScrollPdf({ docFile, onLoadSuccess, numPages }) {
  return (
    <div className="flex flex-col items-center">
      <AddIcon className=" border-2 rounded-full border-indigo-500" />
      <Document file={docFile} onLoadSuccess={onLoadSuccess}>
        { [
          ...Array(numPages),
        ].map((value, index) => (
          <div className="flex flex-col items-center" key={uuid()}>
            <PdfPage width={100} scale={2} pageNumber={index + 1} />
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
  docFile: PropTypes.string.isRequired,
  onLoadSuccess: PropTypes.func.isRequired,
  numPages: PropTypes.number.isRequired,
};

export default ScrollPdf;
