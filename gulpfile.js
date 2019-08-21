let gulp = require('gulp'),
	browserSync = require('browser-sync'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	plumber  = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer');

var path = {
	src: {
		html: 'app/*.html',
		css: 'app/css/style.css',
		js: 'app/js/script.js',
		img: 'app/img/*.*',
		fonts: 'app/fonts/*.*'
	},
	watch: {
		html: 'app/*.html',
		js: 'app/js/*.js',
		css: 'app/css/*.css',
		img: 'app/img/*.*',
		fonts: 'app/fonts/*.*'
	},
	build: {
		html: 'dist/',
		js: 'dist/js',
		css: 'dist/css',
		img: 'dist/img',
		fonts: 'dist/fonts'
	}
}

let config = {
	server: {
		baseDir: 'app'
	},
	notify: false,
	browser: 'Chrome'
};

var autoprefixerList = [
    'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('css:build', function () {
	return gulp.src(path.src.css)
		.pipe(plumber())
		.pipe(autoprefixer({
			overrideBrowserslist: autoprefixerList
		}))
		.pipe(cssnano())
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.stream());
});

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		// .pipe(rename({
		// 	suffix: '.min'
		// }))
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('image:build', function () {
	return gulp.src(path.src.img)
		.pipe(cache(imagemin([
			imagemin.gifsicle({interlaced: true}),
    		imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			pngquant(),
   			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		])))
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('cache:clear', function () {
	cache.clearAll();
});



gulp.task('watch', function() {
	gulp.watch(path.watch.html, gulp.parallel('html:build'));
	gulp.watch(path.watch.css, gulp.parallel('css:build'));
	gulp.watch(path.watch.js, gulp.parallel('js:build'));
	gulp.watch(path.watch.img, gulp.parallel('image:build'));
	gulp.watch(path.watch.fonts, gulp.parallel('fonts:build'));
});

gulp.task('build', gulp.series('html:build', 'css:build', 'js:build', 'fonts:build', 'image:build', 'cache:clear'));

gulp.task('default', gulp.parallel('webserver', 'watch'));