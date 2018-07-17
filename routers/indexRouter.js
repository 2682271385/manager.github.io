let express=require('express');
let indexRouter=express.Router();
let path=require('path');
indexRouter.get('/',(req,res)=>{
    if(req.session.userInfo){
        // res.sendFile(path.join(__dirname,'../static/views/index.html'))
        let userName = req.session.userInfo.userName;
        res.render(path.join(__dirname,'../static/views/index.html'), {
          userName
        });
    }else{
        res.redirect('/login');
    }
})
module.exports=indexRouter;