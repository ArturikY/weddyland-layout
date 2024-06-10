/*-- BUILD SETTINGS --*/
const OPTIMIZE_BUILD_CSS = true;

/*-- LIBS --*/
const gulp = require("gulp");
/* CLEAN */
const clean = require("gulp-clean");
const fs = require("fs"); //систменые функции
/* 
  HTML HANDLER 
  DOCS:
    htmlmin -> https://github.com/kangax/html-minifier?tab=readme-ov-file
    file-include -> https://github.com/haoxins/gulp-file-include
*/
const fileInclude = require("gulp-file-include");
const htmlMin = require('gulp-htmlmin');
/*
  SCSS 
  DOCS:
    sass(gulp) -> https://github.com/dlmanning/gulp-sass
    sass-glob -> https://github.com/mikevercoelen/gulp-sass-glob
*/
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
/*
  CSS 
  DOCS:
    group-css-media-queries -> https://github.com/avaly/gulp-group-css-media-queries
    sourcemaps -> https://github.com/gulp-sourcemaps/gulp-sourcemaps
    autoprefixer -> https://github.com/postcss/autoprefixer#options
    csso -> https://github.com/ben-eb/gulp-csso
*/
const sourceMaps = require("gulp-sourcemaps");
const csso = require('gulp-csso');
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const autoprefixer = require("gulp-autoprefixer");
/*
  JS 
  DOCS:
    webpack -> https://github.com/shama/webpack-stream
    babel -> https://babeljs.io/docs/options
*/
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
/*
  ASSETS
  DOCS:
    webp -> https://github.com/sindresorhus/gulp-webp
    imagemin -> https://github.com/sindresorhus/gulp-imagemin
*/
const imageWebp = require("gulp-webp");
const imageMin = require('gulp-imagemin');
/*
  LOCAL SERVER 
*/
const browserSync = require('browser-sync').create();
/*
  Additionally
*/
const changed = require("gulp-changed");

/*-- CONFIGS --*/
/* HTML */
const fileIncludeConfig = {
  prefix: "@@",
  basebath: "@file",
}
const htmlMinConfig = {
  collapseWhitespace: true, //Убирает пустое пространство между элементами
}
/* LOCAL SERVER */
const browserSyncConfig = {
  watch: true,
  server: {
      baseDir: "./build/",
  }
}


