const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp')
const {sendWelcomeEmail,sendLastEmail} = require('../emails/account');
const router = new express.Router();

//#region Registering EndPoint For User
router.post('/users',async (req,res)=> {
    const user = new User(req.body);
    
    //New Async Await Code
    try{
        
        
        await user.save();

        sendWelcomeEmail(user.email,user.name);

        const token = await user.generateAuthToken();

        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }
    
    //Promise library code
    // user.save().then(()=>{
    //     res.send(user);
    // }).catch((e)=>{
    //     res.status(400).send(e);
    // });
    
});

router.post('/users/login',async (req,res)=>{
    try{
        console.log(req.body.email);
        console.log(req.body.password);
        const user = await User.ValidateUserInformation(req.body.email,req.body.password);
        //console.log(user);
        
        const token = await  user.generateAuthToken();
        
        console.log(token);

        res.send({user , token});
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
});

router.get('/users/me',auth,async (req,res)=>{
    
    res.send(req.user);
    
    // try{
    //     const users =await User.find({});
    //     res.send(users);
    // }catch(e){
    //     res.status(500).send(e);
    // }

    // User.find({}).then((users)=>{
    //     if(!users){
    //         res.status(404).send();
    //     }
    //     res.send(users);
    // }).catch((e)=>{
    //     res.status(500).send();
    // });
});

router.get('/users/logout',auth,async (req,res)=>{
    try{
        console.log('req.token :-', req.token);
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        });
    
        await req.user.save();

        res.send();
    }catch (e) {
        res.status(500).send({'error': e.toString()})
    }
});

router.get('/users/logoutall',auth,async (req,res)=>{
    try{
        req.user.tokens = [];
        await  req.user.save();

        res.send();
    }catch(e){
        req.status(500).send({'error' : e.toString()})
    }
});

router.get('/users/:id',async (req,res)=>{

    const _id = req.params.id;
    try{
        const user =await User.findById(_id);
        if(!user){
            res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
    
    
    // User.findById(_id).then((user)=>{
    //     if(!user){
    //         res.status(404).send();
    //     }

    //     res.send(user);
    // }).catch((e)=>{
    //     console.log(e);
    //     res.status(500).send(e);
    // })
    
});


router.patch('/users/me',auth,async (req,res)=>{
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name','age','password','email']
        const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update));

        if(!isValidUpdate){
            res.status(400).send({'error':'Update Not Allowed'});
        }
        console.log(req.params.id);
        
        //const user = await User.findById(req.user._id);

        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save();
        
        //const user =await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) //this will not work if we want to hash our password
        
        // if(!user){
        //     res.status(404).send();
        // }
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const users =await User.findByIdAndDelete(req.params.id);
        // if(!users){
        //     res.status(404).send();
        // }
        await req.user.remove();
        sendLastEmail(req.user.email,req.user.name)
        res.send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
})

const upload = multer(
    {
        limits : {
            fileSize : 2500000
        },
        fileFilter(req, file ,cb) {
            
            console.log(file.originalname);
            if(!file.originalname.toLocaleLowerCase().match(/\.(jpg|jpeg|png)$/)){ //.match(/\.()$/))
                return (cb(new Error('Please upload a valid image !')))   
            }

            return cb(undefined,true);    
        }
    }
)
router.post('/users/me/avatar',auth ,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar = buffer;
    //req.user.avatar =  req.file.buffer;
    await req.user.save();

    res.send();
},(error,req,res,next)=>{
    res.status(400).send({'error' : error.message});
});

router.delete('/users/me/avatar',auth,async (req,res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send(e.toString());
    }
});

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        
        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type','image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send(e.toString());
    }
});

//#endregion


module.exports = router;