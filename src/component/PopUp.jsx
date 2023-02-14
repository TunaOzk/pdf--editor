import React from 'react';
import PropTypes from 'prop-types';

function PopUp({ alert, onClose, errorMessages }) {
  if (alert) {
    return null;
  }
  return (
    <div className="flex fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm
        flex justify-center items-center"
    >
      <div className="flex flex-col bg-white w-1/2 h-1/3 p-2 rounded flex items-center justify-center">
        <p className="text-red-600 text-xl">{errorMessages}</p>
        <button type="button" className=" mt-8 border-2 rounded p-2 bg-gray-200 hover:bg-gray-300" onClick={onClose}>OK</button>

      </div>

    </div>
  );
}

PopUp.propTypes = {
  alert: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errorMessages: PropTypes.string.isRequired,
};

export default PopUp;
