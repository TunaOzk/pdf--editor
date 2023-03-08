/* eslint-disable no-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric-with-erasing';

const svgRotateIcon = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>');
const rotateIcon = `data:image/svg+xml;utf8,${svgRotateIcon}`;
fabric.Object.prototype.controls.mtr.cursorStyle = `url(${rotateIcon}) 4 4, auto`;

function DrawArea({
  selectedColor, selectedShape, pageIndex, lineWidth, pageAttributes, fabricRef,
}) {
  const [prevIndex, setPrevIndex] = useState(pageIndex);
  if (prevIndex !== pageIndex) {
    setPrevIndex(pageIndex);
    fabricRef.current[prevIndex].lowerCanvasEl.className = 'absolute z-20 hidden lower-canvas';
    fabricRef.current[prevIndex].upperCanvasEl.className = 'absolute z-20 hidden upper-canvas';
    fabricRef.current[pageIndex].lowerCanvasEl.className = 'absolute z-20 lower-canvas';
    fabricRef.current[pageIndex].upperCanvasEl.className = 'absolute z-20 upper-canvas';
  }

  const getDrawCursor = () => {
    const color = selectedShape.name === 'eraser' ? '#FFFFFF' : selectedColor;
    const circle = `
		<svg height="${lineWidth}" fill="${color}" viewBox="0 0 ${lineWidth * 2} ${lineWidth * 2}" 
    width="${lineWidth}" 
    xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="50%"
				cy="50%"
				r="${lineWidth}" 
			/>
		</svg>
	`;
    return `data:image/svg+xml;base64,${window.btoa(circle)}`;
  };

  if (fabricRef.current[pageIndex]) {
    fabricRef.current[pageIndex].freeDrawingCursor = `url(${getDrawCursor()}) ${lineWidth / 2} ${lineWidth / 2}, crosshair`;
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].freeDrawingBrush.color = selectedColor;
    const objects = fabricRef.current[pageIndex].getActiveObjects();
    if (objects) {
      objects.forEach((obj) => {
        obj.set('stroke', selectedColor);
        obj.set('strokeWidth', lineWidth);
      });
      fabricRef.current[pageIndex].renderAll();
    }
  }

  const drawFreeHand = () => {
    fabricRef.current[pageIndex].freeDrawingBrush = new
    fabric.PencilBrush(fabricRef.current[pageIndex]);
    fabricRef.current[pageIndex].freeDrawingBrush.color = selectedColor;
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].isDrawingMode = true;
  };

  const drawCircle = () => {
    fabricRef.current[pageIndex].isDrawingMode = false;
    const center = fabricRef.current[pageIndex].getCenter();
    const circ = new fabric.Circle({
      top: center.top,
      left: center.left,
      radius: 50,
      fill: '',
      stroke: selectedColor,
      strokeWidth: lineWidth,
      erasable: true,
    });
    fabricRef.current[pageIndex].add(circ);
  };
  const drawRectangle = () => {
    fabricRef.current[pageIndex].isDrawingMode = false;
    const center = fabricRef.current[pageIndex].getCenter();
    const rect = new fabric.Rect({
      top: center.top,
      left: center.left,
      width: 50,
      height: 50,
      stroke: selectedColor,
      strokeWidth: lineWidth,
      fill: '',
      erasable: true,
    });
    fabricRef.current[pageIndex].add(rect);
  };

  const erase = () => {
    fabricRef.current[pageIndex].freeDrawingBrush = new
    fabric.EraserBrush(fabricRef.current[pageIndex]);
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].isDrawingMode = true;
  };

  const eraseObject = () => {
    const objects = fabricRef.current[pageIndex].getActiveObjects();
    objects.forEach((obj) => {
      fabricRef.current[pageIndex].remove(obj);
    });
    fabricRef.current[pageIndex].discardActiveObject().renderAll();
  };

  const drawShape = (shape) => {
    switch (shape.name) {
      case 'free':
        drawFreeHand();
        break;
      case 'eraser':
        erase();
        break;
      case 'eraser-object':
        eraseObject();
        break;
      case 'circle':
        drawCircle();
        break;
      case 'rectangle':
        drawRectangle();
        break;
      case 'select':
        fabricRef.current[pageIndex].isDrawingMode = false;
        break;
      default:
        return null;
    }
    return null;
  };

  useEffect(() => {
    drawShape(selectedShape);
  }, [selectedShape]);

  return (
    <div className="flex justify-center">
      { pageAttributes.numPages.map((val, index) => (
        <canvas
          key={`canvas${index + 1}`}
          ref={(ref) => {
            if (!fabricRef.current[index]) {
              fabricRef.current[index] = new fabric.Canvas(ref);
              fabricRef.current[index].moveCursor = 'grabbing';
              fabricRef.current[index].hoverCursor = 'grab';
              fabricRef.current[index].setDimensions({
                width: pageAttributes.canvasWidth,
                height: pageAttributes.canvasHeight,
              });
              if (index === pageAttributes.numPages.length - 1) {
                const canvasDivs = document.getElementsByClassName('canvas-container');
                Array.from(canvasDivs).forEach((canvas) => {
                  canvas.style.position = 'absolute';
                });
              } else if (index === 0) {
                fabricRef.current[pageIndex].lowerCanvasEl.className = 'absolute z-20 lower-canvas';
                fabricRef.current[pageIndex].upperCanvasEl.className = 'absolute z-20 upper-canvas';
              }
            }
          }}
          className="z-20 hidden"
        />
      ))}
    </div>
  );
}

DrawArea.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  selectedShape: PropTypes.shape({ name: PropTypes.string }).isRequired,
  pageIndex: PropTypes.number.isRequired,
  lineWidth: PropTypes.number.isRequired,
  pageAttributes: PropTypes.shape({
    numPages: PropTypes.arrayOf(PropTypes.number),
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
  }).isRequired,
  fabricRef: PropTypes.func.isRequired,
};

export default DrawArea;
