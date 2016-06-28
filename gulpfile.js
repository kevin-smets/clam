const debug = require('gulp-debug');
const gls = require('gulp-live-server');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');

var server = gls.static('www', 8080);

gulp.task('serve', function () {
    server.start();
});

gulp.task("copy", function () {
    return gulp.src(["src/**/*.js", "src/**/*.html", "src/**/*.css"])
        .pipe(gulp.dest('www'))
        .pipe(debug({title: 'copy-out: '}))
});

gulp.task("sass", function () {
    return gulp.src("src/**/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('www'))
        .pipe(debug({title: 'sass-out: '}))
});

gulp.task('watch', function () {
    console.log('watching');
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch(['src/**/*.html', 'src/**/*.js', "src/**/*.css"], ['copy']);
    gulp.watch(['www/**/*.css', 'www/**/*.html', 'www/**/*.js'], function (file) {
        server.notify.apply(server, [file]);
    });
});

gulp.task('default', function (callback) {
    runSequence(
        ['copy', 'sass'],
        'serve',
        'watch',
        callback);
});