const express = require("express");
const app = express();
const router = express.Router();
const Model_Pembayaran = require('../Model/Model_Pembayaran.js');
const Model_Menu = require("../Model/Model_Menu.js");
const Model_Alamat = require("../model/Model_Alamat.js");
const Model_Users_Kantin = require("../model/Model_Users_Kantin.js");

const connection = require('../config/database');
app.use(express.json());



router.get('/', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Menu.getAll();
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/beranda', {
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/keranjang', async (req, res, next) => {
    try {
        id = req.session.userId
        console.log("routes", id)
        let rows = await Model_Pembayaran.getKeranjang(id);
        res.render('catering/keranjang', {
            data: rows,
            id: id,
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/checkout', async (req, res) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Alamat.getId(id);
        console.log("rows: ",rows )
        const {
            itemIds
        } = req.body; // Ambil array ID item dari body request

        console.log("id:", itemIds);

        if (!itemIds || itemIds.length === 0) {
            return res.status(400).send('Tidak ada item yang dipilih');
        }

        // Mengambil data lengkap untuk setiap item berdasarkan ID
        const query = `
            SELECT a.*, b.* FROM pembayaran as a
            left join menu as b on a.id_menu=b.id_menu  
            WHERE id_pembayaran IN (${itemIds.join(', ')});
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error querying database');
            }

            // Kirim hasil query ke halaman checkout
            res.render('catering/checkout', {
                items: results,
                data: rows
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
});

router.get('/checkout', async (req, res) => {
    try {
        console.log("get")
        res.render('catering/checkout', {
            items: []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan pada server');
    }
});

router.get('/profil', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Menu.getAll();
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/profil', {
            id: id,
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});
router.get('/alamat', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Alamat.getAll();
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/alamat', {
            id: id,
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});

router.get('/pesanan', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Menu.getAll();
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/pesanan', {
            id: id,
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});

router.get('/riwayat', async (req, res, next) => {
    try {
        let id = req.session.userId;
        let rows = await Model_Menu.getAll();
        let rows2 = await Model_Users_Kantin.getId(id);
        res.render('catering/riwayat', {
            id: id,
            data: rows,
            data2: rows2,
        });
    } catch (error) {
        res.redirect('/loginkantin');
        console.log(error);
    }
});

router.post('/update-quantity', async (req, res) => {
    const {
        id,
        jumlah
    } = req.body;

    try {
        // Update database sesuai kebutuhan
        const query = `UPDATE pembayaran SET jumlah = ? WHERE id_pembayaran = ?`;
        await connection.query(query, [jumlah, id]);

        res.json({
            success: true,
            message: 'Quantity updated successfully'
        });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quantity'
        });
    }
});

module.exports = router;