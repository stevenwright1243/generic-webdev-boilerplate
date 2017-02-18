const source = 'development/';
const limbo = 'limbo/assets/';
const dest = 'production/';

const useSourcemaps = true;
const minify = false;

const sass = [
  'styles',
  'other',
];

// Any element that starts with 'libs/' won't be ran through babel
const js = [
  'libs/jquery',
  'libs/fullpage',
  'libs/parallax',
  'libs/anime',
  'libs/shine',
  'landing/parallax',
  'landing/anime',
  'landing/shine',
  'landing/colors',
  'scripts',
];

// Automatically all elements of js that starts with the string 'libs/' to babelIgnore,
// Manually add to this array if needed
const babelIgnore = [];

// Requires that website is live, ooooor the local path to your html files...
const removeUnusedCss = false;
const pageArray = [
  'http://www.example.com',
  'http://www.example.com/about-us',
];

// optimize images (prevents other tasks, meant to be run only when images need to be optimized)
const images = false;
const imageDest = `${dest}assets/images`;


js.map((x) => {
  if (x.startsWith('libs/')) {
    return babelIgnore.push(x);
  }
  return false;
});

// prepend/append strings to each value of arrays
const sassArray = sass.map(x => `development/sass/${x}.scss`);
const jsArray = js.map(x => `development/js/${x}.js`);
const babelIgnoreArray = babelIgnore.map(x => `development/js/${x}.js`);

// Get the difference between jsArray and babelIgnore because gulp-babel
// ignore option isn't working - https://github.com/babel/gulp-babel/issues/106
const usableBabelIgnore = jsArray.filter(x => babelIgnoreArray.indexOf(x) < 0);

// Export variables
export {
  source,
  limbo,
  dest,
  useSourcemaps,
  minify,
  sassArray,
  jsArray,
  usableBabelIgnore,
  removeUnusedCss,
  pageArray,
  images,
  imageDest,
};
