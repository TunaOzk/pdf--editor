import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';
import { ReactComponent as ZoomInIcon } from '../assets/zoom_in.svg';
import { ReactComponent as ZoomOutIcon } from '../assets/zoom_out.svg';

function IntervalBar({
  innerFirstRef, innerLastRef, onClickForward, onClickBack,
  pdfLength, inputFirstValue, inputLastValue, onChangeFirst, onChangeLast,
}) {
  return (
    <div className="flex transition ease-in-out p-4
    text-white text-lg delay-75 opacity-25 hover:opacity-100 absolute bottom-10 rounded-md bg-purple-500"
    >
      <div>
        <button
          className="mr-2"
          type="button"
          onClick={onClickBack}
        >
          <BackIcon />
        </button>
        <input type="number" ref={innerFirstRef} value={inputFirstValue} onChange={onChangeFirst} onWheel={(e) => e.target.blur()} min={1} max={pdfLength} className="text-base mr-2 text-black text-center h-6 w-10 resize-none rounded-md overflow-hidden" />
        /
        {' '}
        <input type="number" ref={innerLastRef} value={inputLastValue} onChange={onChangeLast} onWheel={(e) => e.target.blur()} min={1} max={pdfLength} className="text-base mr-2 text-black text-center h-6 w-10 resize-none rounded-md overflow-hidden" />
        <button
          className="ml-2"
          type="button"
          onClick={onClickForward}
        >
          <ForwardIcon />
        </button>
      </div>

      <div className="flex">
        <button title="Zoom In" className="ml-4 transition ease-in-out delay-75 hover:-translate-y-1" type="button">
          <ZoomInIcon />
        </button>
        <button title="Zoom Out" className="ml-4 transition ease-in-out delay-75 hover:-translate-y-1" type="button">
          <ZoomOutIcon />
        </button>
      </div>

    </div>
  );
}

IntervalBar.propTypes = {
  innerLastRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  innerFirstRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  onClickForward: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  pdfLength: PropTypes.number.isRequired,
  inputFirstValue: PropTypes.number.isRequired,
  inputLastValue: PropTypes.number.isRequired,
  onChangeFirst: PropTypes.func.isRequired,
  onChangeLast: PropTypes.func.isRequired,
};

export default IntervalBar;
