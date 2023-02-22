import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { pdfjs } from 'react-pdf';
import { useLocation } from 'react-router-dom';
import PdfPreviewArea from '../component/PdfPreviewArea';
import ShapePalette from '../component/ShapePalette';
import ColorPalette from '../component/ColorPalette';

function EditPdfPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)].map((value, index) => location.state[index].base64);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [pageIndex, setPageIndex] = useState(0);
  const [numPages, setNumPages] = useState([]);
  const overlayCanvasRef = useRef(null);
  const overlayContextRef = useRef(null);
  const actualCanvasRef = useRef([null]);
  const actualContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('rgb(0 0 0)');
  const [selectedShape, setSelectedShape] = useState('free');
  const startX = useRef(null);
  const startY = useRef(null);

  const prev = useRef(null);

  useEffect(() => {
    if (!overlayCanvasRef.current || !actualCanvasRef.current[pageIndex]) return;
    if (prev.current) { prev.current.className = 'absolute z-10 hidden'; }
    actualCanvasRef.current[pageIndex].className = 'absolute z-10 ';
    prev.current = actualCanvasRef.current[pageIndex];
  });

  useEffect(() => {
    if (!overlayCanvasRef.current || !actualCanvasRef.current[0]) return;
    actualCanvasRef.current.forEach((item, index, arr) => {
      const element = arr[index];
      element.width = canvasSize.width;
      element.height = canvasSize.height;
    });
    overlayCanvasRef.current.width = canvasSize.width;
    overlayCanvasRef.current.height = canvasSize.height;
  }, [canvasSize.height, canvasSize.width]);

  useEffect(() => {
    if (!overlayCanvasRef.current || !actualCanvasRef.current[pageIndex]) return;
    const canvas = overlayCanvasRef.current;
    const context = canvas.getContext('2d');

    overlayContextRef.current = context;
    context.lineCap = 'round';
    context.strokeStyle = selectedColor;
    context.lineWidth = 3;

    const canvas2 = actualCanvasRef.current[pageIndex];
    const context2 = canvas2.getContext('2d');
    actualContextRef.current = context2;
    context2.lineCap = 'round';
    context2.strokeStyle = selectedColor;
    context2.lineWidth = 3;
  }, [pageIndex, selectedColor, canvasSize]);
  const drawFreeHand = (x1, y1) => {
    actualContextRef.current.lineTo(x1, y1);
    actualContextRef.current.stroke();
  };
  const drawCircle = (ref, x1, y1, x2, y2) => {
    overlayContextRef.current
      .clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    ref.current.beginPath();
    const rad = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    ref.current.arc(x1, y1, rad, 0, 2 * Math.PI);
    // overlayContextRef.current.moveTo(startX.current, startY.current + (y - startY.current) / 2);
    // overlayContextRef.current.bezierCurveTo(
    //   startX.current,
    //   startY.current,
    //   x,
    //   startY.current,
    //   x,
    //   startY.current + (y - startY.current) / 2,
    // );
    // overlayContextRef.current.bezierCurveTo(
    //   x,
    //   y,
    //   startX.current,
    //   y,
    //   startX.current,
    //   startY.current + (y - startY.current) / 2,
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
        return drawFreeHand(x1, y1);
      case 'circle':
        return drawCircle(ref, x2, y2, x1, y1);
      case 'rectangle':
        return drawRectangle(ref, x2, y2, x1, y1);
      default:
        return drawFreeHand(ref, x1, y1);
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    actualContextRef.current.restore();
    const { offsetX, offsetY } = nativeEvent;
    startX.current = offsetX;
    startY.current = offsetY;
    actualContextRef.current.beginPath();
    actualContextRef.current.moveTo(startX.current, startY.current);
    setIsDrawing(true);
  };

  const finishDrawing = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    const { offsetX, offsetY } = nativeEvent;
    actualContextRef.current.closePath();

    setIsDrawing(false);
    if (selectedShape !== 'free') {
      drawShape(actualContextRef, selectedShape, offsetX, offsetY, startX.current, startY.current);
    }
  };

  const draw = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    drawShape(overlayContextRef, selectedShape, offsetX, offsetY, startX.current, startY.current);
  };

  const handleClickColor = (e) => {
    const { backgroundColor } = e.target.style;
    setSelectedColor(backgroundColor);
  };

  const handleClickShape = (e) => {
    setSelectedShape(e.target.name);
  };
  const handleLoadSucces = (pdf) => {
    setNumPages(Array.from(Array(pdf.numPages).keys()));
    // [...Array(pdf.numPages)].map((val, index) => (index !== 0
    //   ? actualCanvasRef.current.push(null) : actualCanvasRef.current[index]));

    pdf.getPage(1).then((page) => {
      const viewPort = page.getViewport({ scale: 1 });

      // setCanvasArray([...Array(pdf.numPages)].map((val, index) => (
      //   <canvas
      //     key={`canvas${index + 1}`}
      //       // eslint-disable-next-line no-return-assign
      //     ref={(ref) => biktim.current[0] = ref}
      //     className="absolute z-10"
      //     style={{ width: viewPort.width, height: viewPort.height }}
      //   />
      // )));
      setCanvasSize({ width: viewPort.width, height: viewPort.height });
    });
  };

  const memo = useMemo(() => {
    console.log('here', pageIndex);
    return (numPages.filter(
      (val, index) => index === pageIndex,
    ).map((val, index) => (
      <canvas
        key={`canvas${index + 1}`}
      // eslint-disable-next-line no-return-assign
        ref={(ref) => actualCanvasRef.current[index] = ref}
        className="absolute z-10"
        style={{ width: canvasSize.width, height: index + 100 }}
      />
    )));
  }, [canvasSize.width, numPages, pageIndex]);
  return (
    <div className="h-screen w-screen flex">
      <div className="flex flex-col w-1/6 border-4 border-violet-400 overflow-y-auto">
        <div className="h-1/3">
          <h1>Colors</h1>
          <ColorPalette onClick={handleClickColor} />
        </div>
        <div className="h-1/3">
          <h1>Shapes</h1>
          <ShapePalette onClick={handleClickShape} />
        </div>
        <div className="h-1/3">
          <h1>Text</h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-5/6">
        <canvas
          ref={overlayCanvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={() => { setIsDrawing(false); }}
          className="absolute z-20"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        />
        { numPages.map((val, index) => (
          <canvas
            key={`canvas${index + 1}`}
            // eslint-disable-next-line no-return-assign
            ref={(ref) => actualCanvasRef.current[index] = ref}
            className="absolute z-10 hidden"
            style={{ width: canvasSize.width, height: canvasSize.height }}
          />
        ))}
        {/* {memo} */}
        {/* <canvas
          ref={(ref) => {
            if (!actualCanvasRef.current[pageIndex]) {
              actualCanvasRef.current[pageIndex] = ref;
            }
            return actualCanvasRef.current[pageIndex];
          }}
          className="absolute z-10"
          style={{ width: canvasSize.width, height: canvasSize.height }}
        /> */}
        <PdfPreviewArea
          onLoadSuccessForEditPage={handleLoadSucces}
          file={fileList[0]}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          currentPdfPages={numPages}
          setCanvasSize={setCanvasSize}
          width={null}
        />

      </div>

    </div>
  );
}

export default EditPdfPage;
