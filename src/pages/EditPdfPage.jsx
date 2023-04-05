/* eslint-disable no-restricted-globals */
import React, {
  useMemo, useRef, useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { fabric } from 'fabric-with-erasing';
import PdfPreviewArea from '../component/PdfPreviewArea';
import ColorPalette from '../component/ColorPalette';
import TextArea from '../component/TextArea';
import DrawArea from '../component/DrawArea';
import LoadingScreen from '../component/LoadingScreen';
import { ReactComponent as SelectIcon } from '../assets/arrow_select.svg';
import { ReactComponent as ExportIcon } from '../assets/export.svg';
import { ReactComponent as EraserIcon } from '../assets/eraser.svg';
import { ReactComponent as TextIncrease } from '../assets/text_increase.svg';
import { ReactComponent as TextDecrease } from '../assets/text_decrease.svg';
import { ReactComponent as BoldIcon } from '../assets/format_bold.svg';
import { ReactComponent as ItalicIcon } from '../assets/format_italic.svg';
import { ReactComponent as DeleteIcon } from '../assets/delete.svg';
import { ReactComponent as SelectedIcon } from '../assets/selected.svg';
import { ReactComponent as BrushSizeIcon } from '../assets/brush_size.svg';
import { MENU_ITEM_FONT_TYPE, MENU_ITEM_SHAPES, MENU_ITEM_TEXT } from '../constants/dropDownItems';
import logo from '../assets/logo.png';
import DropDown from '../component/DropDown';

function EditPdfPage() {
  const location = useLocation();
  const file = location.state.base64;
  const fileName = location.state.name;

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
      actualCanvasWidth: [],
      actualCanvasHeight: [],
    },
  );
  const [toolbarVisiblity, setToolbarVisiblity] = useState('');
  const [boldSelected, setBoldSelected] = useState(false);
  const [italicSelected, setItalicSelected] = useState(false);

  const postEditContent = async () => {
    setIsLoading(true);
    const objects = fabricRef.current.map((canvas, index) => {
      const canvasForTexts = new fabric.Canvas().setDimensions(
        {
          width: pageAttributes.actualCanvasWidth[index],
          height: pageAttributes.actualCanvasHeight[index],
        },
      );
      const result = {
        texts: [], rects: [], circs: [], canvasesForPaths: [],
      };
      const temp = canvas.getObjects().reduce((acc, currVal, currIndex) => {
        if (currVal.get('type') === 'i-text') {
          acc.texts.push(currVal);
        } else if (currVal.get('type') === 'rect') {
          acc.rects.push(currVal);
        } else if (currVal.get('type') === 'circle') {
          acc.circs.push(currVal);
        } else if (currVal.get('type') === 'path') {
          canvasForTexts.add(currVal);
          result.canvasesForPaths.push(canvasForTexts.toDataURL({
            format: 'png', left: 0, top: 0, width: canvasForTexts.width, height: canvasForTexts.height,
          }));
        }
        return acc;
      }, {
        texts: [], rects: [], circs: [], canvasesForPaths: [],
      });

      result.circs = temp.circs.map((val) => {
        const { x, y } = val.getCenterPoint();
        return {
          x,
          y,
          scaleX: val.get('scaleX'),
          scaleY: val.get('scaleY'),
          radius: val.get('radius'),
          color: val.get('stroke'),
          borderWidth: val.get('strokeWidth'),
          rotate: val.get('angle'),
          rotationPoint: val.getCenterPoint(),
        };
      });

      result.rects = temp.rects.map((val) => {
        const angle = val.get('angle');
        val.rotate(0);
        const xValue = val.get('left');
        const yValue = val.get('top');
        val.rotate(angle);
        return {
          x: xValue,
          y: yValue,
          width: val.get('width') * val.get('scaleX'),
          height: val.get('height') * val.get('scaleY'),
          color: val.get('stroke'),
          borderWidth: val.get('strokeWidth'),
          rotate: angle,
          rotationPoint: val.getCenterPoint(),
        };
      });

      temp.texts.map((val) => {
        let textFont = val.get('fontFamily');
        if (val.get('fontStyle') === 'italic') { textFont = `${textFont} Italic`; }
        if (val.get('fontWeight') === 'bold') { textFont = `${textFont} Bold`; }

        if (val.get('_type') === 'F') {
          result.texts.push({
            x: val.get('left'),
            y: val.get('top'),
            width: val.get('width'),
            height: val.get('height'),
            content: val.get('text'),
            type: 'F',
            font: textFont,
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
          font: textFont,
          fontSize: val.get('fontSize'),
          color: val.get('fill'),
        })));
        return null;
      });
      return result;
    });

    const texts = objects.map((val) => val.texts);
    const shapes = [objects.map((val) => val.rects),
      objects.map((val) => val.circs), objects.map((val) => val.canvasesForPaths)];
    try {
      await axios.post('http://localhost:4000/pdfEdit', {
        texts,
        file,
        shapes,
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
    setTextAreaList([...Array(pdf.numPages)].map(() => []));
    const actualCanvasWidthArr = [];
    const actualCanvasHeightArr = [];

    await Promise
      .all(Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (val) => {
        await pdf.getPage(val).then((page) => {
          const viewPort = page.getViewport({ scale: 1 });
          actualCanvasWidthArr.push(viewPort.width);
          actualCanvasHeightArr.push(viewPort.height);
        });
      }));

    setPageAttributes({
      numPages: Array.from(Array(pdf.numPages).keys()),
      actualCanvasWidth: actualCanvasWidthArr,
      actualCanvasHeight: actualCanvasHeightArr,
    });
  };

  const handleTextAreaAdd = (type) => {
    fabricRef.current[pageIndex].isDrawingMode = false;
    const text = new fabric.IText(type === 'S' ? 'Text Area' : 'Fillable Text Area', {
      left: 0,
      top: 0,
      fontSize: 40,
      fill: 'rgb(0, 0, 0)',
      fontFamily: 'Arial',
      hasControls: false,
      erasable: false,
      _type: type,
    });
    text.on('selected', () => {
      setToolbarVisiblity('Text');
      if (fabricRef.current[pageIndex].getActiveObjects().length > 1) { return; }
      setSelectedFont(text.get('fontFamily'));
      setSelectedColor(text.get('fill'));
      setBoldSelected(text.get('fontWeight') === 'bold');
      setItalicSelected(text.get('fontStyle') === 'italic');
    });

    fabricRef.current[pageIndex].add(text);
    fabricRef.current[pageIndex].setActiveObject(text);
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
    <div className="h-screen w-screen flex flex-col bg-[#fbf8fd]">
      {isLoading && <LoadingScreen />}
      <div className="flex justify-between items-center h-min w-full drop-shadow-xl bg-[#fffbff] z-10">

        <div className="flex ml-2">
          <button
            name="select"
            onClick={(e) => { setToolbarVisiblity(''); handleClickShape(e.currentTarget.name); }}
            className="transition ease-in-out delay-100 relative my-1 focus:bg-[#e4dff9]
            px-4 group flex rounded-full items-center w-fit"
            type="button"
          >
            <SelectIcon className="fill-[#46464f] group-focus:fill-[#1b1a2c]" />
            <p className="ml-2 text-[#46464f] group-focus:text-[#1b1a2c]">Select</p>
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

          <button
            name="eraser"
            onClick={(e) => handleClickShape(e.currentTarget.name)}
            className="group relative w-fit flex items-center h-full focus:bg-[#e4dff9] ml-2 rounded-full px-4 py-2 my-1"
            type="button"
          >
            <EraserIcon className="fill-[#46464f] group-focus:fill-[#1b1a2c]" />
            <p className="ml-2 text-[#46464f] group-focus:text-[#1b1a2c]">Eraser</p>
          </button>

        </div>
        <button
          className="relative group flex rounded-xl drop-shadow-xl items-center mr-2 my-1 p-3 w-fit bg-[#4f33ff]"
          type="button"
          onClick={(event) => postEditContent(event)}
        >
          <div className="transition-all ease-in-out delay-100 absolute h-full w-full opacity-0 group-hover:opacity-[0.08] bg-white left-0 rounded-xl" />
          <ExportIcon className="fill-white" />
          <p className="ml-2 text-white">Export PDF</p>
        </button>
      </div>

      <div className="h-12 w-full bg-[#f3f0f4]">
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

          <div className="rounded-full border-2 border-[#787680] divide-x-2 divide-[#787680] flex mr-8 h-fit">
            <button
              onClick={() => {
                setBoldSelected((prev) => !prev);
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => (txt.get('fontWeight') === 'bold'
                    ? txt.set('fontWeight', 'normal') : txt.set('fontWeight', 'bold')));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className={`rounded-l-full w-fit h-full px-2 ${boldSelected && 'bg-[#e4dff9]'}`}
            >
              <SelectedIcon className={`fill-[#1b1a2c] transition absolute ease-in-out delay-150 ${!boldSelected ? 'opacity-0' : 'opacity-100'}`} />
              <BoldIcon className={` transition-all ease-in-out delay-150 ${boldSelected ? 'ml-5 fill-[#1b1a2c]' : 'fill-[#1c1b1f]'}`} />
            </button>

            <button
              onClick={() => {
                setItalicSelected((prev) => !prev);
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => (txt.get('fontStyle') === 'italic'
                    ? txt.set('fontStyle', 'normal') : txt.set('fontStyle', 'italic')));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className={`rounded-r-full w-fit h-full px-2 ${italicSelected && 'bg-[#e4dff9]'}`}
            >
              <SelectedIcon className={`fill-[#1b1a2c]transition absolute ease-in-out delay-150 ${!italicSelected ? 'opacity-0' : 'opacity-100'}`} />
              <ItalicIcon className={`transition-all ease-in-out delay-150 ${italicSelected ? 'ml-5 fill-[#1b1a2c]' : 'fill-[#1c1b1f]'}`} />
            </button>

          </div>

          <div className="grid grid-cols-2 gap-4 h-fit">
            <button
              onClick={() => {
                const texts = fabricRef.current[pageIndex].getActiveObjects().filter((val) => val.get('type') === 'i-text');
                if (texts) {
                  texts.forEach((txt) => txt.set('fontSize', txt.get('fontSize') + 5));
                }
                fabricRef.current[pageIndex].renderAll();
              }}
              type="button"
              className="rounded-full p-2 group relative"
            >
              <div className="absolute bg-[#47464f] opacity-0 group-hover:opacity-[0.08] w-full h-full right-0 bottom-0 rounded-full" />
              <TextIncrease className="fill-[#47464f]" />
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
              className="rounded-full p-2 group relative"
            >
              <div className="absolute bg-[#47464f] opacity-0 group-hover:opacity-[0.08] w-full h-full right-0 bottom-0 rounded-full" />
              <TextDecrease className="fill-[#47464f]" />
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
            className="relative rounded-full bg-[#ffd8e9] group ml-4 p-1"
          >
            <div className="absolute h-full right-0 top-0 w-full rounded-full bg-[#2f1122] opacity-0 group-hover:opacity-[0.08]" />
            <DeleteIcon className="fill-[#2f1122]" />
          </button>

        </div>
        )}

        { toolbarVisiblity === 'Shapes' && (
        <div className="flex w-fit items-center h-full place-items-center">
          <div className={`${selectedShape.name === 'eraser' && 'hidden'}`}>
            <ColorPalette onClicks={handleClickColor} selectedColor={selectedColor} />

          </div>

          <div className="relative flex items-center ml-8 mr-8">
            <BrushSizeIcon className="fill-[#1c1b1f] mr-1" />
            <div className="ml-2">
              <p className="text-sm font-medium text-[#1c1b1f]">Brush Size</p>
              <input className="peer" step={1} min={1} max={50} onChange={(e) => setLineWidth(Number(e.target.value))} value={lineWidth} type="range" />
              <div
                style={{ left: 32 + ((150 / 49) * (lineWidth - 1)) - (10 * (lineWidth / 25)) }}
                className="transition ease-in-out delay-150 opacity-0 peer-hover:opacity-100 absolute"
              >
                <svg width="24px" viewBox="0 0 30 42">
                  <path
                    fill="#e4dff9"
                    stroke="#e4dff9"
                    strokeWidth="1.5"
                    d="M15 3
           Q16.5 6.8 25 18
           A12.8 12.8 0 1 1 5 18
           Q13.5 6.8 15 3z"
                  />
                  <text x={lineWidth > 9 ? '7' : '11'} y="30" fill="#1b1a2c">{lineWidth}</text>
                </svg>
              </div>

            </div>

          </div>

          <button
            name="eraser-object"
            onClick={(e) => handleClickShape(e.currentTarget.name)}
            className={`
          relative rounded-full bg-[#ffd8e9] group ml-4 p-1 ${selectedShape.name === 'eraser' && 'hidden'}
          `}
            type="button"
          >
            <div className="absolute h-full right-0 top-0 w-full rounded-full bg-[#2f1122] opacity-0 group-hover:opacity-[0.08]" />
            <DeleteIcon className="fill-[#2f1122]" />
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
      </div>
    </div>
  );
}

export default EditPdfPage;
