const gulp = require('gulp'), //Gulp dep.
    browserSync = require('browser-sync').create(), //LiveReload
    pug = require('gulp-pug'), //Pug
    sass = require('gulp-sass')(require('sass')), //SCSS
    fileinclude = require('gulp-file-include'), //File include (Modules)
    autoprefixer = require('gulp-autoprefixer'), //Autoprefixer for all browsers
    cleanCSS = require('gulp-clean-css'), //CSS minify
    imagemin = require('gulp-imagemin'), //Minify PNG, JPEG, GIF and SVG images with imagemin
    babel = require('gulp-babel'); //Transpiler for JavaScript

const src = '#src/',
    dist = 'dist/';

const config = {
    src: {
        html: src + 'pug/*.pug',
        style: src + 'scss/*.scss',
        js: src + 'js/*.js',
        fonts: src + 'fonts/**/*.*',
        img: src + 'img/**/*.*',
    },
    dist: {
        html: dist,
        style: dist + 'css/',
        js: dist + 'js/',
        fonts: dist + 'fonts/',
        img: dist + 'img',
    },
    watch: {
        html: src + 'pug/**/*.pug',
        style: src + 'scss/**/*.*',
        js: src + 'js/**/*.js',
        fonts: src + 'fonts/**/*.*',
        img: src + 'img/**/*.*',
    }
}

const webServer = () => {
    browserSync.init({
        server: {
            baseDir: dist,
        },
        port: 9000,
        host: 'localhost',
        notify: true,
    })
}

const pugTask = () => {
    return gulp.src(config.src.html)
        .pipe(pug())
        .pipe(pug({
            pretty: true,
        }))
        .pipe(gulp.dest(config.dist.html))
        .pipe(browserSync.reload({ stream: true }))
}

const scssTask = () => {
    return gulp.src(config.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(config.dist.style))
        .pipe(cleanCSS({
            level: {
                2: {
                    all: true,
                }
            }
        }))
        .pipe(gulp.dest(config.dist.style))
        .pipe(browserSync.reload({ stream: true }))
}

const jsTask = () => {
    return gulp.src(config.src.js)
        .pipe(fileinclude())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(config.dist.js))
        .pipe(browserSync.reload({ stream: true }))
}

const fontsTask = () => {
    return gulp.src(config.src.fonts)
        .pipe(gulp.dest(config.dist.fonts))
        .pipe(browserSync.reload({ stream: true }))
}

const imgTask = () => {
    return gulp.src(config.src.img)
        .pipe(gulp.dest(config.dist.img))
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist.img))
        .pipe(browserSync.reload({ stream: true }))
}

const watchFiles = () => {
    gulp.watch([config.watch.html], gulp.series(pugTask));
    gulp.watch([config.watch.style], gulp.series(scssTask));
    gulp.watch([config.watch.js], gulp.series(jsTask));
    gulp.watch([config.watch.img], gulp.series(imgTask));
    gulp.watch([config.watch.fonts], gulp.series(fontsTask));
}

const allStart = gulp.series(pugTask, scssTask, jsTask, fontsTask, imgTask)

exports.default = gulp.parallel(allStart, watchFiles, webServer);