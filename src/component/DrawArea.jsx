/* eslint-disable no-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric-with-erasing';
import { ROTATE_CURSOR, getDrawCursor } from '../constants/cursors';

fabric.Object.prototype.controls.mtr.cursorStyle = `url(${ROTATE_CURSOR}) 4 4, auto`;

function DrawArea({
  selectedColor, setSelectedColor, selectedShape,
  pageIndex, lineWidth, setLineWidth, pageAttributes, fabricRef, onToolbarVisiblity,
}) {
  const [canvasList, setCanvasList] = useState([0]);

  const [prevIndex, setPrevIndex] = useState(pageIndex);
  if (prevIndex !== pageIndex) {
    setPrevIndex(pageIndex);
    setCanvasList((prev) => (prev.includes(pageIndex) ? prev : [...prev, pageIndex]));
    fabricRef.current[prevIndex].discardActiveObject().renderAll();
    fabricRef.current[prevIndex].lowerCanvasEl.className = 'absolute z-20 hidden lower-canvas';
    fabricRef.current[prevIndex].upperCanvasEl.className = 'absolute z-20 hidden upper-canvas';
    if (fabricRef.current[pageIndex]) {
      fabricRef.current[pageIndex].lowerCanvasEl.className = 'absolute z-20 lower-canvas';
      fabricRef.current[pageIndex].upperCanvasEl.className = 'absolute z-20 upper-canvas';
    }
  }

  const [prevSelectedColor, setPrevSelectedColor] = useState(selectedColor);
  if (fabricRef.current[pageIndex] && prevSelectedColor !== selectedColor) {
    setPrevSelectedColor(selectedColor);
    fabricRef.current[pageIndex].freeDrawingBrush.color = selectedColor;
    fabricRef.current[pageIndex].freeDrawingCursor = `url(${getDrawCursor(selectedShape, selectedColor, lineWidth)}) ${lineWidth / 2} ${lineWidth / 2}, crosshair`;
    const objects = fabricRef.current[pageIndex].getActiveObjects();
    if (objects) {
      objects.forEach((obj) => {
        if (obj.get('type') !== 'i-text') { obj.set('stroke', selectedColor); } else { obj.set('fill', selectedColor); }
      });
      fabricRef.current[pageIndex].renderAll();
    }
  }

  const [prevLineWidth, setPrevLineWidth] = useState(null);
  if (fabricRef.current[pageIndex] && prevLineWidth !== lineWidth) {
    setPrevLineWidth(lineWidth);
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].freeDrawingCursor = `url(${getDrawCursor(selectedShape, selectedColor, lineWidth)}) ${lineWidth / 2} ${lineWidth / 2}, crosshair`;
    const objects = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') !== 'i-text');
    if (objects) {
      objects.forEach((obj) => { obj.set('strokeWidth', lineWidth); });
      fabricRef.current[pageIndex].renderAll();
    }
  }

  const drawFreeHand = () => {
    fabricRef.current[pageIndex].freeDrawingBrush = new
    fabric.PencilBrush(fabricRef.current[pageIndex]);
    fabricRef.current[pageIndex].freeDrawingBrush.color = selectedColor;
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].freeDrawingCursor = `url(${getDrawCursor(selectedShape, selectedColor, lineWidth)}) ${lineWidth / 2} ${lineWidth / 2}, crosshair`;
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
      stroke: 'rgb(0, 0, 0)',
      strokeWidth: lineWidth,
      erasable: false,
      strokeUniform: true,
    });
    circ.on('selected', () => {
      onToolbarVisiblity('Shapes');
      if (fabricRef.current[pageIndex].getActiveObjects().length > 1) { return; }
      setLineWidth(circ.get('strokeWidth'));
      setSelectedColor(circ.get('stroke'));
    });
    fabricRef.current[pageIndex].add(circ);
    fabricRef.current[pageIndex].setActiveObject(circ);
  };
  const drawRectangle = () => {
    fabricRef.current[pageIndex].isDrawingMode = false;
    const center = fabricRef.current[pageIndex].getCenter();
    const rect = new fabric.Rect({
      top: center.top,
      left: center.left,
      width: 100,
      height: 50,
      stroke: 'rgb(0, 0, 0)',
      strokeWidth: lineWidth,
      fill: '',
      strokeUniform: true,
      erasable: false,
    });
    rect.on('selected', () => {
      onToolbarVisiblity('Shapes');
      if (fabricRef.current[pageIndex].getActiveObjects().length > 1) { return; }
      setLineWidth(rect.get('strokeWidth'));
      setSelectedColor(rect.get('stroke'));
    });
    fabricRef.current[pageIndex].add(rect);
    fabricRef.current[pageIndex].setActiveObject(rect);
  };

  const erase = () => {
    onToolbarVisiblity('Shapes');
    fabricRef.current[pageIndex].freeDrawingBrush = new
    fabric.EraserBrush(fabricRef.current[pageIndex]);
    fabricRef.current[pageIndex].freeDrawingBrush.width = lineWidth;
    fabricRef.current[pageIndex].freeDrawingCursor = `url(${getDrawCursor(selectedShape, selectedColor, lineWidth)}) ${lineWidth / 2} ${lineWidth / 2}, crosshair`;
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
        fabricRef.current[pageIndex].discardActiveObject().renderAll();
        drawFreeHand();
        break;
      case 'eraser':
        fabricRef.current[prevIndex].discardActiveObject().renderAll();
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
        fabricRef.current[pageIndex].discardActiveObject().renderAll();
        break;
      default:
        if (fabricRef.current[pageIndex]) {
          fabricRef.current[pageIndex].isDrawingMode = false;
          fabricRef.current[pageIndex].discardActiveObject().renderAll();
        }
        break;
    }
  };

  useEffect(() => {
    drawShape(selectedShape);
  }, [selectedShape]);

  return (
    <div className="flex justify-center relative">
      { canvasList.map((val, index) => (
        <canvas
          key={`canvas${index + 1}`}
          ref={(ref) => {
            if (!fabricRef.current[val]
              && (pageAttributes.actualCanvasWidth[val]
                && pageAttributes.actualCanvasHeight[val])) {
              fabricRef.current[val] = new fabric.Canvas(ref);
              fabricRef.current[val].moveCursor = 'grabbing';
              fabricRef.current[val].hoverCursor = 'grab';
              fabricRef.current[val].selectionKey = null;
              fabricRef.current[val].on('selection:cleared', () => { onToolbarVisiblity(''); });
              fabricRef.current[val].on('selection:created', (e) => {
                const { type } = fabricRef.current[val].getActiveObject();
                if (type === 'activeSelection') {
                  const objects = fabricRef.current[val].getActiveObjects();
                  if (objects.every((obj) => obj.get('type') === 'i-text')) {
                    fabricRef.current[val].discardActiveObject();
                    const newSelection = new fabric.ActiveSelection(
                      objects,
                      { canvas: fabricRef.current[val], hasControls: false },
                    );
                    // eslint-disable-next-line no-underscore-dangle
                    fabricRef.current[val]._setActiveObject(newSelection);
                    onToolbarVisiblity('Text');
                    fabricRef.current[val].requestRenderAll();
                  } else if (objects.every((obj) => obj.get('type') !== 'i-text')) {
                    fabricRef.current[val].requestRenderAll();
                  } else {
                    fabricRef.current[val].discardActiveObject();
                  }
                }
              });
              fabricRef.current[val].on('path:created', (e) => {
                e.path.on('selected', () => {
                  onToolbarVisiblity('Shapes');
                  if (fabricRef.current[pageIndex].getActiveObjects().length > 1) { return; }
                  setLineWidth(e.path.get('strokeWidth'));
                  setSelectedColor(e.path.get('stroke'));
                });
              });
              fabricRef.current[val].setDimensions({
                width: pageAttributes.actualCanvasWidth[val],
                height: pageAttributes.actualCanvasHeight[val],
              });
              if (index === canvasList.length - 1) {
                const canvasDivs = document.getElementsByClassName('canvas-container');
                Array.from(canvasDivs).forEach((canvas) => {
                  canvas.style.position = 'absolute';
                });
              }
            }
          }}
          className="z-20"
        />
      ))}
    </div>
  );
}

DrawArea.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  setSelectedColor: PropTypes.func.isRequired,
  selectedShape: PropTypes.shape({ name: PropTypes.string }).isRequired,
  pageIndex: PropTypes.number.isRequired,
  lineWidth: PropTypes.number.isRequired,
  setLineWidth: PropTypes.func.isRequired,
  pageAttributes: PropTypes.shape({
    numPages: PropTypes.arrayOf(PropTypes.number),
    actualCanvasHeight: PropTypes.number,
    actualCanvasWidth: PropTypes.number,
  }).isRequired,
  fabricRef: PropTypes.func.isRequired,
  onToolbarVisiblity: PropTypes.func.isRequired,
};

export default DrawArea;
