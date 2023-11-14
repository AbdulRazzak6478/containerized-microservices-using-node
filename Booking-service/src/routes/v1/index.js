const express = require('express');
const router = express.Router();
const {infoController:{info}} = require('../../controllers')
const bookingRoutes = require('./Booking');

router.get('/info',info) 



router.get('/info/new',(req,res)=>{ 
    return res.json({msg:'router is setup'});
})
router.use('/bookings',bookingRoutes);

module.exports = router; 