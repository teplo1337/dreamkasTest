const express     = require('express'),
      path        = require('path'),
      multer      = require('multer'),
      pg          = require('pg'),
      configUriDb = "postgres://dlumhzyl:fpOHOo0WYy14hshJWpYUrShNFZH9LBRq@dumbo.db.elephantsql.com:5432/dlumhzyl",
      client      = new pg.Client(configUriDb),
      app         = express();

var storage = multer.diskStorage({                                              //настройка Multera путь и имя
      destination: (req, file, cb) => {
        cb(null, "./app/public/uploads/")
      },
      filename: (req, file, cb) => {
        var pathImage = file.fieldname + '-' + Date.now()+ path.extname(file.originalname);
        cb(null, pathImage)
      }
    });

var upload = multer({ storage: storage }).single('image');                      // настройка функци мультера
app.use(express.static('./app/public'));                                        //статик сервер public
app.get('/', (req,res) => {                                                     //get '/'
  res.sendFile(path.resolve("./app/html/index.html"));
});
app.post('/', upload, (req,res) => {                                            //post '/'
  client.connect();
  client.query('CREATE TABLE IF NOT EXISTS newimgdata(data json)');             //create table in db
                                                                                //insert in table in db
  client.query('INSERT INTO newimgdata VALUES (\'{"name": "'+req.body.name+'", "destination":"'+req.file.destination+req.file.filename+'"}\')', (err, result) => {
  });

  client.query("SELECT * FROM newimgdata", (err, result) => {              //select from table in db
      result.rows.forEach((row) => {
      console.log(row.data);
      });
    });
});
app.listen(8080, () => {                                                        //start server
  console.log('listen 8080');
});
