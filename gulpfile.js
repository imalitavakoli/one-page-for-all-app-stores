const distDir = 'dist'; // distribution directory
const liquifyIncludesDir = 'app/_includes';
const coreDir = 'app/_core';
const browserifyEntry = 'app/scripts/main.js';
const browserifyBundle = 'main.js';

const liquid = require('@tuanpham-dev/gulp-liquidjs');
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');




const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const fs = require('fs');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { argv } = require('yargs');

const $ = gulpLoadPlugins();
const server = browserSync.create();

const port = argv.port || 9000;
const isInject = argv.inject;
const isProd = process.env.NODE_ENV === 'production';

function styles() {
  return src('app/styles/*.scss', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer()
    ]))
    .pipe(dest('.tmp/styles', {
      sourcemaps: !isProd,
    }))
    .pipe(server.reload({ stream: true }));
};

function scripts() {
  const b = browserify({
    entries: browserifyEntry,
    transform: babelify,
    debug: true
  });
  return b.bundle()
    .pipe(source(browserifyBundle))
    .pipe($.plumber())
    .pipe(buffer())
    .pipe(dest('.tmp/scripts', {
      sourcemaps: !isProd ? '.' : false,
    }))
    .pipe(server.reload({ stream: true }));
};

const lintBase = (files, options) => {
  return src(files)
    .pipe($.eslint(options))
    .pipe(server.reload({ stream: true, once: true }))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()));
}
function lint() {
  return lintBase('app/scripts/**/*.js', { fix: true })
    .pipe(dest('app/scripts'));
};

function liquify() {
  return src('app/*.{html,liquid}')
    .pipe(liquid({ engine: { root: [liquifyIncludesDir], dynamicPartials: false }, filters: { now: () => new Date().getTime() } }))
    .pipe(dest('.tmp'));
}

function html() {
  return src('.tmp/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe($.if(/\.js$/, $.uglify({ compress: { drop_console: true } })))
    .pipe($.if(/\.css$/, $.postcss([cssnano({ safe: true, autoprefixer: false })])))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: false,
      minifyCSS: true,
      minifyJS: { compress: { drop_console: false } },
      processConditionalComments: true,
      removeComments: false,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(dest(distDir));
}

function htmli() {
  return src(`${distDir}/*.html`)
    .pipe($.replace(/<link rel="stylesheet" href="styles\/vendor.css"[^>]*>/, s => {
      let vendorCSS = fs.readFileSync(`${distDir}/styles/vendor.css`, 'utf8');
      return '<style>\n' + vendorCSS + '\n</style>';
    }))
    .pipe($.replace(/<link rel="stylesheet" href="styles\/main.css"[^>]*>/, s => {
      let mainCSS = fs.readFileSync(`${distDir}/styles/main.css`, 'utf8');
      return '<style>\n' + mainCSS + '\n</style>';
    }))
    .pipe($.replace(/<script src="scripts\/vendor.js"><\/script>/, s => {
      let vendorJS = fs.readFileSync(`${distDir}/scripts/vendor.js`, 'utf8');
      return '<script>\n' + vendorJS + '\n</script>';
    }))
    .pipe($.replace(/<script src="scripts\/main.js"><\/script>/, s => {
      let mainJS = fs.readFileSync(`${distDir}/scripts/main.js`, 'utf8');
      return '<script>\n' + mainJS + '\n</script>';
    }))
    .pipe(dest(distDir));
}

function images() {
  return src('app/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest(`${distDir}/images`));
};

function fonts() {
  return src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.if(!isProd, dest('.tmp/fonts'), dest(`${distDir}/fonts`)));
};

function clean() {
  return del(['.tmp', distDir], { force: true })
}

function cleani() {
  return del([`${distDir}/scripts`,`${distDir}/styles`])
}

function measureSize() {
  return src(`${distDir}/**/*`)
    .pipe($.size({ title: 'build', gzip: true }));
}

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  watch([
    '.tmp/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', server.reload);

  watch(['app/*.{html,liquid}', `${liquifyIncludesDir}/*.{html,liquid}`], liquify);
  watch(['app/styles/**/*.scss', `${coreDir}/**/*.scss`], styles);
  watch(['app/scripts/**/*.js', `${coreDir}/**/*.js`], scripts);
  watch('app/fonts/**/*', fonts);
}

function startDistServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: distDir,
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
}

let build;
if (!isInject) {
  build = series(
    clean,
    parallel(
      lint,
      series(parallel(styles, scripts), liquify, html),
      images,
      fonts
    ),
    measureSize
  );
} else {
  build = series(
    clean,
    parallel(
      lint,
      series(parallel(styles, scripts), liquify, html, htmli, cleani),
      images,
      fonts
    ),
    measureSize
  );
}

let serve;
if (!isProd) {
  serve = series(clean, parallel(styles, scripts, fonts), liquify, startAppServer);
} else {
  serve = series(build, startDistServer);
}

exports.serve = serve;
exports.build = build;
exports.default = build;
