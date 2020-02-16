const express = require('express');
const Tasks = require('../models/tasks');
const auth = require('../middleware/auth')

const router = new express.Router();

//#region Registering EndPoint For Tasks
router.post('/tasks',auth,async (req,res)=>{
    try{
        //const tasks = new Tasks(req.body);
        
        const tasks = new Tasks({
            ...req.body,
            owner:req.user._id
        });

        await tasks.save();
        res.status(201).send(tasks);
    }catch(e){
        res.status(400).send(e);
    }

    // tasks.save().then(()=>{
    //     res.send(tasks);
    // }).catch((e)=>{
    //     res.status(400).send(e);
    // });
});

//tasks?completed=true
router.get('/tasks',auth,async (req,res)=>{
    try{
    //const tasks = await Tasks.find({ owner : req.user._id});
    
        const match = {};
        const sort = {};

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

    const tasks = await req.user.populate({
        path : 'tasks',
        match,
        options : {
            limit : parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
        
    }).execPopulate();

    res.status(200).send(req.user.tasks);

    }catch(e){
        res.status(500).send();
    }
    // Tasks.find({}).then((tasks)=>{
    //     res.send(tasks);
    // }).catch((e)=>{
    //     res.status(500).send(e);
    // });
});

router.get('/tasks/:id',auth,async (req,res)=>{
    
    try{
        const _id = req.params.id;
        const tasks =await Tasks.findOne({
            _id,owner : req.user._id
        });

        if(!tasks){
            res.status(400).send(tasks);
        }
        res.send(tasks);
    }catch(e){
        res.status(500).send(e);
    }
    
    // Tasks.findById(_id).then((task)=>{
        
    //     if(!task)
    //     {
    //         res.status(404).send();
    //     }

    //     res.send(task);
    // }).catch((e)=>{
    //     res.status(500).send(e);
    // });
});

router.patch('/tasks/:id',auth,async (req,res)=>{
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ['completed','description'];
        const isValidUpdate = updates.every((update)=> allowedUpdates.includes(update));
    
        if(!isValidUpdate){
            res.status(404).send({'error':'Update Not Valid'});
        }

        //const tasks = await Tasks.findById(req.params.id);
        const tasks = await Tasks.findOne({_id : req.params.id , owner : req.user._id });
        
        //const tasks = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    
        if(!tasks)
        {
            res.status(404).send();
        }

        updates.forEach((update)=> tasks[update] = req.body[update])
        await tasks.save();

        res.status(200).send(tasks);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
});


router.delete('/tasks/:id',auth,async (req,res)=>{
    
    try{
        const tasks = await Tasks.findOneAndDelete({_id : req.params.id, owner : req.user._id});
        if(!tasks)
        {
            res.status(404).send();
        }
        res.status(200).send(tasks);
    }catch(e){
        res.status(500).send(e);
    } 
    });

//#endregion

module.exports = router;