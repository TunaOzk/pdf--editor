import React from 'react';
import PropTypes from 'prop-types';

function ColorPalette({ onClick }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <button onClick={onClick} style={{ backgroundColor: 'rgb(0 0 0)' }} className="rounded-lg w-12 h-8" aria-label="black" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(220 38 38)' }} className="rounded-lg w-12 h-8" aria-label="red" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(234 88 12)' }} className="rounded-lg w-12 h-8" aria-label="orange" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(253 224 71)' }} className="rounded-lg w-12 h-8" aria-label="yellow" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(146 64 14)' }} className="rounded-lg w-12 h-8" aria-label="brown" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(22 163 74)' }} className="rounded-lg w-12 h-8" aria-label="green" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(37 99 235)' }} className="rounded-lg w-12 h-8" aria-label="blue" type="button" />
      <button onClick={onClick} style={{ backgroundColor: 'rgb(147 51 234)' }} className="rounded-lg w-12 h-8" aria-label="purple" type="button" />
    </div>
  );
}

ColorPalette.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ColorPalette;
