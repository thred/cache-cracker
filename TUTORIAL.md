## The Basics

Create a directory and and a new node project by executing `npm init`. Create a `README.md` file. 
Initialize GIT with `git init`. 

## Gulp

Let's use [Gulp](http://gulpjs.com/) as build-tool.

If you haven't done so, install the Gulp command-line interface with `npm install --global gulp-cli`
(as root/admin). Then add the necessary Gulp dependencies to the project:

* `npm install gulp --save-dev` to add and install the basic dependency
* `npm install gulp-connect --save-dev` to add and install a handy server to development

Add `node_modules` to `.gitignore` with: `echo node_modules/ >> .gitignore`.

First create a page to serve. Create a `src` folder and a basic `src/index.html`:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>cache-cracker</title>
    </head>
    <body>
        <h1>cache-cracker</h1>
    </body>
    </html>

Create the basic `gulpfile.js`:

    var connect = require("gulp-connect");
    var gulp = require("gulp");

    gulp.task("build", ["html"]);

    gulp.task("connect", function() {
        connect.server({
            root: "dist",
            port: 8080
        });
    });

    gulp.task("html", function() {
        return gulp.src("./src/index.html").pipe(gulp.dest("./dist"));
    });

    gulp.task("watch", ["build", "connect"], function() {
        gulp.watch("./src/index.html", ["html"]);
    });

**Try it:** Execute `gulp watch` to build and start the server.

## TypeScript

If you haven't done so, install TypeScript globally with `npm install --global typescript`.
Add the local development dependency, too: `npm install typescript --save-dev`.

First create a file to compile. Create the file `src/script/cache-cracker.ts`: 

    namespace cachecracker {
        window.console.log("cache-cracker");
    }
    
Create a `tsconfig.json` by executing `tsc --init --outDir dist/script --rootDir src/script src/script/cache-cracker.ts`.

**Try it:** Execute `tsc`. It should create the file `dist/script/cache-cracker.js`.

You may wish to add the `dist` directory to the .gitignore, but this is no necessarity.

To automize the build open the `tsconfig.json` and add the `filesGlob` section:

    "filesGlob": [
        "./src/script/**/*.ts",
        "./src/script/**/*.tsx"
    ]

> If you are using Atom, you may find this helpful, too:
>   
>     "atom": {
>         "rewriteTsconfig": true
>     }
  
Add some more development dependencies:

* `npm install gulp-concat --save-dev`
* `npm install gulp-sourcemaps --save-dev`
* `npm install gulp-typescript --save-dev`

In the `gulpfile.js`, let's use these dependencies:

    var concat = require("gulp-concat");
    var sourcemaps = require("gulp-sourcemaps");
    var ts = require("gulp-typescript");

It should read the `tsconfig`:

    var tsconfig = require("tsconfig.json");
    var tsProject = ts.createProject("tsconfig.json", {
        sortOutput: true
    });

Add the TypeScrpt task:

    gulp.task("ts", function() {
        var tsSources = tsProject.src()
            .pipe(ts(tsProject)).js;

        return tsSources
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(concat("cache-cracker.js"))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
    });

Add it to the build task:

    gulp.task("build", ["html", "ts"]);

And enhance the watch task:

    gulp.watch(tsconfig.filesGlob, ["ts"]);

Additional you can add `gulp watch` command as start script to the `package.json` (you can
run it with `npm start`).

> A note for Visual Studio Code users: As `filesGlob` is no standard, this editor does not support it.
> If you are using it, you can add the `tsconfig-glob` development dependency (`npm install tsconfig-glob --save-dev`).
> Then add following task in the `gulpfile.js`:
> 
>     var tsGlob = require("tsconfig-glob");
> 
>     gulp.task("ts-glob", function() {
>         return tsGlob({
>             configPath: ".",
>             indent: 4
>         });
>     });
> 
> Add it as dependency to the `ts` task. It will rewrite `files` section in the `tsconfig.json`.

Start `gulp watch` now. It will build the project. Add the following line to the `head` element in the `index.html`:

    <script src="script/cache-cracker.js"></script>

**Try it:** Start a browser to https://localhost:8080 and check the browsers console. It should write: `cache-cracker`.

## JQuery, Bootstrap and React 

Now, let's add some libraries. [JQuery](https://jquery.com/) for fast DOM manipulations, 
[Bootstrap](http://getbootstrap.com/) for a nice look and feel, and [React](https://facebook.github.io/react/)
for the simple components. First, add the dependencies: 

* JQuery: `npm install jquery --save`.
* Bootstrap: `npm install bootstrap --save`.
* React: `npm install react --save` and `npm install react-dom --save`.

We will put all these dependencies into a common lib file. Add a `libs` array to the `gulpfile.js`:

    var libs = [
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/react/dist/react.min.js",
        "./node_modules/react/dist/react-dom.min.js"
    ];

And add a task to concat these files:

    gulp.task("lib", function() {
        return gulp.src(libs)
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(concat("libs.js"))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
    });

...that you add to the `build` task:

    gulp.task("build", ["html", "lib", "ts"]); 

Finally reference the file in the `index.html`, before the `cache-cracker.js`:

    <script src="script/libs.js"></script>

Bootstrap needs some more dependencies, it comes with CSS and font files.



To use these libraries with TypeScript, add the necessary type definitions. If you haven't done so, 
install the [TypeScript Definition Manager](https://github.com/typings/typings)
with `npm install typings --global` (as root/admin). Add de local development dependency, too:
`npm install typings --save-dev`. Now, add the type definitions:

* `typings install jquery --ambient --save`
* `typings install bootstrap --ambient --save`
* `typings install react --ambient --save`
* `typings install react-dom --ambient --save`

> We still have to use the --ambient flag to use the old DefinitelyTyped repository. This may change 
> in future it by any time typings gets stable.

To use these typings, create a `refs.d.ts` in you script folder and the reference to it:

    /// <reference path="../../typings/browser.d.ts" />
    
We will use this file for sorting the typescript files, too. So let's add the `cache-cracker.ts`:

    /// <reference path="cache-cracker.ts" />

And reference the file in all other files:

    /// <reference path="refs.d.ts" />





I HATE MODULES!



... TO BE CONTINUED