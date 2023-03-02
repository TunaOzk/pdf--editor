/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as FreeHandDraw } from '../assets/draw_free_hand.svg';
import { ReactComponent as CircleDraw } from '../assets/draw_circle.svg';
import { ReactComponent as RectangleDraw } from '../assets/draw_rectangle.svg';
import { ReactComponent as EraserIcon } from '../assets/eraser.svg';

function ColorPalette({ onClicks }) {
  return (
    <div className="h-full flex justify-evenly">
      <button
        className="transition ease-out hover:-translate-y-0.5"
        name="free"
        onClick={(e) => {
          onClicks(e);
        }}
        type="button"
      >
        <FreeHandDraw className="ml-2" />
        Draw
      </button>
      <button
        className="transition ease-out hover:-translate-y-0.5"
        name="circle"
        onClick={onClicks}
        type="button"
      >
        <CircleDraw className="ml-2" />
        Circle
      </button>
      <button
        className="transition ease-out hover:-translate-y-0.5"
        name="rectangle"
        onClick={onClicks}
        type="button"
      >
        <RectangleDraw className="ml-5" />
        Rectangle
      </button>
      <button
        name="eraser"
        onClick={onClicks}
        className="transition ease-out hover:-translate-y-0.5"
        type="button"
      >
        <EraserIcon className="ml-2" />
        Eraser
      </button>
    </div>
  );
}

ColorPalette.propTypes = {
  onClicks: PropTypes.func.isRequired,
};

export default ColorPalette;
