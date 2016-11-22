import hsl from 'hsl-to-hex';

// isHex short or full
const isHex = color => color.search(/^#?[\da-f]{3}([\da-f]{3})?$/) !== -1;
const shortToHex = color => color.replace(/([\da-f])/g, '$&$&');

const isRgb = color =>
  (color.search(/^rgb\((\d{1,3},){2}\d{1,3}\)$/) !== -1) &&
  (color.match(/\d{1,3}/g).reduce((prev, number) => number < 256));

const isHsl = (color) => {
  if (color.search(/^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)$/) === -1) return false;

  const hslParams = color.match(/\d{1,3}/g);
  return (
    (hslParams[0] <= 360) &&
    (hslParams[1] <= 100) &&
    (hslParams[2] <= 100));
};

const setHash = (color) => {
  const hasFirstHash = (color.charAt(0) === '#');
  return hasFirstHash ? color : `#${color}`;
};

export default function getColor(color) {
  if (isHex(color)) return setHash((color.length < 5) ? shortToHex(color) : color);

  if (isRgb(color)) {
    return color.match(/\d{1,3}/g).reduce((str, number) => {
      let numberStr = (+number).toString(16);
      if (numberStr.length === 1) numberStr += numberStr;
      return str + numberStr;
    }, '#');
  }

  if (isHsl(color)) return hsl(...color.match(/\d{1,3}/g));

  return 'Invalid color';
}
