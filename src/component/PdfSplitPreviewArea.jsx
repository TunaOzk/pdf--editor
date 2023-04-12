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

  const [groups, setGroups] = useState([]);

  const handleLoadSucces = (pdf) => {
    setPdfLength(pdf.numPages);
    setPageIndexLast(pdf.numPages);
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrPdfPages(pdfPages);
    setCurrentPdfPages(() => pdfPages);
  };
  const handleRangeClickForwardFirst = () => {
    const pageNum = rangeIndex + 1;
    if (pageNum > 0 && pageNum <= pdfLength && pageNum <= pageIndexLast) {
      setRangeIndex(pageNum);
      const indices = currPdfPages.filter((val) => (val + 1) % pageNum === 0
        || val % pageNum === 0);
      if (indices.length % 2 !== 0) { indices.push(pdfLength - 1); }

      setGroups(() => indices.reduce((accumulator, currentValue, currentIndex, array) => {
        if (currentIndex % 2 !== 0) return accumulator;
        accumulator.push([array[currentIndex], array[currentIndex + 1]]);
        return accumulator;
      }, []));
    }
  };

  const handleRangeClickBackFirst = () => {
    const pageNum = rangeIndex - 1;
    if (pageNum > 0 && pageNum <= pdfLength && pageNum <= pageIndexLast) {
      setRangeIndex(pageNum);
      const indices = currPdfPages.filter((val) => (val + 1) % pageNum === 0
        || val % pageNum === 0);
      if (indices.length % 2 !== 0) { indices.push(pdfLength - 1); }

      setGroups(() => indices.reduce((accumulator, currentValue, currentIndex, array) => {
        if (currentIndex % 2 !== 0) return accumulator;
        accumulator.push([array[currentIndex], array[currentIndex + 1]]);
        return accumulator;
      }, []));
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
      const indices = currPdfPages.filter((val) => (val + 1) % pageNum === 0
        || val % pageNum === 0);
      if (indices.length % 2 !== 0) { indices.push(pdfLength - 1); }

      setGroups(() => indices.reduce((accumulator, currentValue, currentIndex, array) => {
        if (currentIndex % 2 !== 0) return accumulator;
        accumulator.push([array[currentIndex], array[currentIndex + 1]]);
        return accumulator;
      }, []));
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
      <div className="flex flex-col items-center justify-center">
        {toggleOparation ? (
          <div className=" flex flex-row items-center  justify-center">

            <Document
              className="flex flex-row place-items-center space-x-1"
              file={file}
              onLoadSuccess={handleLoadSucces}
              loading={handleLoading}
            >
              <Page
                className="rounded-md border-2 border-[#1c1b1e] shadow-2xl"
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
                className="rounded-md border-2 border-[#1c1b1e] shadow-2xl"
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
          <div className="h-screen w-fit max-sm:mt-[250px] sm:mt-[300px]">
            {!rangeIndex && (
              <div className="h-1/2 w-fit flex items-center">
                <p className="text-xl">Please enter a custom range to split your PDF.</p>
              </div>
            )}
            <Document
              file={file}
              onLoadSuccess={handleLoadSucces}
              loading={handleLoading}
            >
              <div className="grid min-[880px]:grid-cols-2 gap-4">
                {groups.map((val, index) => (
                  <div key={`group${index + 1}`} className="flex grid grid-cols-1 gap-2">
                    {rangeIndex > 1
                      ? (
                        <div className="border-dashed  border-2 p-2 border-gray-300">
                          <div className="flex grid grid-cols-2 gap-2 ">
                            <div className="bg-white">
                              <p className="bg-[#fbf8fd]">
                                Page
                                {val[0] + 1}
                              </p>
                              <Page
                                className="rounded-md  border-2 border-[#1c1b1e] shadow-2xl w-full"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                loading={() => { }}
                                pageNumber={val[0] + 1}
                                // eslint-disable-next-line no-restricted-globals
                                height={2 * (screen.height / 8)}
                                scale={screenScale}
                              />
                            </div>

                            <div className="bg-white">
                              {pdfLength - 1 !== val[0] ? (
                                <>

                                  <p className="bg-[#fbf8fd]">
                                    Page
                                    {val[1] + 1}
                                  </p>
                                  <Page
                                    className="rounded-md border-2 border-[#1c1b1e] shadow-2xl"
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={() => { }}
                                    pageNumber={val[1] + 1}
                                    // eslint-disable-next-line no-restricted-globals
                                    height={2 * (screen.height / 8)}
                                    scale={screenScale}
                                  />
                                </>
                              )
                                : null}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="">
                          {rangeIndex < 1 ? (null) : (
                            <div className="flex grid grid-cols-2 gap-2">
                              <div className="">
                                <p>
                                  Page
                                  {val[0] + 1}
                                </p>
                                <Page
                                  className="rounded-md border-2 border-[#1c1b1e] shadow-2xl"
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                  loading={() => { }}
                                  pageNumber={val[0] + 1}
                                  // eslint-disable-next-line no-restricted-globals
                                  height={2 * (screen.height / 8)}
                                  scale={screenScale}
                                />
                              </div>
                              {pdfLength - 1 !== val[0] ? (
                                <div>
                                  <p>
                                    Page
                                    {val[1] + 1}
                                  </p>
                                  <Page
                                    className="rounded-md border-2 border-[#1c1b1e] shadow-2xl"
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={() => { }}
                                    pageNumber={val[1] + 1}
                                    // eslint-disable-next-line no-restricted-globals
                                    height={2 * (screen.height / 8)}
                                    scale={screenScale}
                                  />
                                </div>
                              ) : null}
                            </div>
                          )}

                        </div>

                      )}
                  </div>
                ))}
              </div>

            </Document>
            <div className="fixed left-1/2 transform -translate-x-1/2 max-[770px]:w-2/3 bottom-0 transition ease-in-out p-4
        text-white text-lg delay-75 opacity-70 hover:opacity-100 max-[770px]:bottom-20
        md:bottom-10 rounded-md bg-[#4f33ff]"
            >
              <div className="flex items-center justify-center">

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
          </div>
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
            className="rounded-md border-2 gap-4  border-[#1c1b1e] shadow-2xl"
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
