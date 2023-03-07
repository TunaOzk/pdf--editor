import React, {
  useMemo, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PdfPreviewArea from '../component/PdfPreviewArea';
import ShapePalette from '../component/ShapePalette';
import ColorPalette from '../component/ColorPalette';
import TextArea from '../component/TextArea';
import TextAreaPalette from '../component/TextAreaPalette';
import DrawArea from '../component/DrawArea';

function EditPdfPage() {
  const location = useLocation();
  const file = location.state.base64;
  const fileName = location.state.name;
  // eslint-disable-next-line no-restricted-globals
  const screenSize = (screen.height * 0.6);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedShape, setSelectedShape] = useState({ name: '' });
  const [lineWidth, setLineWidth] = useState(1);
  const [textAreaList, setTextAreaList] = useState([[]]);
  const fabricRef = useRef([]);
  const [pageAttributes, setPageAttributes] = useState(
    { numPages: [], canvasWidth: 0, canvasHeight: 0 },
  );
  const actualCanvasSize = useRef({ width: 0, height: 0 });

  const postEditContent = async () => {
    const base64Canvas = fabricRef.current.map((item) => {
      item.discardActiveObject().renderAll();
      const newCanvas = document.createElement('canvas');
      newCanvas.width = actualCanvasSize.current.width;
      newCanvas.height = actualCanvasSize.current.height;
      newCanvas.getContext('2d').drawImage(
        item.lowerCanvasEl,
        0,
        0,
        newCanvas.width,
        newCanvas.height,
      );
      const dataUri = newCanvas.toDataURL('');
      newCanvas.remove();
      return dataUri;
    });
    try {
      await axios.post('http://localhost:4000/pdfEdit', {
        textAreaList,
        file,
        base64Canvas,
        screenSize,
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
  const handleClickColor = (e) => {
    const { backgroundColor } = e.target.style;
    setSelectedColor(backgroundColor);
  };

  const handleClickShape = (e) => {
    setSelectedShape({ name: e.currentTarget.name });
  };
  const handleLoadSucces = (pdf) => {
    setTextAreaList([...Array(pdf.numPages)].map((val, index) => []));

    pdf.getPage(1).then((page) => {
      const viewPort = page.getViewport({ scale: 1 });
      actualCanvasSize.current = { width: viewPort.width, height: viewPort.height };
      setPageAttributes({
        numPages: Array.from(Array(pdf.numPages).keys()),
        // canvasWidth: viewPort.width,
        // canvasHeight: viewPort.height,
        canvasWidth: (screenSize / viewPort.height) * viewPort.width,
        canvasHeight: screenSize,
      });
    });
  };

  const handleTextAreaAdd = (_type) => {
    setSelectedShape('');
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
  const memoizedDrawArea = useMemo(() => (
    <DrawArea
      pageAttributes={pageAttributes}
      selectedColor={selectedColor}
      selectedShape={selectedShape}
      pageIndex={pageIndex}
      lineWidth={lineWidth}
      fabricRef={fabricRef}
    />
  ), [pageAttributes, lineWidth, pageIndex, selectedColor, selectedShape]);
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
          <ShapePalette onClicks={handleClickShape} />
        </div>
        <div className="h-full flex">
          <TextAreaPalette
            onTextAreaAdd={handleTextAreaAdd}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-5/6 w-full">
        {memoizedDrawArea}
        <div>
          <PdfPreviewArea
            onLoadSuccessForEditPage={handleLoadSucces}
            file={file}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            currentPdfPages={pageAttributes.numPages}
            // // eslint-disable-next-line no-restricted-globals
            // height={3 * (screen.height / 5)}
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
