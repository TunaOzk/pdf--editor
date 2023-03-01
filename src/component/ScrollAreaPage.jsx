import React, { useMemo } from 'react';
// import { useInView } from 'react-intersection-observer';
import { Page } from 'react-pdf';
import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';

function ScrollAreaPage({
  pageNum, width, scale, index, onDelete, onClick, isLastDelete,
}) {
  // const { ref, inView } = useInView();
  const memoizedPdfPage = useMemo(() => (
    <Draggable draggableId={pageNum.toString()} index={index}>
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
            loading={() => {}}
            pageNumber={pageNum}
            width={width}
            scale={scale}
          />
          {/* <div ref={ref}>
          { inView ? (
            <Page
              onClick={(e) => onClick(e, pageNum, index)}
              className="rounded-md border-4 border-purple-500"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={() => {}}
              pageNumber={pageNum}
              width={width}
              scale={scale}
            />
          ) : <div style={{ height: 225, width: 200 }} />}
        </div> */}
          <button
            title="Delete"
            disabled={isLastDelete}
            type="submit"
            onClick={() => onDelete(pageNum, index)}
            className={`absolute ${!isLastDelete ? 'hover:bg-[#dc2626]' : 'hover:bg-gray-500'}  
            transition ease-in-out duration-300 border-2 rounded-md border-purple-500`}
          >
            <RemoveIcon />
          </button>
        </div>

      )}
    </Draggable>
  ), [index, isLastDelete, onClick, onDelete, pageNum, scale, width]);

  return (<div>{memoizedPdfPage}</div>);
}

ScrollAreaPage.propTypes = {
  pageNum: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isLastDelete: PropTypes.bool.isRequired,
};

export default ScrollAreaPage;
