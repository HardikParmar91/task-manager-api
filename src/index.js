const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Tasks = require('./models/tasks');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT || 3000;

//For Authenticate Routes
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('I have Hacked the Web Services !');
//     } else {
//         next();
//     }
// })

app.use(express.json()); //This line will return us JSON for all the end points we have registered with the web service.
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=> { 
    console.log('Server is up on port ', port);
});

//Mutler File Upload 
// const multer = require('multer');
// const upload = multer({
//     dest : 'images'
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send();
// });


// const jwt = require('jsonwebtoken');
// const TestingFunction =async ()=>{
//     const token = await jwt.sign({'_id': '123' },'ThisIsMyCourse',{expiresIn : '10 SECOND'});

//     console.log(token);

//     const data = jwt.verify(token,'ThisIsMyCourse');
//     console.log(data);
// };

// TestingFunction();

// console.log('Executing Last Line');


//const Task = require('./models/tasks');
//const Userr = require('./models/user');
//const main = async ()=>{
    // const task = await Task.findById('5e42cc66e6b0e7141c8bd8ac');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    // const user = await User.findById('5e42cc57e6b0e7141c8bd8a9');

    // await user.populate('tasks').execPopulate();

    // console.log(user.tasks);
//};

//main();



//