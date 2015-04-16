require('babel/register');

const _ = require('lodash');
const del = require('del');
const to5 = require('babelify');
const resolve = require('resolve');
const argv = require('yargs').argv;
const path = require('path');
const watchify = require('watchify');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

const gulp = require('gulp');
const _if = require('gulp-if');
const less = require('gulp-less');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const stylish = require('jshint-stylish');
const minifycss = require('gulp-minify-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const webserver = require('gulp-webserver');

const production = !!argv.production;
const development = !production;
const release = !!argv.release;

const DEST_DIR = release ? './public' : './dist';
const IGNORED_PACKAGES = ['bootstrap', 'express', 'request', 'compression'];

process.env.NODE_ENV = production ? 'production' : 'development';

const paths = {
  js: {
    src: './src/js/**/*.js',
    main: './src/js/app.js',
    name: {
      app: 'app.js',
      vendor: 'vendor.js'
    },
    tests: './test/*.js',
    dest: path.join(DEST_DIR, 'js')
  },
  html: {
    index: './src/index.html',
    dest: DEST_DIR
  },
  less: {
    src: './src/less/app.less',
    dest: path.join(DEST_DIR, 'css'),
    libPaths: ['./node_modules/bootstrap/less']
  }
};

function bundle(reload) {
  var b;
  if (!reload) {
    b = browserify({debug: development});
  } else {
    b = browserify({
      debug: development, cache: {},
      packageCache: {}, fullPaths: true
    });
  }
  return b.transform(to5);
}

function buildJs(b, destination) {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(destination))
    .pipe(buffer())
    .pipe(_if(development, sourcemaps.init({loadMaps: true})))
    .pipe(_if(production, uglify()))
    .pipe(_if(development, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.js.dest));
}

function buildAppJs(b) {
  b.add(paths.js.main);
  getNPMPackageIds().forEach(function (id) {
    b.external(id);
  });
  return buildJs(b, paths.js.name.app);
}

function buildVendorJs(b) {
  getNPMPackageIds().forEach(function (id) {
    b.require(resolve.sync(id), {expose: id});
  });
  return buildJs(b, paths.js.name.vendor);
}

gulp.task('js:app:build', ['js:lint'], function () {
  var b = bundle(false);
  buildAppJs(b);
});

gulp.task('js:app:watch', ['js:lint'], function () {
  var b = watchify(bundle(true));

  b.on('update', function () {
    buildJs(b, paths.js.name.app);
  });

  b.on('log', function (msg) {
    gutil.log(msg);
  });

  return buildAppJs(b);
});

gulp.task('js:app:test', ['js:lint'], function () {
  return gulp.src(paths.js.tests, {read: false})
    .pipe(mocha())
    .on('error', function() {
      this.emit('end');
    });
});

gulp.task('js:vendor:build', function () {
  var b = bundle(false);
  return buildVendorJs(b);
});

gulp.task('js:lint', function () {
  return gulp.src([paths.js.src, paths.js.tests])
    .pipe(babel())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('html:copy', function () {
  return gulp.src(paths.html.index)
    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('clean', function (cb) {
  del([path.join(DEST_DIR, '**/*')], cb);
});

gulp.task('less', function () {
  return gulp.src(paths.less.src)
    .pipe(_if(development, sourcemaps.init()))
    .pipe(less({
      paths: paths.less.libPaths
    }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(_if(production, minifycss()))
    .pipe(_if(development, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.less.dest));
});

gulp.task('build', ['clean', 'html:copy', 'less',
  'js:vendor:build', 'js:app:build', 'js:app:test']);

gulp.task('watch', ['clean', 'html:copy', 'less',
  'js:vendor:build', 'js:app:watch', 'js:app:test'], function () {
  gulp.watch(paths.html.index, ['html:copy']);
  gulp.watch([paths.js.src, paths.js.tests], ['js:lint']);
  gulp.watch(paths.js.tests, ['js:app:test']);
  gulp.watch(paths.less.src, ['less']);
});

gulp.task('serve', ['watch'], function () {
  gulp.src(DEST_DIR)
    .pipe(webserver({
      livereload: true,
      open: true,
      proxies: [
        {
          source: '/base64',
          target: 'http://localhost:3000/base64'
        }
      ]
    }));
});

gulp.task('default', ['build']);


function getNPMPackageIds() {
  var manifest = {};
  try {
    manifest = require('./package.json');
  } catch (e) {
  }

  const packages = _.without.apply(
    this, [_.keys(manifest.dependencies) || []].concat(IGNORED_PACKAGES)
  );
  packages.push('react/addons');
  return packages;
}
