var fs = require('fs')
  , Batch = require('batch')
  , debug = require('debug')('component:stylus')
  , stylus = require('stylus')
  , nib = require('nib')
  , endsWith = require('./utils').endsWith;

module.exports = function compileStylus(builder) {

  builder.hook('before styles', function (pkg, cb) {
    if (!pkg.config.styles) return cb();

    var stylusFiles = pkg.config.styles.filter(endsWith('styl'))
      , batch = new Batch();

    stylusFiles.forEach(function (styl) {
      batch.push(function (done) {
        var stylPath = pkg.path(styl)
          , name = styl.split('.')[0] + '.css';

        debug('compiling: %s', styl);

        var render = stylus(fs.readFileSync(stylPath, 'utf-8'))
          .set('include css', true)
          .set('filename', stylPath)
          .use(nib());

        if (pkg.parent && pkg.parent.config.build && pkg.parent.config.build.stylus && pkg.parent.config.build.stylus.imports) {
          pkg.parent.config.build.stylus.imports.forEach(function (path) {
            var imp = pkg.parent.dir + '/' + path;
            debug('importing: %s', imp);
            
            render.import(imp);
          });
        };

        render.render(function (err, css) {

          if (err) return done(err);

          pkg.addFile('styles', name, css);
          pkg.removeFile('styles', styl);
      
          done();
        });

      });
    });

    batch.end(cb);
  });
}

