let express = require("express");
let app = express();
let PORT = 9000;
let mime = require('mime-types');
let multer  = require('multer')
let upload = multer();
let md5 = require("md5");
let COS = require("./cos-nodejs-sdk-v5/cos");
let morgan = require('morgan')

app.use(morgan('combined'));

app.post("/", function(req, res){
    const FILEKEY = "file";
    upload.single(FILEKEY)(req, res, function(err){
        if (err) {
            res.send({
                message: "文件Key不对",
                status: -1
            })
            return;
        }
       
        if (req.file){
            let Bucket = req.body.Bucket || "default";
            let Region = req.body.Region || "cn-south";

            let params = {};
            params.Bucket = Bucket;
            params.Region = Region;
            params.Key = md5(req.file.buffer);
            params.Body = req.file.buffer;
            params["ContentType"] = req.file.mimetype;

            COS.putObject(params, function(err, data){
                if (err) {
                    res.send({
                        message: "上传错误",
                        status: -1
                    });
                } else {
                    res.send({
                        status: 0
                    })
                }
            })
        } else {
            res.send({
                message: "文件内容为空",
                status: -1
            })
        }
    });
})

app.listen(PORT, function(){
    console.log("server is listen on port: " + PORT);
})