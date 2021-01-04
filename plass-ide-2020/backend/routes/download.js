var express = require('express');
var router = express.Router()
// const db = require('../modules/db-connection-pool');
// const sql = require('../sql');
const path = require('path')
const fs = require('fs');
router.get('/:url' , function(req, res){
    try {
        const { url } = req.params;
        console.log(url)
        var file = path.join(__dirname, `..\\update\\${url}`);
        console.log(file)
        fs.exists(file, function(exists) {
            if(exists)
            {
                res.send({
                    url : `files/${url}`
                })
            }else{
                res.setHeader('Content-type', 'text/plain');
                res.end("Error file dose not exists");
            }
        })
    } catch (error) {
        console.log(error)
    }
});
module.exports = router;