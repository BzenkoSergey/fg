var paths = require('./../paths.js'),
	libs = require('./../libs.js');

var gulp = libs.gulp,
	watch = libs.watch,
	browserify = libs.browserify,
	source = libs.vinylSource,
	livereload = libs.livereload;

module.exports = jsDist;


function jsDist() {
	runWatcher();
	livereload.listen();

	return jsBuild();
};

function jsBuild() {
    return browserify('app.js', {
				basedir: './src/app/'
			})
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest('./dist/'))
			.pipe(livereload());
}

function runWatcher() {
	watch(paths.js, function(vinyl) {
		var eName = vinyl.event;
		if(eName !== 'change' && eName !== 'add') {
			return true;
		}
		console.log('JS Watcher: ' + eName + ': ' + vinyl.path);

	    jsBuild();
	});
}