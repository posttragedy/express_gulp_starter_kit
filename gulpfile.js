const gulp = require('gulp');
const babel = require("gulp-babel");
const gulpIf = require('gulp-if');
const sourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const del = require('del');
const config = require('./config');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

  //Service operations
gulp.task("clean", function(cb) {
  return del(['public/js/*', 'public/css/*']);
});

gulp.task('b-reload', function(cb) {
  browserSync.reload();
  cb();
});


  //Front-end scripts
gulp.task("javascripts", function () {
  return gulp.src("dev_assets/js/*.js")
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulpIf(isDevelopment, sourcemaps.write(".")))
    .pipe(gulp.dest("public/js"))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: 7000,
    });
});


  //Front-end styles
gulp.task('styles', function() {
  return gulp.src('dev_assets/sass/*.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({ stream: true }))
});

  //Watchers
gulp.task('watch', function() {
  gulp.watch('dev_assets/sass/main.scss', gulp.series('styles'));
  gulp.watch('dev_assets/js/*.js', gulp.series('javascripts'));
  gulp.watch('views/**/*', gulp.series('b-reload'));
});
gulp.task('nodemon', function () {
  return nodemon({
    script: './bin/www',
    ext: 'js',
    ignore: ['dev_assets/**/*', 'node_modules/**/*', 'gulpfile.js', 'public/**/*'],
    env: { 'NODE_PATH': '.' }
  }).on('start', function(){
    setTimeout(browserSync.reload, 300)
  });
});


gulp.task('start', gulp.series(
  gulp.parallel("javascripts", "styles"),
  gulp.parallel('watch', 'nodemon', 'browser-sync')));

