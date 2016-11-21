import hsl from 'hsl-to-hex';

const isHex = color => color.search(/^#?[0-9a-f]{6}$/) !== -1;
const isShort = color => color.search(/^#?[0-9a-f]{3}$/) !== -1;
const shortToHex = color => color.replace(/([0-9a-f])/g, '$&$&');

const isRgb = color =>
  (color.search(/^rgb\((([0-9]{1,3}),){2}([0-9]{1,3})\)$/) !== -1) &&
  (color.match(/[0-9]{1,3}/g).reduce((prev, number) => number < 256));

const isHsl = (color) => {
  if (color.search(/^hsl\([0-9]{1,3},[0-9]{1,3}%,[0-9]{1,3}%\)$/) === -1)
    return false;
  const hslParams = color.match(/[0-9]{1,3}/g);
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
  if (isHex(color)) {
    return setHash(color);
  }

  if (isShort(color)) {
    return setHash(shortToHex(color));
  }

  if (isRgb(color)) {
    return color.match(/[0-9]{1,3}/g).reduce((str, number) => {
      let numberStr = (+number).toString(16);
      (numberStr.length === 1) && (numberStr += numberStr);
      return str + numberStr;
    }, '#');
  }

  if (isHsl(color)) {
    return hsl(...color.match(/[0-9]{1,3}/g));
  }

  return 'Invalid color';
}
