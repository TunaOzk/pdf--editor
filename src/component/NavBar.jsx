import React from 'react';
import PropTypes from 'prop-types';
import { BackIcon, ForwardIcon } from '../assets';

function NavBar({
  innerRef, onClickForward, onClickBack, pdfLength, inputValue, onChange,
}) {
  return (
    <div className="flex transition ease-in-out p-4
    text-white text-lg delay-75 opacity-25 hover:opacity-100 absolute z-30 bottom-10 rounded-md bg-[#4f33ff]"
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
