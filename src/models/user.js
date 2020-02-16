const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');

const userSchema = mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0){
            throw new Error('Age Must Be Positive Number!');
            }
        }
    },
    email:{
        type:String,
        required : true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please Provide Valid Email!');
            }
        }
    },
    password:{
        type : String,
        required:true,
        validate(value){
            if(value.length < 7){
                throw new Error('Please Provide Strong Password!');
            }
            if(value.includes('password')){
                throw new Error('Your password must not contain password');
            }
        }        
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
   timestamps : true
});

userSchema.virtual('tasks',{
    ref : 'Tasks',
    localField : '_id',
    foreignField : 'owner'
});

userSchema.methods.toJSON = function() {
    const user = this;
    
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;

};

userSchema.methods.generateAuthToken = async function() {
    try{
        const user = this;

        const token = jwt.sign({_id : user._id.toString()},'thisismynewcourse');
        
        console.log(token);
        user.tokens = user.tokens.concat({token});
       
        await user.save();
    
        return token;
    }catch(e){
        throw new Error('Error From generateAuthToken method : ',e);
    }
}

userSchema.statics.ValidateUserInformation = async (email,password)=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
};

userSchema.pre('save',async function(next){
    const user = this; 
    console.log(user);
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

userSchema.pre('remove',async function(next){
    const user = this
    console.log(user);
    await Task.deleteMany({owner : user._id})
    
    next();
});

const User = mongoose.model('User',userSchema);


module.exports = User;