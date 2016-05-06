var gulp = require("gulp");
var gulpBabel = require("gulp-babel");
var gulpChanged = require("gulp-changed");
var gulpConcat = require("gulp-concat");
var gulpConnect = require("gulp-connect");
var gulpDel = require("del");
var gulpMocha = require("gulp-mocha");
var gulpSourceMaps = require("gulp-sourcemaps");
var gulpTypeScript = require("gulp-typescript");
var gulpPrint = require("gulp-print");
var webpack = require("webpack-stream");

var tsconfig = require("./tsconfig.json");

var css = [
    "./src/style/cache-cracker.css"
];

var cssLibs = [
    "./src/style/material-design-icons.css",
    "./node_modules/materialize-css/dist/css/materialize.css"
];

var fontLibs = [
    "./node_modules/materialize-css/dist/fonts/**/*",
    "./node_modules/material-design-icons/iconfont/MaterialIcons-*"
];

var javascriptLibs = [
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/materialize-css/dist/js/materialize.min.js"
];

var typescriptProject = gulpTypeScript.createProject(require("./tsconfig.json").compilerOptions);

gulp.task("clean", function() {
    return gulpDel(["./dist/**/*", "./build/**/*"]);
});

gulp.task("default", ["lib", "build"]);

gulp.task("build", ["build:static", "build:css", "build:webpack"]);

gulp.task("build:static", function() {
    return gulp.src(["./src/**/*.html", "./src/**/*.jpg", "./src/**/*.png"])
        .pipe(gulp.dest("./dist"));
});

gulp.task("build:css", function() {
    return gulp.src(css)
        .pipe(gulpConcat("cache-cracker.css"))
        .pipe(gulp.dest("./dist/style"));
});

gulp.task("build:typescript", function() {
    return gulp.src(["./src/**/*.ts", "./src/**/*.tsx"])
        .pipe(gulpChanged("./build/src", {
            extension: ".js"
        }))
        .pipe(gulpSourceMaps.init())
        .pipe(gulpTypeScript(typescriptProject))
        .js
        .pipe(gulpPrint(function(filepath) {
            return "  Building \'" + filepath + "\'...";
        }))
        .pipe(gulpSourceMaps.write({
            sourceRoot: "./src"
        }))
        .pipe(gulp.dest("./build/src"));
});

gulp.task("build:webpack", ["build:typescript"], function() {
    return gulp.src("./build/src/script/Main.js")
        .pipe(webpack({
            output: {
                filename: "cache-cracker.js"
            },
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel",
                    query: {
                        presets: ["react", "es2015", "stage-0"]
                    }
                }]
            }
        }))
        .pipe(gulp.dest("./dist/script"));
});

gulp.task("lib", ["lib:css", "lib:font", "lib:javascript"]);

gulp.task("lib:css", function() {
    return gulp.src(cssLibs)
        .pipe(gulp.dest("./dist/style"));
});

gulp.task("lib:font", function() {
    return gulp.src(fontLibs)
        .pipe(gulp.dest("./dist/fonts"));
});

gulp.task("lib:javascript", function() {
    return gulp.src(javascriptLibs)
        .pipe(gulp.dest("./dist/script"));
});

gulp.task("server", function() {
    gulpConnect.server({
        root: "dist",
        port: 80
    });
});

gulp.task("test", ["build:typescript"], function() {
    return gulp.src("./build/src/test/**/*Test.js")
        .pipe(gulpMocha({
            require: ["source-map-support/register"]
        }));
});

gulp.task("watch", ["build", "server"], function() {
    gulp.watch("./src/**/*.html", ["build:static"]);
    gulp.watch("./src/style/*.css", ["build:css"]);
    gulp.watch(["./src/script/**/*.ts", "./src/script/**/*.tsx"], ["build:webpack"]);
});