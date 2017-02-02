var source = 'development/';
var limbo = 'limbo/assets/';
var dest = 'production/';

var useSourcemaps = false;
var minify = true;

var sassArray = [
  'development/sass/styles.scss',
  'development/sass/other.scss'
];

var jsArray = [
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
var imageDest = dest + 'assets/images';


var gulp = require('gulp');                           // https://github.com/gulpjs/gulp
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


gulp.task('phpClasses', function() {
  return gulp.src('development/includes/classes/**/**.php', {base: 'development/includes/classes'})
  .pipe(plumber())
  .pipe(gulp.dest(dest + 'includes/classes'));
});

gulp.task('phpFunctions', function() {
  return gulp.src('development/includes/functions/**/**.php', {base: 'development/includes/functions'})
  .pipe(plumber())
  .pipe(gulp.dest(dest + 'includes/functions'))
});

gulp.task('phpParts', function() {
  return gulp.src('development/includes/parts/**/**.php', {base: 'development/includes/parts'})
  .pipe(plumber())
  .pipe(gulp.dest(dest + 'includes/parts'))
});

gulp.task('phpSections', function() {
  return gulp.src('development/includes/sections/**/**.php', {base: 'development/includes/sections'})
  .pipe(plumber())
  .pipe(gulp.dest(dest + 'includes/sections'))
});

gulp.task('phpPages', function() {
  return gulp.src('development/pages/**/**.php', {base: 'development/pages'})
  .pipe(plumber())
  .pipe(gulp.dest(dest))
});


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
    mqpacker(), // TODO: Can somtimes break?
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
  .pipe(concat('all.js')) // concatenate all js into a single file
  .pipe(babel({ // convert latest js into browser ready js
    presets: ['latest']
  }))
  .pipe(gulpif(minify, uglify())) // js minifier
  .pipe(gulpif(useSourcemaps, sourcemaps.write()))
  .pipe(gulp.dest(limbo + 'js'));
});

// Rename assets based on content cache
gulp.task('sassRevisions', ['sass'], function() {
  return gulp.src(limbo + '**/**/**/*.css', { base: 'limbo/' })
    .pipe(plumber())
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest('assets/css/manifest.json'))
    .pipe(revDel({ dest, force: true })) // force: true so that revDel can delete files above itself
    .pipe(gulp.dest(dest));
});

// Rename assets based on content cache
gulp.task('jsRevisions', ['javascript'], function() {
  return gulp.src(limbo + '**/**/**/*.js', { base: 'limbo/' })
    .pipe(plumber())
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest('assets/js/manifest.json'))
    .pipe(revDel({ dest, force: true })) // force: true so that revDel can delete files above itself
    .pipe(gulp.dest(dest));
});

gulp.task('phpRevisions', ['phpClasses', 'phpFunctions', 'phpParts', 'phpSections', 'phpPages'], function() {
  return gulp.src(limbo + '**/**/**/*.php', { base: 'limbo/' })
    .pipe(plumber())
    .pipe(gulp.dest(dest));
});

gulp.task('imageoptim', function () {
  gulp.src(source + 'images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,ico}')
    .pipe(plumber())
    .pipe(image())
    .pipe(gulp.dest(imageDest));
});

// Watch everything and update
if (images == true) {
  gulp.task('watch', function () {
    gulp.watch(source + 'images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,svg,SVG,ico}', ['imageoptim']);
  });
  gulp.task('default', ['imageoptim', 'watch']);
} else {
  gulp.task('watch', function () {
    gulp.watch(source + '**/**/**/*.{css,scss}', ['sassRevisions']);
    gulp.watch(source + '**/**/**/*.js', ['jsRevisions']);
    gulp.watch(source + 'includes/classes/**/*.php', ['phpClasses']);
    gulp.watch(source + 'includes/functions/**/*.php', ['phpFunctions']);
    gulp.watch(source + 'includes/parts/**/*.php', ['phpParts']);
    gulp.watch(source + 'includes/sections/**/*.php', ['phpSections']);
    gulp.watch(source + 'pages/**/*.php', ['phpPages']);
  });
  gulp.task('default', ['sassRevisions', 'jsRevisions', 'phpClasses', 'phpFunctions', 'phpParts', 'phpSections', 'phpPages', 'watch']);
}
