var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;

gulp.task('sync',function(){
	browserSync.init({
		server:{
			baseDir:'./',
			index: "index.html"
		},
		port:9000,
		browser:'chrome'
	});
	gulp.watch('**').on('change',reload);
});

gulp.task('default',['sync']);