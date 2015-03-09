var _ = require('lodash');
var del = require('del');
var to5 = require('babelify');
var resolve = require('resolve');
var argv = require('yargs').argv;
var path = require('path');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var gulp = require('gulp');
var _if = require('gulp-if');
var less = require('gulp-less');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var webserver = require('gulp-webserver');


var production = !!argv.production;
var development = !production;
var release = !!argv.release;
var DEST_DIR = release ? './public' : './dist';

process.env.NODE_ENV = production ? 'production' : 'development';

var paths = {
  js: {
    src: './src/js/**/*.js',
    main: './src/js/app.js',
    name: {
      app: 'app.js',
      vendor: 'vendor.js'
    },
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

gulp.task('js:vendor:build', ['clean'], function () {
  var b = bundle(false);
  return buildVendorJs(b);
});

gulp.task('js:lint', function () {
  return gulp.src(paths.js.src)
    .pipe(babel())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('html:copy', ['clean'], function () {
  return gulp.src(paths.html.index)
    .pipe(gulp.dest(paths.html.dest));
});

gulp.task('clean', function (cb) {
  del([path.join(DEST_DIR, '**/*')], cb);
});

gulp.task('less', ['clean'], function () {
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

gulp.task('build', ['clean', 'html:copy', 'less', 'js:vendor:build', 'js:app:build']);

gulp.task('watch', ['clean', 'html:copy', 'less', 'js:vendor:build', 'js:app:watch'], function () {
  gulp.watch(paths.html.index, ['html:copy']);
  gulp.watch(paths.js.src, ['js:lint']);
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
          target: 'http://localhost:' + process.env.PORT + '/base64'
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

  var packages = _.without(_.keys(manifest.dependencies) || [], 'bootstrap', 'express', 'request');
  packages.push('react/addons');
  return packages;
}
