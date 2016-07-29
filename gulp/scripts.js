'use strict';

import gulp from 'gulp';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import bowerResolve from 'rollup-plugin-bower-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

gulp.task('scripts', () => {

    return rollup({
        entry: 'src/app/index.js',
        sourceMap: true,
        plugins: [
            nodeResolve({
                jsnext: true,
                main: true,
                browser: true,
                skip: [
                  // add other bower dependencies here
                  'mithril'
                ],
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
            dest: 'dist/main.js'
        });
    });

    //// point to the entry file.
    //// if you want to output with a different name, rename it at the end using gulp-rename.
    //.pipe(source('index.js', './src/app'))
    //// buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
    //.pipe(buffer())
    //// tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
    //.pipe(sourcemaps.init({loadMaps: true}))
    //// transform the code further here.
    //// write the sourcemap alongside the output file.
    //.pipe(sourcemaps.write('.'))
    //// and output to ./dist/main.js as normal.
    //.pipe(rename("gulp-pipeline.es6.js"))
    //.pipe(gulp.dest('./dist'));

});

