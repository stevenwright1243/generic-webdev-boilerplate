# Web Design Template
This is a website template leveraging tools like NPM, Gulp, Sass, babel, a small css framework based off of flexbox, and sectioning off parts of the website on the server side with php

requires that gulp be globally installed with node/NPM via `npm install -g gulp`

eslint and sass-lint can be used through atom packages https://github.com/AtomLinter/linter-eslint and https://atom.io/packages/linter-sass-lint using https://github.com/steelbrain/linter

If not using atom, then these must be globally installed and ran through the node command line, unless there is a plugin for your code editor that supports them.

### Run with command `gulp` in node terminal
---


## Usage
### Sass
Sass files are separated by the following
- fonts/fonts.scss, a file to hold font data from http://www.localfont.com/
- modules, a directory that holds the css framework
- parts, a directory that holds custom sass for sections of a website (Think one file for the header, another for the footer, etc.)
- utilities, a directory similar to modules but for custom sass that isn't framework or section related
- Standalone files that are not in a directory, for compiling all of the sass into single files
Add your standalone files to the sassArray in Gulpfile.js to compile them into usable css

### Javascript
Latest Javascript can be used because of babel
Separate your Javascript files by parts (example: one file for jQuery libray, another for scroll to top function, another for form animations, etc.) and add them into the jsArray in Gulpfile.js to concatenate them for production

### Gulpfile.js
- variable 'source' is the path to the sass and js development folder
- variable 'limbo' is a temporary folder used for file revisioning
- variable 'dest' is the path to the production folder
- variable useSourcemaps can be set to true to enable sourcemaps for sass and Javascript(Can slow down Gulp tasks)
- variable minify can be set to true to enable minification of css and js(Can slow down Gulp tasks)
- variable sassArray is an array of the paths of sass files to be piped through Gulp
- variable jsArray is an array of the paths of Javascript files to be piped through Gulp
- variable removeUnusedcss can be set to true to remove unused css, but depends on pageArray
- variable pageArray is an array of pages (prefer urls) that will be scanned to remove unused css
- variable images can be set to true to enable optimization of images (Prevents other tasks)

### FileRev
Inside includes/classes is a FileRev.php file that handles file revisioning server side as css and js files will be appended with a random string of numbers to break cacheing whenever a file is updated.

css: `<link rel="stylesheet" href="<?php echo FileRev::rev('assets/css/styles.css'); ?>">`

js: `<script src="<?php echo FileRev::rev('assets/js/all.js'); ?>"></script>`

or to add files to specific pages

```php
<?php
  // Set an array of pages that we want to include an additional css file on
  $alt_pages = [
    'contact',
    'about'
  ];

  echo FileRev::rev('assets/css/other.css', $alt_pages);

  // or

  echo FileRev::rev('assets/css/other.css', ['contact', 'about']);

  // js works as well

  echo FileRev::rev('assets/js/all.js', $alt_pages);

  // also valid

  $alt_pages = [
    'contact.php',
    'about.php'
  ]

  echo FileRev::rev('assets/css/other.css', ['contact.php', 'about.php']);

?>
```

### htaccess

#### Gzip
Enables gzip compression for the following:
- text/html
- text/css
- text/javascript
- text/xml
- text/plain
- image/x-icon
- image/svg+xml
- application/rss+xml
- application/javascript
- application/x-javascript
- application/xml
- application/xhtml+xml
- application/x-font
- application/x-font-truetype
- application/x-font-ttf
- application/x-font-otf
- application/x-font-opentype
- application/vnd.ms-fontobject
- font/ttf
- font/otf
- font/opentype

#### Caching
Enables caching for 1 month on the following types of files:
- jpg/jpeg
- png
- gif
- svg
- css
- js

1 year:
- Favicons

#### ETags
Removes ETags because they're apparently bad for performance and will decrease yslow score on GTmetrix https://gtmetrix.com/configure-entity-tags-etags.html

#### Rewrites
- 404s to homepage
- Trailing slash to no trailing slash (ex: contact-us/ to contact-us)
- Remove php/html extensions from pages (ex: contact-us.php to contact-us)
- Turn homepage/index into just homepage
  - Force https/www (default)
  - Force https/no www
  - Force http/www
  - Force http/no www


