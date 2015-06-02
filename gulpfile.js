var libs = require('./gulp/libs.js'),
	gulp = libs.gulp,
	
	jsDist = require('./gulp/tasks/jsDist.js'),
	htmlDist = require('./gulp/tasks/htmlDist.js');

gulp.task('default', ['browserify', 'html']);

gulp.task('browserify', jsDist);

gulp.task('html', htmlDist);