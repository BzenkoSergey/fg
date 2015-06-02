var paths = require('./../paths.js'),
	libs = require('./../libs.js');

var gulp = libs.gulp,
	watch = libs.watch,
	livereload = libs.livereload;

module.exports = htmlDist;

function htmlDist() {
	runWatcher();
	livereload.listen();

	return htmlBuild();
};

function htmlBuild() {
    return gulp.src(paths.html)
			.pipe(gulp.dest('./dist/'))
			.pipe(livereload());
}

function runWatcher() {
	watch(paths.html, function(vinyl) {
		var eName = vinyl.event;
		if(eName !== 'change' && eName !== 'add') {
			return true;
		}
		console.log('HTML Watcher: ' + eName + ': ' + vinyl.path);

	    htmlBuild();
	});
}