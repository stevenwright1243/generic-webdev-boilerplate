const source = 'development/';
const limbo = 'limbo/assets/';
const dest = 'production/';

const useSourcemaps = false;
const minify = true;

const sassArray = [
  'development/sass/styles.scss',
  'development/sass/other.scss',
];

const jsArray = [
  'development/js/scripts.js',
];

// Requires that website is live, ooooor the local path to your html files...
const removeUnusedCss = false;
const pageArray = [
  'http://www.example.com',
  'http://www.example.com/about-us',
];

// optimize images (prevents other tasks, meant to be run only when images need to be optimized)
const images = false;

const imageDest = `${dest}assets/images`;

// Export variables
export {
  source,
  limbo,
  dest,
  useSourcemaps,
  minify,
  sassArray,
  jsArray,
  removeUnusedCss,
  pageArray,
  images,
  imageDest,
};
