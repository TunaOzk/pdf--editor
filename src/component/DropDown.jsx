import React, { useState } from 'react';
import PropTypes from 'prop-types';

function DropDown({
  menuItemContent, menuItemHeader, onToolbarVisiblity, onAction,
}) {
  const { label, img } = menuItemHeader;
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(label);
  return (
    <div
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setVisible(false)}
      className="relative ml-2 w-fit rounded-full"
    >
      <button
        title={label}
        onClick={() => setVisible((prev) => !prev)}
        className="group transition ease-in-out delay-100 px-4 my-1 py-2
        flex rounded-full items-center w-fit focus:bg-[#e4dff9]"
        type="button"
      >
        <img
          className="
          invert-[.25] sepia-[.5] saturate-[6.4] hue-rotate-[201deg] brightness-[.91] contrast-[.83]
        group-focus:invert-[.13] group-focus:sepia-[.52] group-focus:saturate-[32.99]
        group-focus:hue-rotate-[252deg] group-focus:brightness-[.83] group-focus:contrast-[1.28]"
          src={img}
          alt=""
        />
        <p className="ml-2 text-[#46464f] group-focus:text-[#1b1a2c]">{label}</p>
      </button>
      { visible && (
      <ul className="absolute w-full">
        {menuItemContent.map((val) => (
          <li key={val.id}>
            <button
              title={val.label}
              onClick={() => {
                if (onToolbarVisiblity) { onToolbarVisiblity(label); }
                setVisible(false);
                onAction(val.action);
                setSelected(val.label);
              }}
              className={`${selected === val.label ? 'bg-stone-300' : 'bg-[#e3e1ec]'} py-3 pl-2 min-w-full flex items-center hover:bg-stone-300`}
              type="button"
            >
              <img src={val.img} alt="" />
              <span className="ml-1 whitespace-nowrap text-m text-[#46464f]">

                {val.label.length > 22 ? `${val.label.slice(0, 22)}...` : val.label}

              </span>
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

DropDown.propTypes = {
  menuItemContent: PropTypes.arrayOf(PropTypes.shape(
    {
      id: PropTypes.number,
      img: PropTypes.string,
      label: PropTypes.string,
      action: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    },
  )).isRequired,
  menuItemHeader: PropTypes.shape({
    img: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  onToolbarVisiblity: PropTypes.func,
  onAction: PropTypes.func.isRequired,
};

DropDown.defaultProps = {
  onToolbarVisiblity: null,
};
export default DropDown;
