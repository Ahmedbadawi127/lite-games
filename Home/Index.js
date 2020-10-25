//some packeges to work on json
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
const { json } = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors')
app.use(cors())

//get function to return json file data
//you can change function name & file name
app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "Data.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

//call your page
app.get('/home', function (req, res) {
   res.sendFile( __dirname + "/" +'Index.html')
})

//write on json file
//you can function name, file name, req.body.data
app.post('/addUser', function (req, res) {
    fs.readFile( __dirname + "/" + "Data.json", 'utf8', function (err, data) {
       data = JSON.parse(data);
       var user = req.body.name;
       var pass = req.body.pass;
       var mail = req.body.mail;
       data.push({"name":user,"pass":pass,"mail":mail});
       console.log( data );
       data = JSON.stringify(data)
       fs.writeFile( __dirname + "/" + "Data.json", data, 'utf8', function(err,data){
            if(err)
               console.log(err)
       });
    });
    res.statusCode = 200;
    res.end()
 })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://", host, port)
})