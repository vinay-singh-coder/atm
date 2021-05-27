var express = require("express");
var app = express();
var multer = require("multer");
const { exec } = require("child_process");

app.set("view engine","ejs");
app.use(express.static("public"));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const pdfFilter = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    return callback("This Extension is not supported");
  }
  callback(null, true);
};
var compresspdfupload= multer({
  storage: storage,
  fileFilter: pdfFilter,
}).single("file");


app.get('/compresspdf',(req,res) => {
  res.render('compresspdf',{title:'FREE PDF File Compressor Tool to Compress PDF Online to Smaller Size 100% Works - FreeMediaTools.com'})
});
app.post('/uploadcompresspdf',(req,res) => {
  compresspdfupload(req,res,function(err){
    if(err){
      return res.end("Error uploading file")
    }
  })
  res.json({
    path:req.file.path
  })
});
app.post('/compresspdf',(req,res) => {
  
  var inputFile = req.body.path
  

  outputFilePath = Date.now() + "output" + path.extname(req.body.path);
  console.log(outputFilePath);

  exec(
    `gs \ -q -dNOPAUSE -dBATCH -dSAFER \ -sDEVICE=pdfwrite \ -dCompatibilityLevel=1.3 \ -dPDFSETTINGS=/ebook \ -dEmbedAllFonts=true \ -dSubsetFonts=true \ -dAutoRotatePages=/None \ -dColorImageDownsampleType=/Bicubic \ -dColorImageResolution=72 \ -dGrayImageDownsampleType=/Bicubic \ -dGrayImageResolution=72 \ -dMonoImageDownsampleType=/Subsample \ -dMonoImageResolution=72 \ -sOutputFile=${outputFilePath} \ ${inputFile}`,
    (err, stdout, stderr) => {
      if (err) {
        res.json({
          error: "some error takes place",
        });
      }
      res.json({
        path: outputFilePath,
      });
    }
  );
});
var fs = require("fs")

var path = require("path")


app.get("/download", (req, res) => {
  var pathoutput = req.query.path;
  console.log(pathoutput);
  var fullpath = path.join(__dirname, pathoutput);
  res.download(fullpath, (err) => {
    if (err) {
      fs.unlinkSync(fullpath);
      res.send(err);
    }
    fs.unlinkSync(fullpath);
  });
});
app.listen(3000);