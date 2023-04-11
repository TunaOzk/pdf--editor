import React, {
  useRef, useState, memo,
} from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Document, Page } from 'react-pdf';
import PropTypes, { arrayOf, number } from 'prop-types';
import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import ScrollAreaPage from './ScrollAreaPage';
import { LoadingIcon, RemoveIcon } from '../assets';

function PdfScrollArea({
  file, currFileIndex, setPageIndex, pdfPagesList,
  setPdfPagesList, currentPdfPages, setCurrentPdfPages,
}) {
  const currentPageIndex = useRef(0);
  const [maxCanvasHeight, setMaxCanvasHeight] = useState(0);
  const [disableDeleteOnLastRemainingPage, setDisableDeleteOnLastRemainingPage] = useState(false);
  const handleLoading = () => <LoadingIcon className="animate-spin" />;
  const deneme = useRef(null);

  const handleOnDocumentLoadSuccess = async (pdf) => {
    const heightArr = [];
    await Promise
      .all(Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (val) => {
        await pdf.getPage(val).then((page) => {
          const viewPort = page.getViewport({ scale: 1 });
          heightArr.push(viewPort.height * (200 / viewPort.width));
        });
      }));
    setMaxCanvasHeight(Math.max(...heightArr));
    setDisableDeleteOnLastRemainingPage(pdfPagesList[currFileIndex].length === 1);
    const pdfPages = [...Array(pdf.numPages).keys()];
    setCurrentPdfPages(() => {
      if (!pdfPagesList[currFileIndex].length) {
        setPdfPagesList((prevList) => {
          const newList = [...prevList];
          newList[currFileIndex] = pdfPages;
          return newList;
        });
        return pdfPages;
      }
      return pdfPagesList[currFileIndex];
    });
    currentPageIndex.current = 0;
    setPageIndex(0);
  };

  const handleDragEnd = (result) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    switch (currentPageIndex.current) {
      case result.source.index:
        currentPageIndex.current = result.destination.index;
        break;
      case result.destination.index:
        currentPageIndex.current = result.source.index;
        break;
      default:
        break;
    }

    const newPageList = [...currentPdfPages];
    const [reorderedPage] = newPageList.splice(result.source.index, 1);
    newPageList.splice(result.destination.index, 0, reorderedPage);
    setCurrentPdfPages(newPageList);
    setPdfPagesList((prevPagesList) => {
      const newPagesList = [...prevPagesList];
      newPagesList[currFileIndex] = newPageList;
      return newPagesList;
    });
  };

  const handleClick = (e, num, index) => {
    setPageIndex(index);
    currentPageIndex.current = index;
  };

  const handleDelete = (num, pageIndex) => {
    setCurrentPdfPages((prevList) => {
      const newList = prevList.filter((item, index) => item !== num - 1);
      setDisableDeleteOnLastRemainingPage(newList.length === 1);
      setPdfPagesList((prevPagesList) => {
        const newPagesList = [...prevPagesList];
        newPagesList[currFileIndex] = newList;
        return newPagesList;
      });
      return newList;
    });
    if (pageIndex === currentPdfPages.length - 1) {
      setPageIndex(0);
    } else if (pageIndex < currentPageIndex.current) {
      currentPageIndex.current -= 1;
      setPageIndex(currentPageIndex.current);
    }
  };

  // eslint-disable-next-line max-len
  // eslint-disable-next-line react/no-unstable-nested-components, react/display-name, react/prop-types
  const ListRow = memo(({ data, index, style }) => (
    <div style={style}>
      <ScrollAreaPage
        refx={deneme}
        pageNum={data[index] + 1}
        width={200}
        scale={1}
        index={index}
        onDelete={handleDelete}
        onClick={handleClick}
        isLastDelete={disableDeleteOnLastRemainingPage}
      />
    </div>
  ), areEqual);

  // const row = ({ data, index, style }) => (
  //   <div style={style}>
  //     <ScrollAreaPage
  //       pageNum={data[index] + 1}
  //       width={200}
  //       scale={1}
  //       index={index}
  //       onDelete={handleDelete}
  //       onClick={handleClick}
  //       isLastDelete={disableDeleteOnLastRemainingPage}
  //     />
  //   </div>
  // );
  return (
    <div className="mt-2 relative flex flex-col items-center">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>
          <Document
            file={file}
            onLoadSuccess={handleOnDocumentLoadSuccess}
            loading={handleLoading}
          >
            <Droppable
              mode="virtual"
              renderClone={(provided, snapshot, rubric) => (
                <div
                  className="flex flex-col relative mb-2"
                  ref={provided.innerRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
                  {...provided.draggableProps}
            // eslint-disable-next-line react/jsx-props-no-spreading
                  {...provided.dragHandleProps}
                >
                  <Page
                    onClick={(e) => handleClick(
                      e,
                      currentPdfPages[rubric.source.index],
                      rubric.source.index,
                    )}
                    className="rounded-md border-2 border-[#1c1b1e]"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={() => {}}
                    pageNumber={currentPdfPages[rubric.source.index] + 1}
                    width={100}
                    scale={2}
                  />
                  <button
                    title="Delete"
                    disabled={disableDeleteOnLastRemainingPage}
                    type="submit"
                    onClick={() => handleDelete(
                      currentPdfPages[rubric.source.index] + 1,
                      rubric.source.index,
                    )}
                    className={`absolute ${!disableDeleteOnLastRemainingPage ? 'hover:bg-[#dc2626]' : 'hover:bg-gray-500'}  
            transition ease-in-out duration-300 border-2 rounded-md border-[#1c1b1e]`}
                  >
                    <RemoveIcon />
                  </button>
                  <div className="absolute bottom-0 px-2 text-[#1b1a2c] bg-[#e4dff9]
            rounded-r-md flex justify-center h-fit w-fit border-2 border-[#1c1b1e]"
                  >
                    {currentPdfPages[rubric.source.index] + 1}

                  </div>
                </div>

              )}
              droppableId="droppable"
            >
              {(provided) => (
                <div style={{ height: '90vh' }} ref={provided.innerRef}>
                  <AutoSizer disableWidth>
                    {({ height }) => (
                      <List
                        height={height}
                        itemCount={currentPdfPages.length}
                        itemSize={maxCanvasHeight + 20}
                        width={220}
                        outerRef={provided.innerRef}
                        itemData={currentPdfPages}
                      >
                        {ListRow}

                      </List>
                    )}

                  </AutoSizer>
                </div>

              )}
            </Droppable>
          </Document>
        </div>
      </DragDropContext>
    </div>

  );
}

PdfScrollArea.propTypes = {
  file: PropTypes.string.isRequired,
  currFileIndex: PropTypes.number.isRequired,
  setPageIndex: PropTypes.func.isRequired,
  currentPdfPages: PropTypes.arrayOf(number).isRequired,
  setCurrentPdfPages: PropTypes.func.isRequired,
  pdfPagesList: PropTypes.arrayOf(arrayOf(number)).isRequired,
  setPdfPagesList: PropTypes.func.isRequired,
};

export default PdfScrollArea;
