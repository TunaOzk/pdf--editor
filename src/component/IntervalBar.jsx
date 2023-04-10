import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';
import { ReactComponent as ZoomInIcon } from '../assets/zoom_in.svg';
import { ReactComponent as ZoomOutIcon } from '../assets/zoom_out.svg';

function IntervalBar({
  innerFirstRef, innerLastRef, onClickForwardFirst, onClickBackFirst,
  pdfLength, inputFirstValue, inputLastValue, onChangeFirst, onChangeLast,
  onClickForwardLast, onClickBackLast,
}) {
  return (
    <div className="flex transition ease-in-out p-4
    text-white text-lg delay-75 opacity-70 hover:opacity-100 absolute max-[770px]:bottom-20 md:bottom-10 rounded-md bg-[#4f33ff]"
    >
      <div>
        <button
          className="mr-2"
          type="button"
          onClick={onClickBackFirst}
        >
          <BackIcon />
        </button>
        <input type="number" ref={innerFirstRef} value={inputFirstValue} onChange={onChangeFirst} onWheel={(e) => e.target.blur()} min={1} max={pdfLength} className="text-base mr-2 text-black text-center h-6 w-10 resize-none rounded-md overflow-hidden" />
        <button
          className=""
          type="button"
          onClick={onClickForwardFirst}
        >
          <ForwardIcon />
        </button>

        <button
          className="mr-2"
          type="button"
          onClick={onClickBackLast}
        >
          <BackIcon />
        </button>
        <input type="number" ref={innerLastRef} value={inputLastValue} onChange={onChangeLast} onWheel={(e) => e.target.blur()} min={1} max={pdfLength} className="text-base mr-2 text-black text-center h-6 w-10 resize-none rounded-md overflow-hidden" />
        <button
          className=""
          type="button"
          onClick={onClickForwardLast}
        >
          <ForwardIcon />
        </button>
      </div>

    </div>
  );
}

IntervalBar.propTypes = {
  innerLastRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  innerFirstRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  onClickForwardFirst: PropTypes.func.isRequired,
  onClickBackFirst: PropTypes.func.isRequired,
  onClickForwardLast: PropTypes.func.isRequired,
  onClickBackLast: PropTypes.func.isRequired,
  pdfLength: PropTypes.number.isRequired,
  inputFirstValue: PropTypes.number.isRequired,
  inputLastValue: PropTypes.number.isRequired,
  onChangeFirst: PropTypes.func.isRequired,
  onChangeLast: PropTypes.func.isRequired,
};

export default IntervalBar;
