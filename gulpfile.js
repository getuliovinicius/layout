// gulpfile.js

'use strict';

/**
 * Variáveis
 */
var gulp = require('gulp');
const notify = require("gulp-notify");
var del = require('del');
var es = require('event-stream');
var compileCSS = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var minifyJS = require('gulp-uglify');
var minifyHTML = require('gulp-htmlmin');
var concat = require('gulp-concat');

/**
 * Tarefas
 */
gulp.task('clean-dist-html', function() {
	return del('./dist/**/*.html');
});

gulp.task('clean-dist-css', function() {
	return del('./dist/css');
});

gulp.task('clean-dist-js', function() {
	return del('./dist/js');
});

gulp.task('html', ['clean-dist-html'], function() {
	return gulp.src('./source/*.html')
		.pipe(minifyHTML({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('css', ['clean-dist-css'], function() {
	return es.merge([
			gulp.src('./source/vendor/bootstrap/dist/css/bootstrap.min.css'),
			gulp.src('./source/scss/style.scss')
				.pipe(compileCSS())
				.on('error', notify.onError({title:'erro ao compilar', message:'<%= error.message %>'}))
				.pipe(minifyCSS())
		])
		.pipe(concat('all.min.css'))
		.pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('js', ['clean-dist-js'], function() {
	return es.merge([
			gulp.src([
				'./source/vendor/jquery/dist/jquery.min.js',
				'./source/vendor/popper.js/dist/umd/popper.min.js',
				'./source/vendor/bootstrap/dist/js/bootstrap.min.js'
			]),
			gulp.src('./source/js/main.js')
				.pipe(minifyJS())
		])
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('background', function () {
	gulp.watch('./source/scss/**/*.scss', ['css']);
	gulp.watch('./source/*.html', ['html']);
});

gulp.task('default', ['html', 'css', 'js', 'background']);