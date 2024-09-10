var express = require('express');
var router = express.Router();
const Model_Berita = require('../model/Model_Berita.js');
const Model_Album = require('../Model/Model_Album.js');

router.get('/users', async function (req, res, next) {
    try {
        let rows = await Model_Berita.getAll();
        let rows2 = await Model_Album.getAll();
        res.render('artikel/users/index', {
            data: rows, 
            data_album: rows2
        });
    } catch (error) {
        console.error("Error:", error);
        req.flash('invalid', 'Terjadi kesalahan saat memuat data pengguna');
        res.redirect('/login');
    }
});

module.exports = router;