var gulp = require('gulp'),
	watch = require('gulp-watch'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	livereload = require('gulp-livereload');

module.exports = {
	gulp: gulp,
	watch: watch,
	browserify: browserify,
	vinylSource: source,
	livereload: livereload
};