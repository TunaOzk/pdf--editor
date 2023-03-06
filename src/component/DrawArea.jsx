/* eslint-disable no-param-reassign */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function DrawArea({
  selectedColor, selectedShape, pageIndex, lineWidth, pageAttributes, actualCanvasRef,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const overlayCanvasRef = useRef(null);
  const actualContextRef = useRef(null);
  const overlayContextRef = useRef(null);
  const prev = useRef(null);
  const startingCoordinates = useRef([null, null]);
  useEffect(() => {
    if (!overlayCanvasRef.current || !actualCanvasRef.current[pageIndex]) return;
    if (prev.current) { prev.current.className = 'absolute z-10 hidden'; }
    actualCanvasRef.current[pageIndex].className = 'absolute z-10';
    prev.current = actualCanvasRef.current[pageIndex];
  }, [pageIndex, pageAttributes, actualCanvasRef]);

  useEffect(() => {
    if (!overlayCanvasRef.current || !actualCanvasRef.current[0]) return;
    actualCanvasRef.current.forEach((item, index, arr) => {
      const element = arr[index];
      element.width = pageAttributes.canvasWidth;
      element.height = pageAttributes.canvasHeight;
    });
    overlayCanvasRef.current.width = pageAttributes.canvasWidth;
    overlayCanvasRef.current.height = pageAttributes.canvasHeight;
  }, [actualCanvasRef, pageAttributes]);

  useEffect(() => {
    if (!overlayCanvasRef.current || !actualCanvasRef.current[pageIndex]) return;
    const canvas = overlayCanvasRef.current;
    const context = canvas.getContext('2d');

    overlayContextRef.current = context;
    context.lineCap = 'round';
    context.strokeStyle = selectedColor;
    context.lineWidth = lineWidth;

    const canvas2 = actualCanvasRef.current[pageIndex];
    const context2 = canvas2.getContext('2d');
    actualContextRef.current = context2;
    context2.lineCap = 'round';
    context2.strokeStyle = selectedColor;
    context2.lineWidth = lineWidth;
  }, [pageIndex, selectedColor, lineWidth, pageAttributes, actualCanvasRef]);

  const drawFreeHand = (x1, y1, shape) => {
    actualContextRef.current.lineTo(x1, y1);
    actualContextRef.current.stroke();
  };
  const drawCircle = (ref, x1, y1, x2, y2) => {
    overlayContextRef.current
      .clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    ref.current.beginPath();
    const rad = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    ref.current.arc(x1, y1, rad, 0, 2 * Math.PI);
    // overlayContextRef.current.moveTo(startingCoordinates.current[0],
    // startingCoordinates.current[1] + (y - startingCoordinates.current[1]) / 2);
    // overlayContextRef.current.bezierCurveTo(
    //   startingCoordinates.current[0],
    //   startingCoordinates.current[1],
    //   x,
    //   startingCoordinates.current[1],
    //   x,
    //   startingCoordinates.current[1] + (y - startingCoordinates.current[1]) / 2,
    // );
    // overlayContextRef.current.bezierCurveTo(
    //   x,
    //   y,
    //   startingCoordinates.current[0],
    //   y,
    //   startingCoordinates.current[0],
    //   startingCoordinates.current[1] + (y - startingCoordinates.current[1]) / 2,
    // );
    ref.current.closePath();
    ref.current.stroke();
  };

  const drawRectangle = (ref, x1, y1, x2, y2) => {
    const w = x1 - x2;
    const h = y1 - y2;
    overlayContextRef.current
      .clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    ref.current.strokeRect(
      x2,
      y2,
      w,
      h,
    );
  };

  const drawShape = (ref, shape, x1, y1, x2, y2) => {
    switch (shape) {
      case 'free':
        actualContextRef.current.globalCompositeOperation = 'source-over';
        return drawFreeHand(x1, y1, shape);
      case 'eraser':
        actualContextRef.current.globalCompositeOperation = 'destination-out';
        return drawFreeHand(x1, y1, shape);
      case 'circle':
        actualContextRef.current.globalCompositeOperation = 'source-over';
        return drawCircle(ref, x2, y2, x1, y1);
      case 'rectangle':
        actualContextRef.current.globalCompositeOperation = 'source-over';
        return drawRectangle(ref, x2, y2, x1, y1);
      default:
        return null;
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    overlayCanvasRef.current.className = 'z-30';
    setIsDrawing(true);
    const { offsetX, offsetY } = nativeEvent;
    startingCoordinates.current[0] = offsetX;
    startingCoordinates.current[1] = offsetY;
    actualContextRef.current.beginPath();
    actualContextRef.current.moveTo(startingCoordinates.current[0], startingCoordinates.current[1]);
  };

  const finishDrawing = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    overlayCanvasRef.current.className = 'z-20';
    const { offsetX, offsetY } = nativeEvent;
    actualContextRef.current.closePath();
    setIsDrawing(false);
    if (selectedShape !== 'free') {
      drawShape(
        actualContextRef,
        selectedShape,
        offsetX,
        offsetY,
        startingCoordinates.current[0],
        startingCoordinates.current[1],
      );
    }
  };

  const draw = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    drawShape(
      overlayContextRef,
      selectedShape,
      offsetX,
      offsetY,
      startingCoordinates.current[0],
      startingCoordinates.current[1],
    );
  };

  return (
    <div className="absolute flex justify-center">
      <canvas
        ref={overlayCanvasRef}
        onMouseDown={selectedShape && startDrawing}
        onMouseUp={selectedShape && finishDrawing}
        onMouseMove={selectedShape && draw}
        onMouseLeave={() => { setIsDrawing(false); }}
        className="z-20"
        style={{ width: pageAttributes.canvasWidth, height: pageAttributes.canvasHeight }}
      />
      { pageAttributes.numPages.map((val, index) => (
        <canvas
          key={`canvas${index + 1}`}
          ref={(ref) => {
            actualCanvasRef.current[index] = ref;
          }}
          className="absolute z-10 hidden"
          style={{ width: pageAttributes.canvasWidth, height: pageAttributes.canvasHeight }}
        />
      ))}
    </div>
  );
}

DrawArea.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  selectedShape: PropTypes.string.isRequired,
  pageIndex: PropTypes.number.isRequired,
  lineWidth: PropTypes.number.isRequired,
  pageAttributes: PropTypes.shape({
    numPages: PropTypes.arrayOf(PropTypes.number),
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
  }).isRequired,
  actualCanvasRef: PropTypes.shape({
    current:
    PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default DrawArea;
