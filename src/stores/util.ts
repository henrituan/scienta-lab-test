import { scaleLinear } from '@visx/scale';

export const getDomains = (points: { x: number; y: number }[]) => {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);

  return {
    x: [Math.min(...xValues), Math.max(...xValues)],
    y: [Math.min(...yValues), Math.max(...yValues)],
  };
};

export const xScale = (args: {
  x: number;
  domain: number[];
  width: number;
}) => {
  const { x, domain, width } = args;
  return scaleLinear({ domain, range: [0, width] })(x);
};

export const yScale = (args: {
  y: number;
  domain: number[];
  height: number;
}) => {
  const { y, domain, height } = args;
  return scaleLinear({ domain, range: [height, 0] })(y);
};

export const getColorForCluster = (clusterId: number) => {
  switch (clusterId) {
    case 0:
      return '#FF0000';
    case 1:
      return '#00FF00';
    case 2:
      return '#0000FF';
    case 3:
      return '#C34A2C';
    case 4:
      return '#FF00FF';
    case 5:
      return '#211414';
    case 6:
      return '#800000';
    case 7:
      return '#008000';
    case 8:
      return '#000080';
    case 9:
      return '#808000';
    case 10:
      return '#800080';
    case 11:
      return '#008080';
    case 12:
      return '#C0C0C0';
    case 13:
      return '#808080';
    case 14:
      return '#9999FF';
    case 15:
      return '#993366';
    case 16:
      return '#240518';
    case 17:
      return '#CCFFFF';
    case 18:
      return '#660066';
    case 19:
      return '#FF8080';
    case 20:
      return '#0066CC';
    case 21:
      return '#CCCCFF';
    case 22:
      return '#C8D300';
    case 23:
      return '#7f55cf';
    case 24:
      return '#1d1f4f';
    case 25:
      return '#00FFFF';
    case 26:
      return '#FF99CC';
    default:
      return '#000000';
  }
};

export const COLOR_RGB: [number, number, number][] = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [195, 74, 44],
  [255, 0, 255],
  [33, 20, 20],
  [128, 0, 0],
  [0, 128, 0],
  [0, 0, 128],
  [128, 128, 0],
  [128, 0, 128],
  [0, 128, 128],
  [192, 192, 192],
  [128, 128, 128],
  [153, 153, 255],
  [153, 51, 102],
  [36, 5, 24],
  [204, 255, 255],
  [102, 0, 102],
  [255, 128, 128],
  [0, 102, 204],
  [204, 204, 255],
  [200, 211, 0],
  [127, 85, 207],
  [29, 31, 79],
  [0, 255, 255],
  [255, 153, 204],
];
