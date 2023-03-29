/* eslint-disable no-restricted-globals */
import React, {
  useMemo, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { fabric } from 'fabric';
import PdfPreviewArea from '../component/PdfPreviewArea';
import ColorPalette from '../component/ColorPalette';
import TextArea from '../component/TextArea';
import DrawArea from '../component/DrawArea';
import LoadingScreen from '../component/LoadingScreen';
import { ReactComponent as SelectIcon } from '../assets/arrow_select.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as ObjectEraserIcon } from '../assets/object_erase.svg';
import { ReactComponent as EraserIcon } from '../assets/eraser.svg';
import { ReactComponent as TextIncrease } from '../assets/text_increase.svg';
import { ReactComponent as TextDecrease } from '../assets/text_decrease.svg';
import { ReactComponent as BoldIcon } from '../assets/format_bold.svg';
import { ReactComponent as ItalicIcon } from '../assets/format_italic.svg';
import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
import { MENU_ITEM_FONT_TYPE, MENU_ITEM_SHAPES, MENU_ITEM_TEXT } from '../constants/dropDownItems';
import DropDown from '../component/DropDown';

function EditPdfPage() {
  const location = useLocation();
  const file = location.state.base64;
  const fileName = location.state.name;
  const screenSize = (screen.height * 0.6);

  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedShape, setSelectedShape] = useState({ name: '' });
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [lineWidth, setLineWidth] = useState(10);
  const [textAreaList, setTextAreaList] = useState([[]]);
  const fabricRef = useRef([]);
  const [pageAttributes, setPageAttributes] = useState(
    {
      numPages: [],
      canvasWidth: [],
      canvasHeight: 0,
      actualCanvasWidth: [],
      actualCanvasHeight: [],
    },
  );
  const [toolbarVisiblity, setToolbarVisiblity] = useState('');
  const postEditContent = async () => {
    setIsLoading(true);
    const base64Canvas = fabricRef.current.map((item, index) => {
      item.discardActiveObject().renderAll();
      const newCanvas = document.createElement('canvas');
      newCanvas.width = pageAttributes.actualCanvasWidth[index];
      newCanvas.height = pageAttributes.actualCanvasHeight[index];
      newCanvas.getContext('2d').drawImage(
        item.lowerCanvasEl,
        0,
        0,
        newCanvas.width,
        newCanvas.height,
      );
      const dataUri = newCanvas.toDataURL('image/png');
      newCanvas.remove();
      return dataUri;
    });
    const objects = fabricRef.current.map((canvas, index) => {
      const result = { texts: [], rects: [], circs: [] };
      const deneme = canvas.getObjects().reduce((acc, currVal, currIndex) => {
        if (currVal.get('type') === 'i-text') {
          acc.texts.push(currVal);
        } else if (currVal.get('type') === 'rect') {
          acc.rects.push(currVal);
        } else if (currVal.get('type') === 'circle') {
          acc.circs.push(currVal);
        }
        return acc;
      }, { texts: [], rects: [], circs: [] });
      result.circs = deneme.circs.map((val) => ({
        x: (val.get('aCoords').tl.x + val.get('aCoords').tr.x) / 2,
        y: (val.get('aCoords').bl.y + val.get('aCoords').tl.y) / 2,
        width: val.get('width'),
        height: val.get('height'),
        color: val.get('stroke'),
        borderWidth: val.get('strokeWidth'),
      }));

      result.rects = deneme.rects.map((val) => ({
        x: val.get('left'),
        y: val.get('top'),
        width: val.get('width'),
        height: val.get('height'),
        color: val.get('stroke'),
        borderWidth: val.get('strokeWidth'),
        radius: val.get('radius'),
      }));

      const texts = canvas.getObjects().filter((val) => val.get('type') === 'i-text');
      const temp = [];
      deneme.texts.map((val, idx) => {
        if (val.get('_type') === 'F') {
          result.texts.push({
            x: val.get('left'),
            y: val.get('top'),
            width: val.get('width'),
            height: val.get('height'),
            content: val.get('text'),
            type: 'F',
            font: val.get('fontFamily'),
            fontSize: val.get('fontSize'),
            color: val.get('fill'),
          });
          return null;
        }
        val.textLines.map((line, indx) => (result.texts.push({
          x: val.get('left'),
          y: (indx * val.getHeightOfLine(indx)) + val.get('top'),
          width: val.get('width'),
          height: val.textLines.length > 1
            ? (val.textLines.length * val.getHeightOfLine(indx) - val.get('height')) / 2 : (val.getHeightOfLine(indx) - val.get('height')) / 2,
          content: line,
          type: 'S',
          font: val.get('fontFamily'),
          fontSize: val.get('fontSize'),
          color: val.get('fill'),
        })));
        return null;
      });
      return result;
    });

    const texts = objects.map((val) => val.texts);
    const shapes = [objects.map((val) => val.rects), objects.map((val) => val.circs)];
    try {
      await axios.post('http://localhost:4000/pdfEdit', {
        texts,
        file,
        shapes,
        screenSize,
      })
        .then((res) => {
          const a = document.createElement('a');
          a.href = res.data;
          a.download = fileName;
          a.click();
          a.remove();
          setIsLoading(false);
        });
    } catch (error) {
      throw new Error(error);
    }
  };
  const handleClickColor = (e) => {
    const { backgroundColor } = e.target.style;
    setSelectedColor(backgroundColor);
  };

  const handleClickShape = (shape) => {
    setSelectedShape({ name: shape });
  };
  const handleLoadSucces = async (pdf) => {
    setTextAreaList([...Array(pdf.numPages)].map((val, index) => []));
    const actualCanvasWidthArr = [];
    const actualCanvasHeightArr = [];
    const canvasWidthArr = [];

    await Promise
      .all(Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (val, index) => {
        await pdf.getPage(val).then((page) => {
          const viewPort = page.getViewport({ scale: 1 });
          actualCanvasWidthArr.push(viewPort.width);
          actualCanvasHeightArr.push(viewPort.height);
          canvasWidthArr.push((screenSize / viewPort.height) * viewPort.width);
        });
      }));

    setPageAttributes({
      numPages: Array.from(Array(pdf.numPages).keys()),
      actualCanvasWidth: actualCanvasWidthArr,
      actualCanvasHeight: actualCanvasHeightArr,
      canvasWidth: canvasWidthArr,
      canvasHeight: screenSize,
    });
  };

  const handleTextAreaAdd = (type) => {
    const text = new fabric.IText(type === 'S' ? 'Text Area' : 'Fillable Text Area', {
      left: 0,
      top: 0,
      fontSize: 40,
      fill: 'rgb(0, 0, 0)',
      fontFamily: 'Arial',
      hasControls: false,
      _type: type,
      _height: 0,
    });
    fabricRef.current[pageIndex].add(text);

    // setTextAreaList((prevArr) => {
    //   const newArr = [...prevArr];
    //   const temp = [...newArr[pageIndex], {
    //     x: 0,
    //     y: 0,
    //     width: _type === 'F' ? '100px' : '50px',
    //     height: '50px',
    //     content: _type === 'F' ? 'FILLABLE TEXT AREA' : 'TEXT AREA',
    //     ID: newArr[pageIndex].length,
    //     type: _type,
    //     font: 'Arial',
    //     fontSize: 16,
    //   }];
    //   newArr[pageIndex] = temp;
    //   return newArr;
    // });
  };
  const memoizedDrawArea = useMemo(() => (
    <DrawArea
      pageAttributes={pageAttributes}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      selectedShape={selectedShape}
      pageIndex={pageIndex}
      lineWidth={lineWidth}
      setLineWidth={setLineWidth}
      fabricRef={fabricRef}
      onToolbarVisiblity={setToolbarVisiblity}
    />
  ), [pageAttributes, selectedColor, selectedShape, pageIndex, lineWidth]);

  const handleToolbarVisiblity = (label) => {
    setToolbarVisiblity(label);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-stone-200">
      {isLoading && <LoadingScreen />}
      <div className="flex justify-between items-center h-min w-full drop-shadow-xl bg-stone-200 z-10">

        <div className="flex">
          <button
            name="select"
            onClick={(e) => { setToolbarVisiblity(''); handleClickShape(e.currentTarget.name); }}
            className="flex items-center w-fit hover:bg-stone-300"
            type="button"
          >
            <SelectIcon className="" />
            <p className="ml-2 mr-4">Select</p>
          </button>
          <DropDown
            menuItemContent={MENU_ITEM_SHAPES.content}
            menuItemHeader={MENU_ITEM_SHAPES.header}
            onToolbarVisiblity={handleToolbarVisiblity}
            onAction={handleClickShape}
          />
          <DropDown
            menuItemContent={MENU_ITEM_TEXT.content}
            menuItemHeader={MENU_ITEM_TEXT.header}
            onToolbarVisiblity={handleToolbarVisiblity}
            onAction={handleTextAreaAdd}
          />

          <button name="eraser" onClick={(e) => handleClickShape(e.currentTarget.name)} className="w-fit flex items-center h-full hover:bg-stone-400" type="button">
            <EraserIcon />
            <p className="ml-1 mr-2">Eraser</p>
          </button>

        </div>
        <p style={{ fontFamily: 'Comic Sans MS' }} className="text-xl">PDF Editor Logo</p>
        <button
          className="flex items-center w-fit hover:bg-stone-300"
          type="button"
          onClick={(event) => postEditContent(event)}
        >
          <ExportIcon />
          <p className="ml-2 mr-4">Export the PDF File</p>
        </button>
      </div>

      <div className="h-12 w-full drop-shadow-xl bg-stone-300">
        { toolbarVisiblity === 'Text' && (

        <div className="flex items-center h-full">

          <div className="flex mr-8">
            <ColorPalette onClicks={handleClickColor} selectedColor={selectedColor} />
            <select
              value={selectedFont}
              onChange={(e) => {
                setSelectedFont(e.target.value);
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => (txt.set('fontFamily', e.target.value)));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
            >
              {MENU_ITEM_FONT_TYPE.content.map((val) => (
                <option key={val.id} value={val.label}>
                  {val.label}
                </option>
              ))}
            </select>

          </div>

          <div className="grid grid-cols-2 gap-4 mr-8 h-full">
            <button
              onClick={() => {
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => (txt.get('fontWeight') === 'bold'
                    ? txt.set('fontWeight', 'normal') : txt.set('fontWeight', 'bold')));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className="w-fit h-full hover:bg-stone-400"
            >
              <BoldIcon />
            </button>

            <button
              onClick={() => {
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => (txt.get('fontStyle') === 'italic'
                    ? txt.set('fontStyle', 'normal') : txt.set('fontStyle', 'italic')));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className="w-fit h-full hover:bg-stone-400"
            >
              <ItalicIcon />
            </button>

          </div>

          <div className="grid grid-cols-2 gap-4 h-full">
            <button
              onClick={() => {
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => txt.set('fontSize', txt.get('fontSize') + 5));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className="w-fit h-full hover:bg-stone-400 px-2"
            >
              <TextIncrease />
            </button>

            <button
              onClick={() => {
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => txt.set('fontSize', txt.get('fontSize') <= 10 ? 10 : txt.get('fontSize') - 5));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className="w-fit h-full hover:bg-stone-400 px-2"
            >
              <TextDecrease />
            </button>

          </div>

          <button
            onClick={() => {
              const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
              if (texts) {
                texts.forEach((txt) => fabricRef.current[pageIndex].remove(txt));
              }
              fabricRef.current[pageIndex].discardActiveObject().renderAll();
            }}
            type="button"
            className="w-fit h-full hover:bg-stone-400 ml-4 px-2"
          >
            <DeleteIcon />
          </button>

        </div>
        )}

        { toolbarVisiblity === 'Shapes' && (
        <div className="flex grid grid-cols-4 w-fit items-center h-full place-items-center">
          <ColorPalette onClicks={handleClickColor} selectedColor={selectedColor} />

          <input step={1} min={1} max={50} onChange={(e) => setLineWidth(Number(e.target.value))} value={lineWidth} type="range" />

          <button name="eraser-object" onClick={(e) => handleClickShape(e.currentTarget.name)} className="ml-2 flex items-center w-fit h-full hover:bg-stone-400" type="button">
            <ObjectEraserIcon />
            <p className="ml-1 mr-2">Remove</p>
          </button>
        </div>

        )}
      </div>
      <div className="flex flex-col items-center justify-center h-5/6 w-full">
        <div className="overflow-auto">
          {memoizedDrawArea}
          <PdfPreviewArea
            onLoadSuccessForEditPage={handleLoadSucces}
            file={file}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            currentPdfPages={pageAttributes.numPages}
          />
          {textAreaList[pageIndex].map((val, index) => (
            <TextArea
              id={val.ID}
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
              key={`textarea_${pageIndex.toString() + (val.ID).toString()}`}
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
