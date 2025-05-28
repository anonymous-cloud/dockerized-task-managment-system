const allowAdminOrSelf = (req,res,next) =>{
 
    // const userId = req.params.userId;
    const loggedInUser = req.user;
    const userId = req.params.userId;
   
    if(loggedInUser.role === "admin" || loggedInUser._id.toString() === userId){
        return next();
    }

 return res.status(403).json({ message: "Not authorized" });

  };


module.exports = { allowAdminOrSelf };