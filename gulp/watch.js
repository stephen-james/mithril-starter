'use strict';

var path = require('path');
var gulp = require('gulp');
var common = require('./common');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

    gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

    gulp.watch([
        path.join(common.paths.src, '/app/**/*.css'),
        path.join(common.paths.src, '/app/**/*.scss')
    ], function(event) {
        if(isOnlyChange(event)) {
            gulp.start('styles');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(path.join(common.paths.src, '/app/**/*.js'), function(event) {
        if(isOnlyChange(event)) {
            gulp.start('scripts');
        } else {
            gulp.start('inject');
        }
    });

    gulp.watch(path.join(common.paths.src, '/app/**/*.html'), function(event) {
        browserSync.reload(event.path);
    });
});
