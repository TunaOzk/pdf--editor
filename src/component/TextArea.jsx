import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';

function TextArea({
  setTextAreaList, id, axisX, axisY, _width, _height, pageIndex,
}) {
  const [content, setContent] = useState('TEXT AREA');
  const [textArea, setTextArea] = useState({
    x: axisX, y: axisY, width: _width, height: _height, _content: content, ID: id,
  });

  useEffect(() => {
    setTextArea(() => {
      const newTextArea = {
        x: axisX, y: axisY, width: _width, height: _height, _content: content, ID: id,
      };
      // setTextAreaList((prev) => {
      //   const newArr = [...prev];
      //   newArr[pageIndex][id] = textArea;
      //   return newArr;
      // });
      return newTextArea;
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axisX, axisY, _width, _height, id, content]);

  const handleChange = (e) => {
    const { value } = e.target;
    setContent(value);
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
            _content: content,
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
        value={content}
        spellCheck={false}
        className="overflow-hidden resize-none h-full w-full bg-transparent outline-none focus:border-2 focus:border-dashed focus:border-violet-600"
      />
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
};
export default TextArea;
