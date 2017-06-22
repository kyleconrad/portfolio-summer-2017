require('events').EventEmitter.prototype._maxListeners = 100;


var gulp = require('gulp'),

	// Server & BrowserSync
	browserSync = require('browser-sync').create(),

	// Required for development
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require('gulp-file-include'),
	rename = require('gulp-rename');





// =================================================================================== //
// Development
// =================================================================================== //


// Server initiation, BrowserSync, and watch tasks (opens site in browser)
gulp.task('default', ['html-build', 'sass'], function() {
    browserSync.init(null, {
		server: {
			baseDir: './dev'
		},
		host: 'localhost'
    });

	gulp.watch('./dev/**/*.html', ['html-watch']);
    gulp.watch('./dev/sass/**/*.scss', ['sass']);
    gulp.watch('./dev/js/**/*.js').on('change', browserSync.reload);
    gulp.watch('./dev/images/**/*').on('change', browserSync.reload);
});


// Compile all HTML from templates and includes
gulp.task('html-build', function() {
	return gulp.src('./dev/templates/index.tpl.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: './dev/templates/'
		}))
		.pipe(rename({
 			extname: ''
		 }))
 		.pipe(rename({
 			extname: '.html'
 		}))
		.pipe(gulp.dest('./dev'));
});


// Ensure HTML is compiled before reloading browsers
gulp.task('html-watch', ['html-build'], function (done) {
	browserSync.reload();
	done();
});


// Run SASS compiling and reloading
gulp.task('sass', function() {
    return gulp.src('./dev/sass/*.scss')
	    .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dev/css'))
        .pipe(browserSync.stream());
});





// =================================================================================== //
// Build
// =================================================================================== //





// =================================================================================== //
// Deployment
// =================================================================================== //