const { Storage } = require('@google-cloud/storage');
const path = require('path');
const storage = new Storage({
    projectid: process.env.GCLOUD_PROJECT,
    credentials: {
        client_email: process.env.GCLOUD_CLIENT_EMAIL,
        private_key: process.env.GCLOUD_PRIVATE_KEY
    }
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);
require("dotenv").config();

const subir = async (req,res,next) => {
    let newFileName;
    if(req.body.hasOwnProperty('correo')){        
        const{ correo, id } = req.body;
        newFileName = "usuarios/"  + id + "-" + correo +  path.extname(req.file.originalname);
    }else if(req.body.hasOwnProperty('id_chat')){
        const{ emisor, id, } = req.body;
        newFileName = "mensajes/"  + id + "-" + emisor +'mensaje'+  path.extname(req.file.originalname);
    }else if(req.body.tipocontenido!=3){
        const{ titulo, id } = req.body;
        newFileName = "contenidos/"  + id + "-" + titulo +  path.extname(req.file.originalname);
    }else {
        const{ titulo, id } = req.body;
        newFileName = "juegos/"  + id + "-" + titulo +  path.extname(req.file.originalname);
    }
            const file = bucket.file(newFileName);
            const fileStream = await file.createWriteStream({
                resumable: false,
                public: true
            })
                .on('error', (err) => {
                    res.json({ status: false, err: err })
                    console.log(err);
                })
                .on('finish', async () => {
                    req.body.URL = `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${file.name}`;
                    next();
                });

            fileStream.end(req.file.buffer);
};

module.exports = subir;