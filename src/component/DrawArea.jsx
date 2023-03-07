/* eslint-disable no-param-reassign */
import React, {
  useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric-with-erasing';

function DrawArea({
  selectedColor, selectedShape, pageIndex, lineWidth, pageAttributes, fabricRef,
}) {
  const prev = useRef(null);
  useEffect(() => {
    if (!fabricRef.current[pageIndex]) return;
    if (prev.current) {
      prev.current.lowerCanvasEl.className = 'absolute z-20 hidden lower-canvas';
      prev.current.upperCanvasEl.className = 'absolute z-20 hidden upper-canvas';
    }
    fabricRef.current[pageIndex].lowerCanvasEl.className = 'absolute z-20 lower-canvas';
    fabricRef.current[pageIndex].upperCanvasEl.className = 'absolute z-20 upper-canvas';

    const canvasDivs = document.getElementsByClassName('canvas-container');
    // eslint-disable-next-line array-callback-return
    Array.from(canvasDivs).map((item) => { item.style.position = 'absolute'; });
    prev.current = fabricRef.current[pageIndex];
  }, [pageIndex, pageAttributes, fabricRef]);

  useEffect(() => {
    if (!fabricRef.current[0]) return;
    fabricRef.current.forEach((item, index, arr) => {
      const element = arr[index];

      element.setDimensions({
        width: pageAttributes.canvasWidth,
        height: pageAttributes.canvasHeight,
      });
    });
  }, [fabricRef, pageAttributes]);

  useEffect(() => {
    if (!fabricRef.current[pageIndex]) return;
    fabricRef.current[pageIndex].freeDrawingBrush.color = selectedColor;
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
  }, [pageIndex, selectedColor, lineWidth, fabricRef]);

  const drawFreeHand = () => {
    fabricRef.current[pageIndex].freeDrawingBrush = new
    fabric.PencilBrush(fabricRef.current[pageIndex]);
    fabricRef.current[pageIndex].freeDrawingBrush.color = selectedColor;
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].isDrawingMode = true;
  };

  const drawCircle = () => {
    fabricRef.current[pageIndex].isDrawingMode = false;
    const circ = new fabric.Circle({
      top: 50,
      left: 50,
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
    const rect = new fabric.Rect({
      top: 50,
      left: 50,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShape]);

  return (
    <div className="flex justify-center">
      { pageAttributes.numPages.map((val, index) => (
        <canvas
          key={`canvas${index + 1}`}
          ref={(ref) => {
            if (!fabricRef.current[index]) { fabricRef.current[index] = new fabric.Canvas(ref); }
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
