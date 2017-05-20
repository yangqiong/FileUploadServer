let COS = require("./cos");
let config = require("./config");
let fs = require("fs");
let imageType = require('image-type');

let params = {};

params.Bucket = 'spurs';
params.Region = 'cn-south';
params.Key = 'cos.js'
params.Body = fs.readFileSync(__dirname + "/server.png");
params["ContentType"] = 'text/html';

console.log(params.Body);
console.log( imageType(params.Body) );

COS.putObject(params, function(err, data){
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
})