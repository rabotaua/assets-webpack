import autoprefixer from 'gulp-autoprefixer'
import gulp from 'gulp'
import cssnano from 'gulp-cssnano'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'

gulp.task('css', () => gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({includePaths: ['src/']}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/')));

gulp.task('html', () => gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/')));

gulp.task('default', ['css', 'html'])
