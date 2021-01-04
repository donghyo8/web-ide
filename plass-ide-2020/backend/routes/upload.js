var express = require('express');
var multer = require('multer');

var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, makeid(10) + "." + extension);
    }
})
const db = require('../modules/db-connection-pool');
const sql = require('../sql');

var upload = multer({ storage });

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
router.post("/", upload.single("file"), async (req, res) => {
    let result;
    try {
        result = await db.query(sql.insertFiles, [
            req.file.originalname, req.file.path
        ]);
        console.log(req.file.originalname);
    } catch (e) {
        res.status(500).send({});
    }

    res.send({ id: result.insertId });
});

module.exports = router;