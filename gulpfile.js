var gulp = require('gulp'),
    less = require('gulp-less'),
    connect = require('gulp-connect');

gulp.task('styles', function() {
  gulp.src('styles.less')
    .pipe(less())
    .pipe(gulp.dest('build/'));
});

gulp.task('serve', function() {
  connect.server({
    port: 3000
  });
});

gulp.task('default', ['styles']);

gulp.task('watch', ['styles', 'serve'], function() {
  gulp.watch('styles.less', ['styles']);
});

