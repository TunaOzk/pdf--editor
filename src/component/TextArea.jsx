import React, { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';
import { ReactComponent as DeleteIcon } from '../assets/delete.svg';

function TextArea({
  setTextAreaList, id, axisX, axisY, _width, _height, pageIndex, _content,
}) {
  const [textArea, setTextArea] = useState({
    x: axisX, y: axisY, width: _width, height: _height, content: _content, ID: id,
  });
  useEffect(() => {
    setTextArea({
      x: axisX, y: axisY, width: _width, height: _height, content: _content, ID: id,
    });
  }, [axisX, axisY, _width, _height, id, _content]);

  const handleChange = (e) => {
    const { value } = e.target;
    setTextArea((prev) => {
      const newTextArea = {
        ...prev, content: value,
      };
      setTextAreaList((prevList) => {
        const newArr = [...prevList];
        newArr[pageIndex][id] = newTextArea;
        return newArr;
      });
      return newTextArea;
    });
  };
  const handleDeleteClick = () => {
    setTextAreaList((prev) => {
      const newArr = [...prev];
      const temp = newArr[pageIndex].filter((val, index) => val.ID !== id);
      newArr[pageIndex] = temp.map((val, index) => (val.ID > id
        ? { ...val, ID: val.ID - 1 } : val));
      return newArr;
    });
  };
  return (
    <Rnd
      minHeight={20}
      minWidth={20}
      className="absolute z-30"
      onResizeStart={(e, direction, ref) => {
        const rndRef = ref;
        rndRef.className = 'absolute z-30 border-2 border-dashed border-violet-600';
      }}
      position={{ x: textArea.x, y: textArea.y }}
      size={{ width: textArea.width, height: textArea.height }}
      onDragStop={(e, d) => {
        if (textArea.x === d.x && textArea.y === d.y) return;
        setTextArea((prev) => {
          const newTextArea = {
            ...prev, x: d.x, y: d.y, ID: id,
          };
          setTextAreaList((prevList) => {
            const newArr = [...prevList];
            newArr[pageIndex][id] = newTextArea;
            return newArr;
          });
          return newTextArea;
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (textArea.width === ref.style.width && textArea.height === ref.style.height) return;
        setTextArea(() => {
          const newTextArea = {
            width: ref.style.width,
            height: ref.style.height,
            content: _content,
            x: position.x,
            y: position.y,
            ID: id,
          };

          setTextAreaList((prevList) => {
            const newArr = [...prevList];
            newArr[pageIndex][id] = newTextArea;
            return newArr;
          });
          return newTextArea;
        });
      }}
    >
      <textarea
        onChange={handleChange}
        value={textArea.content}
        spellCheck={false}
        className="overflow-hidden resize-none h-full w-full bg-transparent outline-none
        focus:border-2 focus:border-dashed focus:border-violet-600"
      />
      <DeleteIcon onClick={handleDeleteClick} className="hover:cursor-pointer hover:bg-red-600 border-2 border-black" />

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
};
export default TextArea;
