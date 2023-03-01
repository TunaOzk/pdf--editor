import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as SimpleTextAreaIcon } from '../assets/simple_text_area.svg';
import { ReactComponent as FillableTextAreaIcon } from '../assets/fillable_text_area.svg';

function TextAreaPalette({ onTextAreaAdd }) {
  return (
    <div className="w-full flex justify-evenly items-center">
      <button
        title="Simple Text Area"
        type="button"
        onClick={() => onTextAreaAdd('S')}
        className="transition ease-out hover:-translate-y-0.5"
      >
        <SimpleTextAreaIcon />
      </button>

      <button
        title="Fillable Text Area"
        type="button"
        onClick={() => onTextAreaAdd('F')}
        className="transition ease-out hover:-translate-y-0.5"
      >
        <FillableTextAreaIcon />
      </button>
    </div>
  );
}

TextAreaPalette.propTypes = {
  onTextAreaAdd: PropTypes.func.isRequired,
};

export default TextAreaPalette;
