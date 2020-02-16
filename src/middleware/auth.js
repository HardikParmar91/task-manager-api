const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next) => {

    try{
        //console.log('Reached ');
        const token = req.header('Authorization').replace('Bearer ','');
        //console.log('token ', token);
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        //console.log('decoded ', decoded);

        const user =await User.findOne({_id : decoded._id,'tokens.token':token});
        
        //console.log('user ', user); 

        if(!user){
            throw new Error();
        }
        
        req.token = token;
        req.user = user;
        
        next();
    }catch(e){
       // console.log('eeee', e)
        res.status(500).send({'error': 'Please Authenticate !'});
    }
};

module.exports = auth;