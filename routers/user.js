const express = require('express')
const multer = require('multer')

const fs = require('fs')

const User = require('../models/user')

const auth = require('../middleware/auth')

const router = new express.Router()




var avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/uploads/users')
    },
    filename: function (req, file, cb) {
    var ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + Date.now()+ext)
    }
 })
   
 var avatarUpload = multer({
    limits: {
     fileSize: 2000000
    },
    fileFilter(req, file, cb) {
     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload an image'))
     }
    cb(undefined, true)
    }, 
    storage: avatarStorage 
 })
/// For Register User//
 router.post('/users',avatarUpload.single('avatar'), async (req, res) => {
    const user = new User(req.body)
   
    user.avatar = req.file.path

     

    try {
        await user.save()
       
        const token = await user.generateAuthToken()
        res.status(200).send({ statusCode:200, success: true, message:'user register successfully', response :{ user:user, token:token } })
    } catch (e) {
        res.status(400).send(e)
    }
})


// For login User///
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ statusCode:200, success: true, message:'Login Successfully', response :{ user: user, token:token } })
    } catch (e) {
        res.status(200).send({ statusCode:200, success: false, message:'Invalid Credentials. Please try again!', response :{ user: {}, token:'' } })
    }
})

//// for get user/////

router.get('/users/me', auth, async (req, res) => {
    console.log("reqbody----->",__dirname+"../public");
    console.log("usereq-------->",req.user);
    let bodyRes = req.user
    var today_dt = new Date();

    var today_year = today_dt.getFullYear();
    
    var birth_dt = req.user.birthDate
    var today_month = today_dt.getMonth();
    var birthdate_month = birth_dt.getMonth();
    
    
    var today_day = today_dt.getDate();
    var birthdate_day = birth_dt.getDate();
    
    var formated_today_date = new Date(today_year +"-"+today_month+"-"+today_day)
    
    var formated_birthdate_date = new Date(today_year +"-"+birthdate_month+"-"+birthdate_day)
    
    var Difference_In_Time = formated_today_date.getTime() -formated_birthdate_date.getTime() ;
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    
    if(Difference_In_Days>0 && Difference_In_Days<=7)
    {
        bodyRes={firstName:bodyRes.firstName,
            lastName:bodyRes.lastName,
            email:bodyRes.email,
            profileImage:bodyRes.avatar,
            birthDate: Difference_In_Days+" days to go"
        }
        bodyRes.birthDate= Difference_In_Days+" days to go"
    }
   console.log("bodyRes------->",Difference_In_Days);


    //res.send(body)
    res.send(bodyRes)



})


/// for delete user////
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})








module.exports = router