import React, { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Page } from 'react-pdf';
import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import { ReactComponent as RemoveIcon } from '../assets/remove.svg';

function ScrollAreaPage({
  pageNum, width, scale, index, onDelete, onClick, isLastDelete,
}) {
  const { ref, inView } = useInView();
  const memoizedPdfPage = useMemo(() => {
    console.log('');
    return (
      <Draggable draggableId={`${pageNum}`} index={index}>
        {(provided) => (
          <div
            className="flex flex-col relative mb-2"
            ref={provided.innerRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
            {...provided.draggableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
            {...provided.dragHandleProps}
          >
            <Page
              onClick={(e) => onClick(e, pageNum, index)}
              className="rounded-md border-2 border-[#1c1b1e]"
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
            ) : <div className="bg-black" style={{ height: 150, width: 200 }} />}
          </div> */}
            <button
              title="Delete"
              disabled={isLastDelete}
              type="submit"
              onClick={() => onDelete(pageNum, index)}
              className={`absolute ${!isLastDelete ? 'hover:bg-[#dc2626]' : 'hover:bg-gray-500'}  
            transition ease-in-out duration-300 border-2 rounded-md border-[#1c1b1e]`}
            >
              <RemoveIcon />
            </button>
            <div className="absolute bottom-0 px-2 text-[#1b1a2c] bg-[#e4dff9] rounded-r-md flex justify-center h-fit w-fit border-2 border-[#1c1b1e]">{pageNum}</div>
          </div>

        )}
      </Draggable>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    memoizedPdfPage
    // <div>
    //   {' '}
    //   <Draggable draggableId={`${pageNum}`} index={index}>
    //     {(provided) => (
    //       <div
    //         className="flex flex-col relative mb-2"
    //         ref={provided.innerRef}
    // // eslint-disable-next-line react/jsx-props-no-spreading
    //         {...provided.draggableProps}
    // // eslint-disable-next-line react/jsx-props-no-spreading
    //         {...provided.dragHandleProps}
    //       >
    //         {/* <Page
    //           onClick={(e) => onClick(e, pageNum, index)}
    //           className="rounded-md border-2 border-[#1c1b1e]"
    //           renderTextLayer={false}
    //           renderAnnotationLayer={false}
    //           loading={() => {}}
    //           pageNumber={pageNum}
    //           width={width}
    //           scale={scale}
    //         /> */}
    //         <div ref={ref}>
    //           { inView ? (
    //             <Page
    //               onClick={(e) => onClick(e, pageNum, index)}
    //               className="rounded-md border-4 border-purple-500"
    //               renderTextLayer={false}
    //               renderAnnotationLayer={false}
    //               loading={() => {}}
    //               pageNumber={pageNum}
    //               width={width}
    //               scale={scale}
    //             />
    //           ) : <div className="bg-black" style={{ height: 225, width: 200 }} />}
    //         </div>
    //         <button
    //           title="Delete"
    //           disabled={isLastDelete}
    //           type="submit"
    //           onClick={() => onDelete(pageNum, index)}
    //           className={`absolute ${!isLastDelete ? 'hover:bg-[#dc2626]' : 'hover:bg-gray-500'}
    //     transition ease-in-out duration-300 border-2 rounded-md border-[#1c1b1e]`}
    //         >
    //           <RemoveIcon />
    //         </button>
    //         <div className="absolute bottom-0 px-2 text-[#1b1a2c] bg-[#e4dff9]
    //  rounded-r-md flex justify-center h-fit w-fit border-2 border-[#1c1b1e]">{pageNum}</div>
    //       </div>

  //     )}
  //   </Draggable>
  // </div>
  );
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
