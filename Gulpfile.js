var source = 'development/';
var limbo = 'limbo/assets/';
var dest = 'production/';

var useSourcemaps = false;
var minify = false;

var sassArray = [
  'development/sass/styles.scss',
  'development/sass/other.scss'
];

var jsArray = [
  'development/js/libs/lib.js',
  'development/js/scripts.js'
];

// Requires that website is live, ooooor the local path to your html files. (Sucks bad if site is dynamic)
var removeUnusedCss = false;
var pageArray = [
  'http://www.example.com',
  'http://www.example.com/about-us'
];

// optimize images (prevents other tasks, meant to be run only when images need to be optimized)
var images = false;

var gulp = require('gulp');
var plumber = require('gulp-plumber');                // https://github.com/floatdrop/gulp-plumber
var gulpif = require('gulp-if');                      // https://github.com/robrich/gulp-if
var image = require('gulp-image');                    // https://github.com/1000ch/gulp-image
var sourcemaps = require('gulp-sourcemaps');          // https://github.com/floridoo/gulp-sourcemaps
var sass = require('gulp-sass');                      // https://github.com/dlmanning/gulp-sass
var babel = require('gulp-babel');                    // https://github.com/babel/gulp-babel
var uncss = require('gulp-uncss');                    // https://github.com/ben-eb/gulp-uncss
var postcss = require('gulp-postcss');                // https://github.com/postcss/gulp-postcss
var mqpacker = require('css-mqpacker');               // https://github.com/hail2u/node-css-mqpacker
var cssnano = require('cssnano');                     // https://github.com/ben-eb/gulp-cssnano
var autoprefixer = require('gulp-autoprefixer');      // https://github.com/sindresorhus/gulp-autoprefixer
var flexbugs = require('postcss-flexbugs-fixes');     // https://github.com/luisrudge/postcss-flexbugs-fixes
var concat = require('gulp-concat');                  // https://github.com/contra/gulp-concat
var uglify = require('gulp-uglify');                  // https://github.com/terinjokes/gulp-uglify
var rev = require('gulp-rev');                        // https://github.com/sindresorhus/gulp-rev
var revReplace = require('gulp-rev-replace');         // https://github.com/jamesknelson/gulp-rev-replace
var revDel = require('rev-del');                      // https://github.com/callumacrae/rev-del


// Sassify, optimize, automatically prefix, and minify css
gulp.task('sass', function () {
  return gulp.src(sassArray, {base: 'development/sass'})
  .pipe(plumber())
  .pipe(gulpif(useSourcemaps, sourcemaps.init()))
  .pipe(sass())
  .pipe(gulpif(removeUnusedCss, uncss({ // Remove unused css based on what pages are using
    html: pageArray
  })))
  .pipe(gulpif(minify, postcss([
    flexbugs(), // Fix flexbox bugs for IE 10-11
    mqpacker(), // TODO: Can somtimes break...
    cssnano() // css minifier
  ])))
  .pipe(autoprefixer())
  .pipe(gulpif(useSourcemaps, sourcemaps.write()))
  .pipe(gulp.dest(limbo + 'css'));
});

// Babelfy, minify and then combine js files
gulp.task('javascript', function(){
  return gulp.src(jsArray, {base: 'development/js'})
  .pipe(plumber())
  .pipe(gulpif(useSourcemaps, sourcemaps.init()))
  .pipe(concat('all.js'))
  .pipe(babel({
    presets: ['latest']
  }))
  .pipe(gulpif(minify, uglify()))
  .pipe(gulpif(useSourcemaps, sourcemaps.write()))
  .pipe(gulp.dest(limbo + 'js'));
});

// Rename assets based on content cache
gulp.task('revisions', ['sass', 'javascript'], function() {
  return gulp.src(limbo + '**/**/**/*.{css,js}', { base: 'limbo/' })
    .pipe(plumber())
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest('assets/rev-manifest.json'))
    .pipe(revDel({ dest, force: true })) // force: true so that revDel can delete files above itself
    .pipe(gulp.dest(dest));
});

gulp.task('imageoptim', function () {
  gulp.src(source + 'images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,ico}')
    .pipe(image())
    .pipe(gulp.dest(dest + 'assets/images'));
});

// Watch everything and update
if (images == true) {
  gulp.task('watch', function () {
    gulp.watch(source + 'images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,ico}', ['imageoptim']);
  });
  gulp.task('default', ['imageoptim', 'watch']);
} else {
  gulp.task('watch', function () {
    gulp.watch(source + '**/**/**/*.{css,scss,js}', ['revisions']);
  });
  gulp.task('default', ['revisions', 'watch']);
}