const fs = require('fs');

fs.readdir('./galeria', (err, files) => {
  for (var i = 0; i < files.length; i++) {
    fs.renameSync('./galeria/' + files[i], './galeria/gallery' + (i < 9 ? '0'+i : i) + '.jpg');
  }
});