const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces); //find
router.get('/:id', auth, sauceCtrl.getOneSauce); //findOne
router.post('/', auth, multer, sauceCtrl.createSauce); //save
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //findOneAndUpdate>unlink> or updateOne
router.delete('/:id', auth, sauceCtrl.deleteSauce); //findOne > unlink > deleteOne
router.post('/:id/like', auth, sauceCtrl.likeSauce); //findOne > updateOne

module.exports = router;