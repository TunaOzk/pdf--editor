import React, { useRef, useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';
import IntervalBar from './IntervalBar';

function PdfSplitPreviewArea({
  file, setCurrentPdfPages, setSplitPdfPages,
}) {
  const [pdfLength, setPdfLength] = useState(0);
  const [currPdfPages, setCurrPdfPages] = useState([]);
  const [currSplitPdfPages, setCurrSplitPdfPages] = useState([]);

  const inputFirstRef = useRef(null);
  const inputLastRef = useRef(null);

  const [pageIndexFirst, setPageIndexFirst] = useState(1);
  const [pageIndexLast, setPageIndexLast] = useState(1);

  const handleLoadSucces = (pdf) => {
    setPdfLength(pdf.numPages);
    setPageIndexLast(pdf.numPages);
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrPdfPages(pdfPages);
    setCurrentPdfPages(() => pdfPages);
  };
  function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  }

  const deneme = () => {
    const pdfPages = range(pageIndexFirst, pageIndexLast);
    setCurrSplitPdfPages(pdfPages);
    console.log(currSplitPdfPages);
    setSplitPdfPages(() => pdfPages);
  };
  const handleLoading = () => <LoadingIcon className="animate-spin" />;
  const handleChangeFirst = (e) => {
    const pageNum = Number(e.target.value);
    if (pageNum > 0 && pageNum <= pdfLength) {
      setPageIndexFirst(pageNum);
    }
  };

  const handleChangeLast = (e) => {
    const pageNum = Number(e.target.value);
    if (pageNum > 0 && pageNum <= pdfLength) {
      setPageIndexLast(pageNum);
      deneme();
    }
  };

  useEffect(() => {
    const pdfPages = range(pageIndexFirst, pageIndexLast);
    setCurrSplitPdfPages(pdfPages);
    // console.log(currSplitPdfPages);
    setSplitPdfPages(() => pdfPages);
  }, [pageIndexFirst, pageIndexLast, setSplitPdfPages]);

  return (
    pdfLength > 1 ? (
      <div className=" flex flex-row items-center  justify-center">
        <Document
          className="flex flex-row place-items-center space-x-1"
          file={file}
          onLoadSuccess={handleLoadSucces}
          loading={handleLoading}
        >
          <Page
            className="rounded-md border-4 border-purple-500 shadow-2xl"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={() => {}}
            pageNumber={1}
            width={250}
          />
          <h1 className="grid place-items-center text-xl"> ... </h1>
          <Page
            className="rounded-md border-4 border-purple-500 shadow-2xl"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={() => {}}
            pageNumber={pdfLength}
            width={250}
          />
        </Document>
        <IntervalBar
          inputFirstRef={inputFirstRef}
          inputLastRef={inputLastRef}
          inputFirstValue={pageIndexFirst}
          inputLastValue={pageIndexLast}
          onChangeFirst={handleChangeFirst}
          onChangeLast={handleChangeLast}
          pdfLength={pdfLength}
        />
      </div>
    ) : (
      <div className=" flex flex-row items-center  justify-center h-screen">

        <Document
          className="flex flex-row place-items-center space-x-1"
          file={file}
          onLoadSuccess={handleLoadSucces}
          loading={handleLoading}
        >
          <Page
            className="rounded-md border-4 border-purple-500 shadow-2xl"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={() => {}}
            pageNumber={1}
            width={250}
          />
        </Document>
        <IntervalBar />
      </div>
    )
  );
}

PdfSplitPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  setCurrentPdfPages: PropTypes.func.isRequired,
  setSplitPdfPages: PropTypes.func.isRequired,
};

export default PdfSplitPreviewArea;
