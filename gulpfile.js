const gulp = require("gulp");
require("./gulp/dev.js");
require("./gulp/prod.js");

gulp.task('default', gulp.series(
  "clean:dev",
  gulp.parallel("template:dev", "style:dev", "asset:dev", "script:dev"),
  gulp.parallel("server:dev", "watch:dev")
));

gulp.task('prod', gulp.series(
  "clean:prod",
  gulp.parallel("template:prod", "style:prod", "asset:prod", "script:prod"),
  "server:prod"
));