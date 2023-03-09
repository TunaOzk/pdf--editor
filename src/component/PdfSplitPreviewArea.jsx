import React, { useRef, useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import PropTypes, { number } from 'prop-types';
import { last } from 'pdf-lib';
import { ReactComponent as LoadingIcon } from '../assets/loading.svg';
import IntervalBar from './IntervalBar';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';

function PdfSplitPreviewArea({
  file, setCurrentPdfPages, setSplitPdfPages, toggleOparation, setRangeNumber,
}) {
  const [pdfLength, setPdfLength] = useState(0);
  const [screenScale, setScreenScale] = useState(0);

  const [currPdfPages, setCurrPdfPages] = useState([]);
  const [currSplitPdfPages, setCurrSplitPdfPages] = useState([]);

  const inputFirstRef = useRef(null);
  const inputLastRef = useRef(null);

  const [pageIndexFirst, setPageIndexFirst] = useState(1);
  const [pageIndexLast, setPageIndexLast] = useState(1);
  const [rangeIndex, setRangeIndex] = useState(0);

  const handleLoadSucces = (pdf) => {
    setPdfLength(pdf.numPages);
    setPageIndexLast(pdf.numPages);
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrPdfPages(pdfPages);
    setCurrentPdfPages(() => pdfPages);
  };
  const handleRangeClickForwardFirst = () => {
    if (rangeIndex + 1 <= pageIndexLast) {
      setRangeIndex(rangeIndex + 1);
    }
  };

  const handleRangeClickBackFirst = () => {
    if (rangeIndex - 1 > 0) {
      setRangeIndex(rangeIndex - 1);
    }
  };

  const handleNavigationClickForwardFirst = () => {
    if (pageIndexFirst + 1 <= pageIndexLast) {
      setPageIndexFirst(pageIndexFirst + 1);
    }
  };

  const handleNavigationClickBackFirst = () => {
    if (pageIndexFirst - 1 > 0) {
      setPageIndexFirst(pageIndexFirst - 1);
    }
  };

  const handleNavigationClickForwardLast = () => {
    if (pageIndexLast + 1 <= pdfLength) {
      setPageIndexLast(pageIndexLast + 1);
    }
  };

  const handleNavigationClickBackLast = () => {
    if (pageIndexLast - 1 >= pageIndexFirst) {
      setPageIndexLast(pageIndexLast - 1);
    }
  };
  function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx);
  }

  const handleLoading = () => <LoadingIcon className="animate-spin" />;

  const handleChangeRange = (e) => {
    const pageNum = Number(e.target.value);
    if (pageNum > 0 && pageNum <= pdfLength && pageNum <= pageIndexLast) {
      setRangeIndex(pageNum);
    }
  };

  const handleChangeFirst = (e) => {
    const pageNum = Number(e.target.value);
    if (pageNum > 0 && pageNum <= pdfLength && pageNum <= pageIndexLast) {
      setPageIndexFirst(pageNum);
    }
  };

  const handleChangeLast = (e) => {
    const pageNum = Number(e.target.value);
    if (pageNum > 0 && pageNum <= pdfLength && pageNum >= pageIndexFirst) {
      setPageIndexLast(pageNum);
    }
  };

  useEffect(() => {
    const pdfPages = range(pageIndexFirst - 1, pageIndexLast - 1);
    setCurrSplitPdfPages(pdfPages);
    if (toggleOparation) setRangeIndex(0);

    setSplitPdfPages(() => pdfPages);
    setRangeNumber(rangeIndex);
    // eslint-disable-next-line no-restricted-globals
    if (screen.width > 700) {
      // eslint-disable-next-line no-restricted-globals
      setScreenScale(1);
    } else {
      // eslint-disable-next-line no-restricted-globals
      setScreenScale(0.7);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndexFirst, pageIndexLast, setSplitPdfPages, setRangeIndex, rangeIndex, toggleOparation]);

  return (
    (pdfLength > 1 && pageIndexFirst !== pageIndexLast) ? (
      <div className="flex flex-col items-center  justify-center">
        {toggleOparation ? (
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
                loading={() => { }}
                pageNumber={pageIndexFirst}
              // eslint-disable-next-line no-restricted-globals
                height={2 * (screen.height / 5)}
                scale={screenScale}
              />
              <h1 className="grid place-items-center text-xl"> ... </h1>
              <Page
                className="rounded-md border-4 border-purple-500 shadow-2xl"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={() => { }}
                pageNumber={pageIndexLast}
              // eslint-disable-next-line no-restricted-globals
                height={2 * (screen.height / 5)}
                scale={screenScale}
              />
            </Document>
            <IntervalBar
              onClickBackFirst={handleNavigationClickBackFirst}
              onClickForwardFirst={handleNavigationClickForwardFirst}
              onClickBackLast={handleNavigationClickBackLast}
              onClickForwardLast={handleNavigationClickForwardLast}
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
          <>
            <div className="grid grid-cols-6 grid-flow-row gap-4   place-items-center">
              {currPdfPages.map((value, numberIndex) => (
              // eslint-disable-next-line react/jsx-key
                <Document
                  key={value}
                  className="row-span-4 place-items-center space-x-1"
                  file={file}
                  onLoadSuccess={handleLoadSucces}
                  loading={handleLoading}
                >
                  <div className="row-span-4">
                    <Page
                      key={value}
                      className="rounded-md border-4 border-purple-500 shadow-2xl"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={() => { }}
                      pageNumber={numberIndex + 1}
            // eslint-disable-next-line no-restricted-globals
                      height={2 * (screen.height / 8)}
                      scale={screenScale}
                    />
                  </div>
                </Document>
              ))}
            </div>
            <div className="flex transition ease-in-out p-4
        text-white text-lg delay-75 opacity-70 hover:opacity-100 absolute max-[770px]:bottom-20 md:bottom-10 rounded-md bg-purple-500"
            >
              <div>

                Enter the range:
                <button
                  className="ml-2"
                  type="button"
                  onClick={handleRangeClickBackFirst}
                >
                  <BackIcon />
                </button>
                <input type="number" ref={inputFirstRef} value={rangeIndex} onChange={handleChangeRange} onWheel={(e) => e.target.blur()} min={1} max={pdfLength} className="text-base text-black text-center h-6 w-10 resize-none rounded-md " />
                <button
                  className=""
                  type="button"
                  onClick={handleRangeClickForwardFirst}
                >
                  <ForwardIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    ) : (
      <div className=" flex flex-row items-center gap-4 justify-center h-screen">

        <Document
          className="flex flex-row gap-4  place-items-center space-x-2"
          file={file}
          onLoadSuccess={handleLoadSucces}
          loading={handleLoading}
        >
          <Page
            className="rounded-md border-4 gap-4  border-purple-500 shadow-2xl"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={() => { }}
            pageNumber={pageIndexFirst}
            // eslint-disable-next-line no-restricted-globals
            height={2 * (screen.height / 5)}
            scale={screenScale}

          />
        </Document>
        <IntervalBar
          onClickBackFirst={handleNavigationClickBackFirst}
          onClickForwardFirst={handleNavigationClickForwardFirst}
          onClickBackLast={handleNavigationClickBackLast}
          onClickForwardLast={handleNavigationClickForwardLast}
          inputFirstRef={inputFirstRef}
          inputLastRef={inputLastRef}
          inputFirstValue={pageIndexFirst}
          inputLastValue={pageIndexLast}
          onChangeFirst={handleChangeFirst}
          onChangeLast={handleChangeLast}
          pdfLength={pdfLength}
        />
      </div>
    )
  );
}

PdfSplitPreviewArea.propTypes = {
  file: PropTypes.string.isRequired,
  setCurrentPdfPages: PropTypes.func.isRequired,
  setSplitPdfPages: PropTypes.func.isRequired,
  toggleOparation: PropTypes.bool.isRequired,
  setRangeNumber: PropTypes.func.isRequired,
};

export default PdfSplitPreviewArea;
