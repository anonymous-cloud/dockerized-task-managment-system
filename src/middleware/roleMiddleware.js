const allowAdminOrSelf = (req,res,next) =>{
 
    // const userId = req.params.userId;
    const loggedInUser = req.user;
    const userId = req.params.userId;
    console.log(userId,"opopo");
   
    if(loggedInUser.role === "admin" || loggedInUser._id.toString() === userId){
        return next();
    }

 return res.status(403).json({ message: "Not authorized" });

  };


const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // User is admin, proceed to the next middleware or route handler
  }
  res.status(403).json({ message: 'Access denied. Admins only.' });
};

module.exports = { allowAdminOrSelf, adminOnly };