### Technologies used
- [Sass](http://sass-lang.com/) (css with superpowers)
- Small css framework
  - Uses [Normalize.css](https://github.com/necolas/normalize.css), [Flexbox Grid](https://github.com/kristoferjoseph/flexboxgrid), and [Skeleton.css](https://github.com/dhg/Skeleton) (Minus the grid)
- [babel](https://babeljs.io/) (Javascript compiler)
- [ESlint](http://eslint.org/) (Javascript linting)
- [Sass lint](https://github.com/sasstools/sass-lint) (sass linting)
- [Gulp](https://github.com/gulpjs/gulp) (Build tool)
  - css
    - Compiles sass
    - Automatically remove unused css
    - Automatically adds vendor prefixes
    - Automatically fixes IE 10-11 flexbox bugs
  - Javascript
    - Compiles next generation Javascript
  - css & js
    - Keep development files separate
    - Automatically concatenate files for production to save requests
    - Automatically minify files
    - Automatically handle file revisions
    - Automatically create sourcemaps
    - Watches files and automatically re-runs tasks on file updates
  - Automatically optimize JPG, PNG, GIF, and SVG


### Packages
- [babel-eslint: ^7.1.1](https://www.npmjs.com/package/babel-eslint)
- [babel-preset-latest: ^6.22.0](https://www.npmjs.com/package/babel-preset-latest)
- [css-mqpacker: ^5.0.1](https://www.npmjs.com/package/css-mqpacker)
- [cssnano: ^3.10.0](https://www.npmjs.com/package/cssnano)
- [eslint: ^3.14.0](https://www.npmjs.com/package/eslint)
- [eslint-config-airbnb-base: ^11.0.1](https://www.npmjs.com/package/eslint-config-airbnb-base)
- [eslint-plugin-babel: ^4.0.1](https://www.npmjs.com/package/eslint-plugin-babel)
- [eslint-plugin-flowtype: ^2.30.0](https://www.npmjs.com/package/eslint-plugin-flowtype)
- [eslint-plugin-import: ^2.2.0](https://www.npmjs.com/package/eslint-plugin-import)
- [gulp: ^3.9.1](https://www.npmjs.com/package/gulp)
- [gulp-autoprefixer: ^3.1.1](https://www.npmjs.com/package/gulp-autoprefixer)
- [gulp-babel: ^6.1.2](https://www.npmjs.com/package/gulp-babel)
- [gulp-concat: ^2.6.1](https://www.npmjs.com/package/gulp-concat)
- [gulp-if: ^2.0.2](https://www.npmjs.com/package/gulp-if)
- [gulp-image: ^2.7.3](https://www.npmjs.com/package/gulp-image)
- [gulp-plumber: ^1.1.0](https://www.npmjs.com/package/gulp-plumber)
- [gulp-postcss: ^6.3.0](https://www.npmjs.com/package/gulp-postcss)
- [gulp-rev: ^7.1.2](https://www.npmjs.com/package/gulp-rev)
- [gulp-rev-replace: ^0.4.3](https://www.npmjs.com/package/gulp-rev-replace)
- [gulp-sass: ^3.1.0](https://www.npmjs.com/package/gulp-sass)
- [gulp-sourcemaps: ^2.4.0](https://www.npmjs.com/package/gulp-sourcemaps)
- [gulp-uglify: ^2.0.0](https://www.npmjs.com/package/gulp-uglify)
- [gulp-uncss: ^1.0.6](https://www.npmjs.com/package/gulp-uncss)
- [postcss-flexbugs-fixes: ^2.1.0](https://www.npmjs.com/package/postcss-flexbugs-fixes)
- [rev-del: ^1.0.5](https://www.npmjs.com/package/rev-del)
- [sass-lint: ^1.10.2](https://www.npmjs.com/package/sass-lint)

### Notes
- The revisioning for CSS and JS files are different because of performance. Gulp will recompile Sass if you edit Javascript and vice versa if the revisioning task is in the same task.
