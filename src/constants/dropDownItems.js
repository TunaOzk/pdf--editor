import shapesImg from '../assets/shapes.svg';
import freeHandDrawImg from '../assets/brush.svg';
import circleDrawImg from '../assets/draw_circle.svg';
import rectangleDrawImg from '../assets/draw_rectangle.svg';
import textImg from '../assets/text.svg';
import simpleTextAreaImg from '../assets/simple_text_area.svg';
import fillableTextAreaImg from '../assets/fillable_text_area.svg';

export const MENU_ITEM_SHAPES = {
  header: {
    img: shapesImg,
    label: 'Shapes',
  },
  content: [
    {
      id: 1,
      img: rectangleDrawImg,
      label: 'Rectangle',
      action: 'rectangle',
    },
    {
      id: 2,
      img: circleDrawImg,
      label: 'Circle',
      action: 'circle',
    },
    {
      id: 3,
      img: freeHandDrawImg,
      label: 'Brush',
      action: 'free',
    },
  ],
};

export const MENU_ITEM_TEXT = {
  header: {
    img: textImg,
    label: 'Text',
  },
  content: [
    {
      id: 1,
      img: simpleTextAreaImg,
      label: 'Simple Text Area',
      action: 'S',
    },
    {
      id: 2,
      img: fillableTextAreaImg,
      label: 'Fillable Text Area',
      action: 'F',
    },
  ],
};

export const MENU_ITEM_FONT_TYPE = {
  content: [
    {
      id: 1,
      label: 'Arial',
    },
    {
      id: 2,
      label: 'Brush Script MT',
    },
    {
      id: 3,
      label: 'Courier New',
    },
    {
      id: 4,
      label: 'Comic Sans MS',
    },
    {
      id: 5,
      label: 'Garamond',
    },
    {
      id: 6,
      label: 'Georgia',
    },
    {
      id: 7,
      label: 'Tahoma',
    },
    {
      id: 8,
      label: 'Trebuchet MS',
    },
    {
      id: 9,
      label: 'Times New Roman',
    },
    {
      id: 10,
      label: 'Verdana',
    },
  ],
};
