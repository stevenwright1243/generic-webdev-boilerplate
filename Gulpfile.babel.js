/* eslint import/no-extraneous-dependencies: "off" */
// Import configuration settings (file name has .babel so it can use es6 modules)

import {
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
} from './gulp.config';

// Packages for Gulp
const gulp = require('gulp');                           // https://github.com/gulpjs/gulp
const plumber = require('gulp-plumber');                // https://github.com/floatdrop/gulp-plumber
const gulpif = require('gulp-if');                      // https://github.com/robrich/gulp-if
const image = require('gulp-image');                    // https://github.com/1000ch/gulp-image
const sourcemaps = require('gulp-sourcemaps');          // https://github.com/floridoo/gulp-sourcemaps
const sass = require('gulp-sass');                      // https://github.com/dlmanning/gulp-sass
const babel = require('gulp-babel');                    // https://github.com/babel/gulp-babel
const uncss = require('gulp-uncss');                    // https://github.com/ben-eb/gulp-uncss
const postcss = require('gulp-postcss');                // https://github.com/postcss/gulp-postcss
const mqpacker = require('css-mqpacker');               // https://github.com/hail2u/node-css-mqpacker
const cssnano = require('cssnano');                     // https://github.com/ben-eb/gulp-cssnano
const autoprefixer = require('gulp-autoprefixer');      // https://github.com/sindresorhus/gulp-autoprefixer
const flexbugs = require('postcss-flexbugs-fixes');     // https://github.com/luisrudge/postcss-flexbugs-fixes
const concat = require('gulp-concat');                  // https://github.com/contra/gulp-concat
const uglify = require('gulp-uglify');                  // https://github.com/terinjokes/gulp-uglify
const rev = require('gulp-rev');                        // https://github.com/sindresorhus/gulp-rev
const revReplace = require('gulp-rev-replace');         // https://github.com/jamesknelson/gulp-rev-replace
const revDel = require('rev-del');                      // https://github.com/callumacrae/rev-del


// Separate php tasks for performance
gulp.task('phpClasses', () => {
  gulp.src('development/includes/classes/**/**.php', { base: 'development/includes/classes' })
  .pipe(plumber())
  .pipe(gulp.dest(`${dest}includes/classes`));
});

gulp.task('phpFunctions', () => {
  gulp.src('development/includes/functions/**/**.php', { base: 'development/includes/functions' })
  .pipe(plumber())
  .pipe(gulp.dest(`${dest}includes/functions`));
});

gulp.task('phpParts', () => {
  gulp.src('development/includes/parts/**/**.php', { base: 'development/includes/parts' })
  .pipe(plumber())
  .pipe(gulp.dest(`${dest}includes/parts`));
});

gulp.task('phpSections', () => {
  gulp.src('development/includes/sections/**/**.php', { base: 'development/includes/sections' })
  .pipe(plumber())
  .pipe(gulp.dest(`${dest}includes/sections`));
});

gulp.task('phpPages', () => {
  gulp.src('development/pages/**/**.php', { base: 'development/pages' })
  .pipe(plumber())
  .pipe(gulp.dest(dest));
});


// Sassify, optimize, automatically prefix, and minify css
gulp.task('sass', () => {
  gulp.src(sassArray, { base: 'development/sass' })
  .pipe(plumber())
  .pipe(gulpif(useSourcemaps, sourcemaps.init()))
  .pipe(sass())
  .pipe(gulpif(removeUnusedCss, uncss({ // Remove unused css based on what pages are using
    html: pageArray,
  })))
  .pipe(gulpif(minify, postcss([
    flexbugs(), // Fix flexbox bugs for IE 10-11
    mqpacker(), // TODO: Can somtimes break?
    cssnano(), // css minifier
  ])))
  .pipe(autoprefixer())
  .pipe(gulpif(useSourcemaps, sourcemaps.write()))
  .pipe(gulp.dest(`${limbo}css`));
});

// Babelfy, minify and then combine js files
gulp.task('javascript', () => {
  gulp.src(jsArray, { base: 'development/js' })
  .pipe(plumber())
  .pipe(gulpif(useSourcemaps, sourcemaps.init()))
  .pipe(concat('all.js')) // concatenate all js into a single file
  .pipe(babel({ // convert latest js into browser ready js
    presets: ['latest'],
  }))
  .pipe(gulpif(minify, uglify())) // js minifier
  .pipe(gulpif(useSourcemaps, sourcemaps.write()))
  .pipe(gulp.dest(`${limbo}js`));
});

// Rename assets based on content cache
gulp.task('sassRevisions', ['sass'], () => {
  gulp.src(`${limbo}**/**/**/*.css`, { base: 'limbo/' })
    .pipe(plumber())
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest('assets/css/manifest.json'))
    .pipe(revDel({ dest, force: true })) // force: true so that revDel can delete files above itself
    .pipe(gulp.dest(dest));
});

// Rename assets based on content cache
gulp.task('jsRevisions', ['javascript'], () => {
  gulp.src(`${limbo}**/**/**/*.js`, { base: 'limbo/' })
    .pipe(plumber())
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest('assets/js/manifest.json'))
    .pipe(revDel({ dest, force: true })) // force: true so that revDel can delete files above itself
    .pipe(gulp.dest(dest));
});

gulp.task('phpRevisions', ['phpClasses', 'phpFunctions', 'phpParts', 'phpSections', 'phpPages'], () => {
  gulp.src(`${limbo}**/**/**/*.php`, { base: 'limbo/' })
    .pipe(plumber())
    .pipe(gulp.dest(dest));
});

gulp.task('imageoptim', () => {
  gulp.src(`${source}images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,ico}`)
    .pipe(plumber())
    .pipe(image())
    .pipe(gulp.dest(imageDest));
});

// Watch everything and update
if (images === true) {
  gulp.task('watch', () => {
    gulp.watch(`${source}images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,ico}`, ['imageoptim']);
  });
  gulp.task('default', ['imageoptim', 'watch']);
} else {
  gulp.task('watch', () => {
    gulp.watch(`${source}**/**/**/*.{css,scss}`, ['sassRevisions']);
    gulp.watch(`${source}**/**/**/*.js`, ['jsRevisions']);
    gulp.watch(`${source}includes/classes/**/*.php`, ['phpClasses']);
    gulp.watch(`${source}includes/functions/**/*.php`, ['phpFunctions']);
    gulp.watch(`${source}includes/parts/**/*.php`, ['phpParts']);
    gulp.watch(`${source}includes/sections/**/*.php`, ['phpSections']);
    gulp.watch(`${source}pages/**/*.php`, ['phpPages']);
  });
  gulp.task('default', ['sassRevisions', 'jsRevisions', 'phpClasses', 'phpFunctions', 'phpParts', 'phpSections', 'phpPages', 'watch']);
}
