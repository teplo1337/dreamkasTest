const express     = require('express'),
      path        = require('path'),
      multer      = require('multer'),
      pg          = require('pg'),
      configUriDb = "postgres://dlumhzyl:fpOHOo0WYy14hshJWpYUrShNFZH9LBRq@dumbo.db.elephantsql.com:5432/dlumhzyl",
      client      = new pg.Client(configUriDb),
      app         = express();

const storage = multer.diskStorage({                                            //настройка Multera путь и имя
      destination: (req, file, cb) => {
        cb(null, "./app/public/uploads/")
      },
      filename: (req, file, cb) => {
        var pathImage = file.fieldname + '-' + Date.now()+ path.extname(file.originalname);
        cb(null, pathImage)
      }
    });

const upload = multer({ storage: storage, limits: { fileSize: 5*1000*1000 } }).single('image');

client.connect();
//app.use(express.static('./app/public'));

app.get('/', (req,res) => {                                                     //обработка метода GET
  res.sendFile(path.resolve("./app/html/index.html"));
});

app.post('/', upload, (req,res) => {                                            //обработка метода POST
  client.query('CREATE TABLE IF NOT EXISTS newimgdata(data json)');
  client.query('INSERT INTO newimgdata VALUES (\'{"name": "'+req.body.name+'", "destination":"http://static.kekcheburek.ru/uploads/'+req.file.filename+'"}\')', (err, result) => {
  });
  res.status('200');
  res.end();
});

app.put('/', (req,res) => {                                                     //обработка метода PUT
  client.query("SELECT * FROM newimgdata", (err, result) => {
    if(!err) {
      let imgData = {"data":[]};
      result.rows.forEach((row) => {
        imgData.data.push(row.data);
      });
      res.status('200');
      res.send(imgData);
      res.end();
    }
    else {console.log(err)}
  });
});

app.listen(8090, () => {                                                        //start server
  console.log('listen 8090');
});
