import React, {
  useEffect, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfPreviewArea from '../component/PdfPreviewArea';
import ShapePalette from '../component/ShapePalette';
import ColorPalette from '../component/ColorPalette';
import TextArea from '../component/TextArea';
import TextAreaPalette from '../component/TextAreaPalette';

function EditPdfPage() {
  const location = useLocation();
  const numOfFiles = location.state.length;
  const fileList = [...Array(numOfFiles)].map((value, index) => location.state[index].base64);
  const fileNames = [...Array(numOfFiles)].map((value, index) => location.state[index].name);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [pageIndex, setPageIndex] = useState(0);
  const [numPages, setNumPages] = useState([]);
  const overlayCanvasRef = useRef(null);
  const overlayContextRef = useRef(null);
  const actualCanvasRef = useRef([null]);
  const actualContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedShape, setSelectedShape] = useState('free');
  const [lineWidth, setLineWidth] = useState(1);
  const startX = useRef(null);
  const startY = useRef(null);
  const prev = useRef(null);
  const [textAreaList, setTextAreaList] = useState([[]]);
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
    context.lineWidth = lineWidth;

    const canvas2 = actualCanvasRef.current[pageIndex];
    const context2 = canvas2.getContext('2d');
    actualContextRef.current = context2;
    context2.lineCap = 'round';
    context2.strokeStyle = selectedColor;
    context2.lineWidth = lineWidth;
  }, [pageIndex, selectedColor, canvasSize, lineWidth]);
  const drawFreeHand = (x1, y1) => {
    actualContextRef.current.lineTo(x1, y1);
    actualContextRef.current.stroke();
  };
  const postEditContent = async () => {
    const base64Canvas = actualCanvasRef.current.map((item) => item.toDataURL(''));
    const file = fileList[0];
    const fileName = fileNames[0];
    try {
      await axios.post('http://localhost:4000/pdfEdit', {
        textAreaList,
        file,
        base64Canvas,
      })
        .then((res) => {
          const a = document.createElement('a');
          a.href = res.data;
          a.download = fileName;
          a.click();
          a.remove();
        });
    } catch (error) {
      throw new Error(error);
    }
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
      case 'eraser':
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
    overlayCanvasRef.current.className = 'absolute z-30';
    setIsDrawing(true);
    const { offsetX, offsetY } = nativeEvent;
    startX.current = offsetX;
    startY.current = offsetY;
    actualContextRef.current.beginPath();
    actualContextRef.current.moveTo(startX.current, startY.current);
  };

  const finishDrawing = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    overlayCanvasRef.current.className = 'absolute z-20';
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
    setSelectedShape(e.currentTarget.name);
  };
  const handleLoadSucces = (pdf) => {
    setNumPages(Array.from(Array(pdf.numPages).keys()));
    setTextAreaList([...Array(pdf.numPages)].map((val, index) => []));
    pdf.getPage(1).then((page) => {
      const viewPort = page.getViewport({ scale: 1 });
      setCanvasSize({ width: viewPort.width, height: viewPort.height });
    });
  };

  const handleTextAreaAdd = (_type) => {
    setTextAreaList((prevArr) => {
      const newArr = [...prevArr];
      const temp = [...newArr[pageIndex], {
        x: 0,
        y: 0,
        width: '50px',
        height: '50px',
        content: 'TEXT AREA',
        ID: newArr[pageIndex].length,
        type: _type,
        font: 'Courier',
        fontSize: 16,
      }];
      newArr[pageIndex] = temp;
      return newArr;
    });
  };
  return (
    <div className="h-screen w-screen flex flex-col bg-stone-200">

      <div className="flex grid grid-cols-3 divide-x-4 divide-violet-400 h-min w-full border-4 border-violet-400">
        <div className="">
          <ColorPalette
            onClicks={handleClickColor}
            selectedColor={selectedColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
          />
        </div>
        <div className="">
          <ShapePalette onClicks={handleClickShape} eraserRef={actualContextRef} />
        </div>
        <div className="h-full flex">
          <TextAreaPalette
            onTextAreaAdd={handleTextAreaAdd}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-5/6 w-full">
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
        <div>
          <PdfPreviewArea
            onLoadSuccessForEditPage={handleLoadSucces}
            file={fileList[0]}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            currentPdfPages={numPages}
            setCanvasSize={setCanvasSize}
            width={null}
          />
          {textAreaList[pageIndex].map((val, index) => (
            <TextArea
              id={index}
              axisX={val.x}
              axisY={val.y}
              _width={val.width}
              _height={val.height}
              _content={val.content}
              _type={val.type}
              _font={val.font}
              _fontSize={val.fontSize}
              setTextAreaList={setTextAreaList}
              pageIndex={pageIndex}
              key={`txt_area${index + 1}`}
            />
          ))}
        </div>
        <button
          className="transition ease-in-out delay-75 hover:-translate-y-1
      hover:scale-110 bg-purple-500 opacity-50 text-white hover:opacity-100
  rounded-md absolute bottom-10 right-10 p-4"
          type="button"
          onClick={(event) => postEditContent(event)}
        >
          Export the PDF File

        </button>

      </div>

    </div>
  );
}

export default EditPdfPage;
