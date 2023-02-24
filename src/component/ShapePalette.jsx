import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as FreeHandDraw } from '../assets/draw_free_hand.svg';
import { ReactComponent as CircleDraw } from '../assets/draw_circle.svg';
import { ReactComponent as RectangleDraw } from '../assets/draw_rectangle.svg';

function ColorPalette({ onClick }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <button className="w-8 h-8" name="free" onClick={onClick} type="button">
        <FreeHandDraw className="absolute -z-10" />
      </button>
      <button className="w-8 h-8" name="circle" onClick={onClick} type="button">
        <CircleDraw className="absolute -z-10" />
      </button>
      <button className="w-8 h-8" name="rectangle" onClick={onClick} type="button">
        <RectangleDraw className="absolute -z-10" />
      </button>
    </div>
  );
}

ColorPalette.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ColorPalette;
