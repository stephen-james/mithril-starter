'use strict';

var path = require('path');
var gulp = require('gulp');
var common = require('./common');

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('inject', ['scripts', 'styles'], function () {
    var injectStyles = gulp.src([
        path.join(common.paths.tmp, '/serve/app/**/*.css'),
        path.join('!' + common.paths.tmp, '/serve/app/vendor.css')
    ], { read: false });

    var injectScripts = gulp.src([
        path.join(common.paths.src, '/app/**/*.module.js'),
        path.join(common.paths.src, '/app/**/*.js'),
        path.join('!' + common.paths.src, '/app/**/*.spec.js'),
        path.join('!' + common.paths.src, '/app/**/*.mock.js')
    ]);

    var injectOptions = {
        ignorePath: [common.paths.src, path.join(common.paths.tmp, '/serve')],
        addRootSlash: false
    };

    return gulp.src(path.join(common.paths.src, '/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(_.extend({}, common.wiredep)))
        .pipe(gulp.dest(path.join(common.paths.tmp, '/serve')));
});
