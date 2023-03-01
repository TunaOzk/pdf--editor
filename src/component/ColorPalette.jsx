/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as ExpandMoreIcon } from '../assets/expand_more.svg';
import { ReactComponent as ExpandLessIcon } from '../assets/expand_less.svg';

function ColorPalette({
  onClicks, selectedColor, lineWidth, setLineWidth,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex h-full justify-center items-center">
      <div
        onClick={() => (setVisible((prev) => !prev))}
        onKeyDown={() => {}}
        tabIndex={0}
        role="button"
        className="flex"
      >
        <div style={{ backgroundColor: selectedColor }} className="rounded-md w-6 h-6" aria-label="selected-color" type="button" />
        {visible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
      { visible && (
      <div onBlur={() => setVisible(false)} className="absolute left-0 top-14 border-4 border-violet-400 bg-green-50 p-4">
        <div className="mb-2 grid grid-cols-6 gap-2">
          <button onClick={onClicks} style={{ backgroundColor: '#FF0000' }} className="rounded-md w-6 h-6" aria-label="main-red" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#FFA500' }} className="rounded-md w-6 h-6" aria-label="main-orange" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#FFFF00' }} className="rounded-md w-6 h-6" aria-label="main-yellow" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#00FF00' }} className="rounded-md w-6 h-6" aria-label="main-green" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#0000FF' }} className="rounded-md w-6 h-6" aria-label="main-blue" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#A020F0' }} className="rounded-md w-6 h-6" aria-label="main-purple" type="button" />
        </div>
        <div className="mb-2 grid grid-cols-6 gap-2">
          <button onClick={onClicks} style={{ backgroundColor: '#f8fafc' }} className="rounded-md w-6 h-6" aria-label="black" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#e2e8f0' }} className="rounded-md w-6 h-6" aria-label="black" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#cbd5e1' }} className="rounded-md w-6 h-6" aria-label="black" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#64748b' }} className="rounded-md w-6 h-6" aria-label="black" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#334155' }} className="rounded-md w-6 h-6" aria-label="black" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#0f172a' }} className="rounded-md w-6 h-6" aria-label="black" type="button" />
        </div>
        <div className="grid grid-rows-5 grid-flow-col gap-2">
          <button onClick={onClicks} style={{ backgroundColor: '#fca5a5' }} className="rounded-md w-6 h-6" aria-label="red" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#f87171' }} className="rounded-md w-6 h-6" aria-label="red" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#ef4444' }} className="rounded-md w-6 h-6" aria-label="red" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#dc2626' }} className="rounded-md w-6 h-6" aria-label="red" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#b91c1c' }} className="rounded-md w-6 h-6" aria-label="red" type="button" />

          <button onClick={onClicks} style={{ backgroundColor: '#fdba74' }} className="rounded-md w-6 h-6" aria-label="orange" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#fb923c' }} className="rounded-md w-6 h-6" aria-label="orange" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#f97316' }} className="rounded-md w-6 h-6" aria-label="orange" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#ea580c' }} className="rounded-md w-6 h-6" aria-label="orange" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#c2410c' }} className="rounded-md w-6 h-6" aria-label="orange" type="button" />

          <button onClick={onClicks} style={{ backgroundColor: '#fde047' }} className="rounded-md w-6 h-6" aria-label="yellow" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#facc15' }} className="rounded-md w-6 h-6" aria-label="yellow" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#eab308' }} className="rounded-md w-6 h-6" aria-label="yellow" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#ca8a04' }} className="rounded-md w-6 h-6" aria-label="yellow" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#a16207' }} className="rounded-md w-6 h-6" aria-label="yellow" type="button" />

          <button onClick={onClicks} style={{ backgroundColor: '#86efac' }} className="rounded-md w-6 h-6" aria-label="green" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#4ade80' }} className="rounded-md w-6 h-6" aria-label="green" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#22c55e' }} className="rounded-md w-6 h-6" aria-label="green" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#16a34a' }} className="rounded-md w-6 h-6" aria-label="green" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#15803d' }} className="rounded-md w-6 h-6" aria-label="green" type="button" />

          <button onClick={onClicks} style={{ backgroundColor: '#93c5fd' }} className="rounded-md w-6 h-6" aria-label="blue" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#60a5fa' }} className="rounded-md w-6 h-6" aria-label="blue" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#3b82f6' }} className="rounded-md w-6 h-6" aria-label="blue" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#2563eb' }} className="rounded-md w-6 h-6" aria-label="blue" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#1d4ed8' }} className="rounded-md w-6 h-6" aria-label="blue" type="button" />

          <button onClick={onClicks} style={{ backgroundColor: '#d8b4fe' }} className="rounded-md w-6 h-6" aria-label="purple" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#c084fc' }} className="rounded-md w-6 h-6" aria-label="purple" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#a855f7' }} className="rounded-md w-6 h-6" aria-label="purple" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#9333ea' }} className="rounded-md w-6 h-6" aria-label="purple" type="button" />
          <button onClick={onClicks} style={{ backgroundColor: '#7e22ce' }} className="rounded-md w-6 h-6" aria-label="purple" type="button" />

        </div>
      </div>
      )}
      <div className="flex">
        <p>Brush size:</p>
        <input onChange={(e) => setLineWidth(Number(e.target.value))} value={lineWidth} step={1} min={1} max={50} type="range" name="line-width" className="w-32 resize-none" />
      </div>
    </div>

  );
}

ColorPalette.propTypes = {
  onClicks: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  setLineWidth: PropTypes.func.isRequired,
};

export default ColorPalette;
