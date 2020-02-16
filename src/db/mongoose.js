const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
});

//#region Create New Document User using Mongoose
// const User = mongoose.model('User',{
//     name:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     age:{
//         type:Number,
//         default:0,
//         validate(value){
//             if(value <0)
//             {
//                 throw new Error('Age must a positive number');
//             }
//         }
//     },email:{
//         type:String,
//         required:true,
//         lowercase:true,
//         validate(value)
//         {
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid');
//             }
//         }
//     },password:{
//         type:String,
//         required:true,
//         validate(value) {
//             if(value.length <=6){
//                 throw new Error('Password should be more then 6 characters.');
//             }
//             if (value.includes('password'))
//             {
//                 throw new Error('Password should not cotains password in it');
//             }
//         }
//     }
// });

// const me = new User({
//     name:'Hardik 1    ',
//     age:10,
//     email:'hardik@GMAIL.COM',
//     password:'1234567'
// });

// me.save().then(()=>{
//     console.log(me);
// }).catch((error)=>{
//     console.log(error);
// });
//#endregion

//#region Create New Document Tasks using Mongoose
// const Tasks = mongoose.model('Tasks',{
//     description:{
//         type:String
//     },
//     completed:{
//         type:Boolean
//     }
// });

// const tasks = new Tasks({
//     description:'Desc 1',
//     completed:true
// });

// tasks.save().then(()=>{
//     console.log(tasks);
// }).catch((error)=>{
//     console.log(error);
// });
//#endregion