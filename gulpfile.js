
var concat = require("gulp-concat");
var connect = require("gulp-connect");
var del = require("del");
var gulp = require("gulp");
var merge = require('merge-stream');
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var tsGlob = require("tsconfig-glob");

var tsconfig = require("./tsconfig.json");
var tsProject = ts.createProject("./tsconfig.json", {
    sortOutput: true
});

var cssLibs = [
    "./node_modules/bootstrap/dist/css/bootstrap.min.css"
];

var fontLibs = [
    "./node_modules/bootstrap/dist/fonts/*"
];

var jsLibs = [
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/bootstrap/dist/js/bootstrap.min.js",
    "./node_modules/react/dist/react.min.js",
    "./node_modules/react/dist/react-dom.min.js"
];

gulp.task("build", ["html", "lib", "ts"]);

gulp.task("clean", function() {
    return del("dist/**/*");
});

gulp.task("connect", function() {
    connect.server({
        root: "dist",
        port: 8080
    });
});

gulp.task("html", function() {
    return gulp.src("./src/index.html").pipe(gulp.dest("./dist"));
});

gulp.task("lib", function() {
    var cssLibsStream = gulp.src(cssLibs)
        .pipe(concat("libs.css"))
        .pipe(gulp.dest("./dist/css"));

    var fontLibsStream = gulp.src(fontLibs)
        .pipe(gulp.dest("./dist/fonts"));

    var jsLibsStream = gulp.src(jsLibs)
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat("libs.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));

    return merge(cssLibsStream, fontLibsStream, jsLibsStream);
});

gulp.task("ts", ["ts-glob"], function() {
    var tsSources = tsProject.src()
        .pipe(ts(tsProject)).js;

    return tsSources
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat("cache-picker.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});

gulp.task("ts-glob", function() {
    return tsGlob({
        configPath: ".",
        indent: 4
    });
});

gulp.task("watch", ["build", "connect"], function() {
    gulp.watch("./src/**/*.html", ["html"]);
    gulp.watch(tsconfig.filesGlob, ["ts"]);
});

