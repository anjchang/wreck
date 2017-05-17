var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var watchify = require('watchify')
var gutil = require("gulp-util");
var paths = {
    pages: ['src/html/*.html']
};

var myBrowserify = browserify({
    basedir: 'src/typescript',
    debug: true,
    entries: ['box_geometry.ts', 'commands.ts', 'datatypes.ts', 'jquery.terminal.d.ts', 'main.ts', 'items.ts', 'world.ts', 'world_update_effects.ts'],
    cache: {},
    packageCache: {}
});


// var watchedBrowserify = watchify(browserify({
//     basedir: 'src/typescript',
//     debug: true,
//     entries: ['box_geometry.ts', 'commands.ts', 'datatypes.ts', 'items.ts', 'world.ts', 'world_update_effects.ts'],
//     cache: {},
//     packageCache: {}
// }));

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

function bundle() {
    return myBrowserify
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
};

gulp.task('default', ['copyHtml'], bundle);
myBrowserify.on("update", bundle);
myBrowserify.on("log", gutil.log);
//myBrowserify.on("error", gutil.log);