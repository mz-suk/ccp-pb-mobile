const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const del = require("del");
const replace = require("gulp-replace");

const assets = "./assets/";
const static = "./static/";

function browser(done) {
  browsersync.init({
    port: 3333,
    server: {
      baseDir: "./",
    },
  });
  done();
}
function browserReload(done) {
  browsersync.reload();
  done();
}

function cssTask(task, maps) {
  return gulp
    .src(assets + "style/" + task + ".scss", { sourcemaps: maps })
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(assets + "css/", { sourcemaps: maps }));
}

function watchFiles() {
  gulp.watch(
    assets + "style/**/*",
    gulp.series(() => cssTask("*", true))
  );

  gulp.watch([assets + "style/**/*", "html/**/*"], browserReload);
}

function buildMoveImg() {
  return gulp.src(assets + "img/**/*").pipe(gulp.dest(static + "img/"));
}
function buildMoveFont() {
  return gulp.src(assets + "font/**/*").pipe(gulp.dest(static + "font/"));
}
function buildConvertCss() {
  console.log("buildConvertCss");

  return gulp
    .src(assets + "style/**/*")
    .pipe(replace("../../assets/", "~assets/"))
    .pipe(gulp.dest(static + "css/"));
}

exports.clear = gulp.series(() => del(static));
exports.build = gulp.parallel(buildMoveImg, buildMoveFont, buildConvertCss);
exports.default = gulp.parallel(watchFiles, browser);
