'use strict';

import gulp from 'gulp';
import gulpUtil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import path from 'path';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import bowerResolve from 'rollup-plugin-bower-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import runSequence from 'run-sequence';
import map from 'map-stream';
import browserSync from 'browser-sync';

import common from './gulp/common';
import build from './gulp/build';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var config = {
    bundle: 'scripts/app.js',
    wiredep: {
        exclude: [/jquery/],
        directory: 'bower_components'
    },
    bower: {
        // list all bower dependencies here to exclude them from script rollup as node modules
        deps: [
            'mithril'
        ]
    },
    autoprefixer: {
        browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
        ]
    }
};

// Build production files as default task
gulp.task('default', ['clean'], done =>
        runSequence(
            'styles',
            [
                //'lint',
                'html',
                'scripts' //,
                //'images',
                //'copy'
            ],
            done
        )
);

gulp.task('clean', () => del([
        path.join(common.paths.dist, '/'),
        path.join(common.paths.tmp, '/')
    ], {
        dot: true
    })
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
    //For best performance, don't add Sass partials to `gulp.src`
    return gulp.src([
        'app/**/*.scss',
        'app/**/*.css'
    ])
        .pipe($.newer('.tmp/styles'))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(config.autoprefixer.browsers))
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano({ zindex: false })))
        .pipe($.size({ title: 'styles' }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/styles'));
});


// Scan your HTML for assets & optimize them
gulp.task('html', () => {
    return gulp.src('app/**/*.html')
        // Minify any HTML
        .pipe($.if('*.html', $.htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeOptionalTags: true
        })))
        // Output files
        .pipe($.if('*.html', $.size({
            title: 'html',
            showFiles: true
        })))
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
    return rollup({
        entry: 'app/index.js',
        sourceMap: true,
        plugins: [
            nodeResolve({
                jsnext: true,
                main: true,
                browser: true,
                skip: config.bower.deps,
                extensions: ['.js', '.json']
            }),
            bowerResolve(),
            commonjs(),
            babel({
                babelrc: false,
                presets: ['es2015-rollup']
            }),
            uglify()
        ]
    }).then((bundle) => {
        return bundle.write({
            sourceMap: true,
            dest: 'dist/' + config.bundle
        });
    });
});

// Build and serve the output from the dist build
gulp.task('serve', ['default'], () => {
    browserSync({
        server: 'dist',
        port: 3001
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/**/*.js'], ['scripts', reload]);
    gulp.watch(['app/**/*.{gif,jpg,png}'], reload);
});


function errHandler(title) {
    return function (err) {
        gulpUtil.log(gulpUtil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
}