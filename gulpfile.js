var gulp          = require('gulp');
var notify        = require('gulp-notify');
var browserSync   = require('browser-sync').create();
var sass          = require('gulp-sass');
var concat        = require('gulp-concat');
var rename        = require('gulp-rename');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');

/*================================================================
 # HELPER
 ================================================================*/

function handleError(err) {
  var msg = 'Error: ' + err.message;

  console.error('Error', err.message);
  browserSync.notify('Error: ' + err.message);

  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  if (typeof this.emit === 'function') this.emit('end')
}

/*================================================================
 # TASK
 ================================================================*/

gulp.task('style', function() {
  return gulp.src('./src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      'sourceComments': false,
      'outputStyle': 'expanded'
    })).on('error', handleError)
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream({
      'once': true
    }));
});

gulp.task('script', function() {
  var srcs = [
    './bower_components/classlist/classList.js',
    './src/js/main.js',
  ];

  return gulp.src(srcs)
    .pipe(sourcemaps.init())
    .pipe(concat('fastest-slider.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream({
      'once': true
    }));
});

gulp.task('serve', function() {
  browserSync.init({
    'server': './',
    'open': true
  });

  gulp.watch('./src/sass/*.scss', ['style']);  
  gulp.watch('./src/js/*.js', ['script']);
  gulp.watch('./index.html', { interval: 500 }).on('change', browserSync.reload);
});

gulp.task('build', ['style', 'script']);
gulp.task('watch', ['serve']);
gulp.task('default', ['build']);
