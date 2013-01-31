var fs = require('fs')
  , stylus = require('stylus')
  , nib = require('nib')
  , endsWith = require('./utils').endsWith;

module.exports = function compileStylus(builder) {
  builder.hook('before styles', function (pkg, done) {
    if (!pkg.conf.styles) return done();
    
    var stylusFiles = pkg.conf.styles.filter(endsWith('styl'))
      , left = stylusFiles.length;
    
    if (!left) return done();
    
    stylusFiles.forEach(function (styl) {
      var stylPath = pkg.path(styl)
        , name = styl.split('.')[0] + '.css';

      stylus(fs.readFileSync(stylPath, 'utf-8'))
        .set('include css', true)
        .set('filename', styl)
        .use(nib())
        .render(function (err, css) {
          pkg.addFile('styles', name, css);
          pkg.removeFile('styles', styl);
        
          --left;
          if (!left) done();
        });
    });
  });
}

