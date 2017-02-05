'use strict';

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

gulp.task('wiredep:client', function () {
    gulp.src('app/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('app'));
});

gulp.task('developing', cb => {
    runSequence([
        'wiredep:client'
    ], cb);
});