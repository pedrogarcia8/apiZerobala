   var fs = require('fs');

    module.exports = function(app) {
        app.post("/upload/imagem",function(req, res) {

          var arquivo = req.headers.filename;
          console.log('arquivo recebido: ' + arquivo);

          req.pipe(fs.createWriteStream("util/" + arquivo))

            .on('finish', function(){
                   console.log('arquivo escrito');
                  res.status(201).send('ok');
            });
        });
      }