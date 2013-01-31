# component-stylus

Transpile stylus


## Usage



````javascript

// component.json
{
  ...
  "styles": [
    "base.styl",
    "nav.styl"
  ]
  ...
}

// builder.js
var Builder = require('component-builder')
  , c7tStylus = require('component-stylus');

var builder = new Builder(__dirname);

builder.use(c7tStylus);

builder.build(function(err, res){
  if (err) throw err;

  fs.writeFileSync('public/package.js', res.require + res.js);
  fs.writeFileSync('public/package.css', res.css);
});

  
````

