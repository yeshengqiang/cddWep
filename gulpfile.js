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
	var src = [
		'./views/**/*.*',
		'./routes/**/*.*',
		'./services/**/*.*',
		'./css/**/*.*',
		'./imgs/**/*.*',
		'./bower_components/**/*.*',
		'./*.*'
	];
	gulp.watch(src).on('change',function(){
		reload();
		browserSync.notify("更新成功");
	});
});

gulp.task('default',['sync']);