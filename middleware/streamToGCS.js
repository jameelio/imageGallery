const path = require("path"),
      {Storage} = require("@google-cloud/storage"),
      Multer = require("multer"),
      googleCloudConfig = require(path.join(__dirname,'../img-a47528ea52be.json')),
      config_auth = path.join(__dirname,'../img-a47528ea52be.json'),
      bucketIdentity = require("../config.json")


const storage = new Storage({
  keyFilename: config_auth,
  projectId: googleCloudConfig.project_id
});

const activeBucket = storage.bucket(bucketIdentity.CLOUD_BUCKET);

const multer = Multer({
  storage: Multer.MemoryStorage, ///using in memory storage
  limits: {
    fileSize: 5 * 1024 * 1024 //5mb limit
  }
});

function streamUploadToGCS(req, res, next) {
   
    if(!req.file)return next();
    
    const userImageName = Date.now() + req.file.originalname;

    const file = activeBucket.file(userImageName);

    const stream = file.createWriteStream({
       metadata: {
         contentType: req.file.mimetype
       },
       resumable: false
    });

     stream.on("error", err => {
       console.log("Stream Error",err)
       req.file.cloudStorageError = err;
       next(err);
     });

    stream.on("finish", () => {
      console.log("Upload stream finnish")
      req.file.cloudStorageObject = userImageName;
      console.log(userImageName);
      file.makePublic().then(() => {
        req.file.cloudStoragePublicUrl = returnPublicUrl(userImageName);
        next();
      });
    });

    stream.end(req.file.buffer);

}

function returnPublicUrl(filename) {
  console.log(`https://storage.googleapis.com/${bucketIdentity.CLOUD_BUCKET}/${filename}`)
  return `https://storage.googleapis.com/${bucketIdentity.CLOUD_BUCKET}/${filename}`;
}

function multerCustomFilter(req,file,cb){
  console.log(file);
}

module.exports = {
  streamUploadToGCS,
  returnPublicUrl,
  multer
};