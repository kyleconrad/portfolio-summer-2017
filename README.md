Static build of kyleconrad.com with Gulp.js as the build system, Sass and Bourbon for mix-ins and handy CSS pre-processing, and other assorted tools for compression and launch.

## Local Setup
Running local set up will install all necessary bundles and dependencies and then run a server with BrowserSync. It watches all Sass, JS, and images, then compiles and reloads accordingly.
    
    $ cd Summer\ 2017\ Design
    $ npm install --global gulp-cli
    $ npm install
    $ gulp

## Building
Building will remove all files from the 'build' directory, compile and minify all Sass/CSS, concat and uglify all JS, minify all images, and process and copy all HTML. This will result with the entire site ready in the 'build' directory upon completion.

    $ cd Summer\ 2017\ Design
    $ gulp build

## Deploying
Deployment uses rsync to ensure that the live server is synced with the latest files from the 'build' directory. Ensure that the latest updates have been built before attempting to deploy.

    $ cd Summer\ 2017\ Design
    $ gulp build
    $ gulp deploy