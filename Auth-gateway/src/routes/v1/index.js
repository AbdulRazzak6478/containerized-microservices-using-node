const express = require('express');
const router = express.Router();
const {infoController:{info}} = require('../../controllers')
const userRoutes = require('./user-routes');
const { AuthRequestMiddlewares } = require('../../middlewares');

router.use('/user',userRoutes);

router.get('/info',AuthRequestMiddlewares.checkAuth,info) 

router.get('/info/new',(req,res)=>{
    return res.json({msg:'router is setup'});
})

module.exports = router; 