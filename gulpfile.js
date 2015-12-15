'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('js:min', function () {
    return gulp.src('./source/**/*.js')
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest('./demo/js'));
});

gulp.task('js:copy', function () {
    return gulp.src('./source/**/*.js')
        .pipe(gulp.dest('./'));
});

gulp.task('js:demo-jquery', function () {
    return gulp.src('./bower_components/jquery/jquery.min.js')
        .pipe(gulp.dest('./demo/js'));
});

gulp.task('js:demo-bpopup', function () {
    return gulp.src('./bower_components/bPopup/jquery.bpopup.min.js')
        .pipe(gulp.dest('./demo/js'));
});

gulp.task('default', ['js:min', 'js:copy', 'js:demo-jquery', 'js:demo-bpopup']);