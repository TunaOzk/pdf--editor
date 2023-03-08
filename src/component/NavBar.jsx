import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as ForwardIcon } from '../assets/arrow_forward.svg';
import { ReactComponent as BackIcon } from '../assets/arrow_back.svg';
import { ReactComponent as ZoomInIcon } from '../assets/zoom_in.svg';
import { ReactComponent as ZoomOutIcon } from '../assets/zoom_out.svg';

function NavBar({
  innerRef, onClickForward, onClickBack, pdfLength, inputValue, onChange,
}) {
  return (
    <div className="flex transition ease-in-out p-4
    text-white text-lg delay-75 opacity-25 hover:opacity-100 absolute z-30 bottom-10 rounded-md bg-purple-500"
    >
      <div>
        <button
          className="mr-2"
          type="button"
          onClick={onClickBack}
        >
          <BackIcon />
        </button>
        <input type="number" ref={innerRef} value={inputValue} onChange={onChange} onWheel={(e) => e.target.blur()} min={1} max={pdfLength} className="text-base mr-2 text-black text-center h-6 w-10 resize-none rounded-md overflow-hidden" />
        /
        {' '}
        {pdfLength}
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

NavBar.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  onClickForward: PropTypes.func.isRequired,
  onClickBack: PropTypes.func.isRequired,
  pdfLength: PropTypes.number.isRequired,
  inputValue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NavBar;
