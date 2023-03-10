import React, { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';
import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
import { ReactComponent as TextFontIcon } from '../assets/text_font.svg';
import { ReactComponent as TextIncrease } from '../assets/text_increase.svg';
import { ReactComponent as TextDecrease } from '../assets/text_decrease.svg';

function TextArea({
  setTextAreaList, id, axisX, axisY, _width, _height, pageIndex, _content, _type, _font, _fontSize,
}) {
  const fonts = ['Arial', 'Brush Script MT', 'Courier New', 'Comic Sans MS', 'Garamond', 'Georgia',
    'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Verdana'];
  const [visible, setVisible] = useState(false);
  const selectRef = useRef(null);
  const [textArea, setTextArea] = useState({
    x: axisX,
    y: axisY,
    width: _width,
    height: _height,
    content: _content,
    ID: id,
    type: _type,
    font: _font,
    fontSize: _fontSize,
  });
  useEffect(() => {
    setTextAreaList((prevList) => {
      const newArr = [...prevList];
      newArr[pageIndex] = [...(prevList[pageIndex]
        .filter((val, index) => val.ID !== textArea.ID)), textArea];
      return newArr;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textArea]);

  const handleChange = (e) => {
    const { value } = e.target;
    setTextArea((prev) => ({
      ...prev, content: value,
    }));
  };
  const handleDeleteClick = () => {
    setTextAreaList((prev) => {
      const newArr = [...prev];
      const temp = newArr[pageIndex].filter((val, index) => val.ID !== textArea.ID);
      newArr[pageIndex] = temp;
      return newArr;
    });
  };
  const handleFontChange = (e) => {
    selectRef.current.blur();
    setTextArea((prev) => ({
      ...prev, font: e.target.value,
    }));
  };
  return (
    <Rnd
      className="absolute z-20"
      bounds="parent"
      onResizeStart={(e, direction, ref) => {
        const rndRef = ref;
        rndRef.className = 'absolute z-20 border-2 border-dashed border-violet-600';
      }}
      position={{ x: textArea.x, y: textArea.y }}
      size={{ width: textArea.width, height: textArea.height }}
      onDragStop={(e, d) => {
        if (textArea.x === d.x && textArea.y === d.y) return;
        setTextArea((prev) => ({
          ...prev, x: d.x, y: d.y, ID: id,
        }));
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (textArea.width === ref.style.width && textArea.height === ref.style.height) return;
        setTextArea((prev) => ({
          width: ref.style.width,
          height: ref.style.height,
          content: _content,
          x: position.x,
          y: position.y,
          ID: id,
          type: _type,
          font: _font,
          fontSize: _fontSize,
        }));
        setTimeout(() => {
          const rndRef = ref;
          rndRef.className = 'absolute z-20';
        }, 1000);
      }}
    >
      <textarea
        onChange={handleChange}
        value={textArea.content}
        spellCheck={false}
        style={{ fontSize: textArea.fontSize, fontFamily: textArea.font }}
        className={`overflow-hidden resize-none h-full w-full bg-transparent outline-none 
        focus:border-2 focus:border-dashed focus:border-violet-600`}
      />
      <div className="flex">
        <div className="relative">
          <TextFontIcon
            title="Text Settings"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute hover:cursor-pointer hover:bg-red-600 border-2 border-black"
          />
          { visible && (
          <div className="flex justify-between absolute right-0 w-60 h-fit bg-transparent border-2 border-violet-400">
            <select ref={selectRef} value={textArea.font} onChange={handleFontChange} name="font-select" id="font">
              {fonts.map((val) => (<option key={`font_${val}`} value={val}>{val}</option>))}
            </select>
            <div className="w-fit grid grid-cols-2 gap-4">
              <TextIncrease
                title="Increase Font Size"
                className="hover:cursor-pointer"
                onClick={() => {
                  setTextArea((prev) => ({ ...prev, fontSize: prev.fontSize + 5 }));
                }}
              />
              <TextDecrease
                title="Decrease Font Size"
                className="hover:cursor-pointer"
                onClick={() => {
                  setTextArea((prev) => ({ ...prev, fontSize: prev.fontSize - 5 }));
                }}
              />
            </div>
            <div />
          </div>
          )}
        </div>
        <DeleteIcon title="Remove" onClick={handleDeleteClick} className="absolute left-7 hover:cursor-pointer hover:bg-red-600 border-2 border-black" />
      </div>

    </Rnd>
  );
}
TextArea.propTypes = {
  setTextAreaList: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  axisX: PropTypes.number.isRequired,
  axisY: PropTypes.number.isRequired,
  _width: PropTypes.string.isRequired,
  _height: PropTypes.string.isRequired,
  pageIndex: PropTypes.number.isRequired,
  _content: PropTypes.string.isRequired,
  _type: PropTypes.string.isRequired,
  _font: PropTypes.string.isRequired,
  _fontSize: PropTypes.number.isRequired,
};
export default TextArea;
