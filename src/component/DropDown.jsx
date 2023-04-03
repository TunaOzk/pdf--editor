import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MenuItem({
  menuItemContent, menuItemHeader, onToolbarVisiblity, onAction,
}) {
  const { label, img } = menuItemHeader;
  const [visible, setVisible] = useState(false);
  return (
    <div onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setVisible(false)} className="relative">
      <button
        onClick={() => setVisible((prev) => !prev)}
        className="flex items-center w-fit hover:bg-stone-400"
        type="button"
      >
        <img src={img} alt="" />
        <p className="ml-2 mr-4">{label}</p>
      </button>
      { visible && (
      <ul className="absolute w-full">
        {menuItemContent.map((val) => (
          <li key={val.id}>
            <button
              onClick={() => {
                onToolbarVisiblity(label);
                setVisible(false);
                onAction(val.action);
              }}
              className="bg-stone-200 w-full flex items-center hover:bg-stone-300"
              type="button"
            >
              <img src={val.img} alt="" />
              <p className="text-xs">{val.label}</p>
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

MenuItem.propTypes = {
  menuItemContent: PropTypes.arrayOf(PropTypes.shape(
    { id: PropTypes.number, img: PropTypes.string, label: PropTypes.string },
  )).isRequired,
  menuItemHeader: PropTypes.shape({
    img: PropTypes.string,
    label:
    PropTypes.string,
    action: PropTypes.string,
  }).isRequired,
  onToolbarVisiblity: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};
export default MenuItem;
