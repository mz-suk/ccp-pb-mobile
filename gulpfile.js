const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const del = require("del");

const assets = "./assets/";

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

  gulp.watch([assets + "css/**/*", "html/**/*"], browserReload);
}

exports.build = gulp.series(
  del(assets + "css/"),
  gulp.parallel(() => cssTask("*", true))
);
exports.default = gulp.parallel(watchFiles, browser);
