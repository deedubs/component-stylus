var fs = require('fs')
  , Batch = require('batch')
  , debug = require('debug')('component:stylus')
  , stylus = require('stylus')
  , nib = require('nib')
  , endsWith = require('./utils').endsWith;

module.exports = function compileStylus(builder) {

  builder.hook('before styles', function (pkg, cb) {
    if (!pkg.conf.styles) return cb();
    
    var stylusFiles = pkg.conf.styles.filter(endsWith('styl'))
      , batch = new Batch();
    
    stylusFiles.forEach(function (styl) {
      batch.push(function (done) {
        var stylPath = pkg.path(styl)
          , name = styl.split('.')[0] + '.css';  
        
        debug('compiling: %s', styl);
        
        stylus(fs.readFileSync(stylPath, 'utf-8'))
          .set('include css', true)
          .set('filename', styl)
          .use(nib())
          .render(function (err, css) {
            pkg.addFile('styles', name, css);
            pkg.removeFile('styles', styl);
        
            done();
          });
        
      });
      
      batch.end(cb);
    });
  });
}

