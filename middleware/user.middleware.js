const {UserModel}=require('../model/user.model')

const UserMiddleware= async(req,res,next)=>{
     try{
        const {name,profile_pic,email,password,bio,phone}=req.body;
        if(!name||!email||!password||!profile_pic||!bio||!phone) return res.status(401).json({'msg':"Please provide all deatails"})
        let data=await UserModel.find({email});
        if(data.length>0)return res.status(401).json({'msg':"User already exits"})
        next()
     }
     catch(err){
        console.error(err)
        res.status(500).json({'msg':"Something went wrong"})

     }
}

module.exports={UserMiddleware}