/* GULP TASKS */
/* Additionally */
gulp.task("image:dev", function(done) {
  /* РАБОТА С ИЗОБРАЖЕНИЯМИ ИЗ ПАПКИ ASSETS/IMG */
  /* 
   -->changed - позволяет исключить неизменившиеся файлы
   -->imageWebp - дублирует изображения в формате webp
   -->imageMin - оптимизирует размер изображения
  */
  return gulp
    .src("./src/assets/imgs/**/*") //Копируем изображения конвертируя в webp
    .pipe(changed("./build/img/"))
    .pipe(imageWebp())
    // .pipe(imageMin())
    .pipe(gulp.dest("./build/img/"))
    .pipe(gulp.src("./src/assets/imgs/**/*")) //Дублируем изображения не в webp
    .pipe(changed("./build/img/"))
    // .pipe(imageMin())
    .pipe(gulp.dest("./build/img/"));
})
gulp.task("move-asset:dev", function(done) {
  /* ПЕРЕМЕЩЕНИЕ ФАЙЛОВ ИЗ ПАПКИ ASSETS */
  gulp.src("./src/assets/icons/**/*").pipe(changed("./build/icon/")).pipe(gulp.dest("./build/icon/"));
  gulp.src("./src/assets/fonts/**/*").pipe(changed("./build/font/")).pipe(gulp.dest("./build/font/"));
  gulp.src("./src/assets/videos/**/*").pipe(changed("./build/video/")).pipe(gulp.dest("./build/video/"));
  gulp.src("./src/assets/files/**/*").pipe(changed("./build/file/")).pipe(gulp.dest("./build/file/"));
  done()
})
gulp.task('server:dev', function() {
  browserSync.init(browserSyncConfig);
});
/* Main */
gulp.task("clean:dev", function(done) {
  /* ОЧИСТКА ДИРЕКТОРИИ САЙТА */
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/").pipe(clean());
  }
  done()
})
gulp.task("template:dev", function() {
  /* РАБОТА С ФАЙЛАМИ ИЗ ПАПКИ TEMPLATES */
  /*
   -->changed позволяет исключить неизменившиеся файлы
   -->fileInclude позволяет собирать один html из других шаблонов с помощью директивы include
   -->htmlMin минифицирует html
  */
  return gulp
    .src([
      "./src/templates/**/*.html",
      "!./src/templates/comps/**/*.html",
    ])
    .pipe(changed("./build/", {hasChanged: changed.compareContents}))
    .pipe(fileInclude(fileIncludeConfig))
    // .pipe(htmlMin(htmlMinConfig))
    .pipe(gulp.dest("./build/"));
})
gulp.task("style-detail:dev", function() {

})
gulp.task("style:dev", function() {
  /* РАБОТА С ФАЙЛАМИ ИЗ ПАПКИ STYLES */
  /*
   -->changed - позволяет исключить неизменившиеся файлы
   -->sass - компилирует scss в css
   -->sourcemaps - !!! Все библиотеки используемые между функциями init() и write() sourcemap должны поддерживаться (AUTOPREFIXER и GROUPMEDIAQUERIES не поддерживаются)!!! создаёт исходные карты для css чтобы после компиляции из препроцессора была удобно ориентироваться в коде(для отладки
   -->groupCssMediaQueries - группирует css медиа запросы(не поддерживается sourcemaps)
   -->autoprefixer - добавляет теги с вендорными префиксами(не поддерживается sourcemaps) 
  */
  if (!OPTIMIZE_BUILD_CSS) {
  } else {
   return gulp
     .src([
      //  "./src/styles/index.scss",
       "./src/styles/**/*.scss",
      // "./src/styles/review.scss", //Чтобы быстрее работало 
      //  "./src/styles/article.scss", //Чтобы быстрее работало 
      //  "./src/styles/new.scss", //Чтобы быстрее работало 
       "!./src/styles/mixins/**/*.scss",
       "!./src/styles/comps/**/*.scss",
     ])
     .pipe(changed("./build/css/"))
     .pipe(sassGlob()) // НЕ РАБОТАЕТ ВМЕСТЕ С SOURCEMAP
    //  .pipe(sourceMaps.init())
     .pipe(sass()).on("error", sass.logError)
     // .pipe(autoprefixer()) // НЕ РАБОТАЕТ ВМЕСТЕ С SOURCEMAP
     // .pipe(groupCssMediaQueries()) // НЕ РАБОТАЕТ ВМЕСТЕ С SOURCEMAP
     // .pipe(csso())
    //  .pipe(sourceMaps.write())
     .pipe(gulp.dest("./build/css/"));
  }
})
gulp.task("script:dev", function() {
  /* РАБОТА С ФАЙЛАМИ ИЗ ПАПКИ SCRIPTS */
  /*
   -->babel - делает код совместимым с более поздними версиями
   -->webpack - собирает js модули
  */
  return gulp
    .src([
      "./src/scripts/**/*.js",
      "!./src/scripts/comps/**/*.js",
    ])
    // .pipe(babel()) //Почему-то крашит сборку при любой ошибке
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./build/js"))
})
gulp.task("asset:dev", gulp.parallel("image:dev", "move-asset:dev"))


/* Watch */
gulp.task("watch:dev", function(done) {
  gulp.watch("./src/assets/**/*", gulp.series("asset:dev"));
  gulp.watch("./src/templates/**/*.html", gulp.series("template:dev"));
  gulp.watch("./src/styles/**/*.scss", gulp.series("style:dev"));
  gulp.watch("./src/scripts/**/*.js", gulp.series("script:dev"));
  done();
})

