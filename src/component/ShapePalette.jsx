/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as FreeHandDraw } from '../assets/draw_free_hand.svg';
import { ReactComponent as CircleDraw } from '../assets/draw_circle.svg';
import { ReactComponent as RectangleDraw } from '../assets/draw_rectangle.svg';
import { ReactComponent as EraserIcon } from '../assets/eraser.svg';

function ColorPalette({ onClicks, eraserRef }) {
  return (
    <div className="h-full flex justify-evenly">
      <button
        className="transition ease-out hover:-translate-y-0.5"
        name="free"
        onClick={(e) => {
          eraserRef.current.globalCompositeOperation = 'source-over';
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
        onClick={(e) => {
          eraserRef.current.globalCompositeOperation = 'source-over';
          onClicks(e);
        }}
        type="button"
      >
        <CircleDraw className="ml-2" />
        Circle
      </button>
      <button
        className="transition ease-out hover:-translate-y-0.5"
        name="rectangle"
        onClick={(e) => {
          eraserRef.current.globalCompositeOperation = 'source-over';
          onClicks(e);
        }}
        type="button"
      >
        <RectangleDraw className="ml-5" />
        Rectangle
      </button>
      <button
        name="eraser"
        onClick={(e) => {
          eraserRef.current.globalCompositeOperation = 'destination-out';
          onClicks(e);
        }}
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
  eraserRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

export default ColorPalette;
