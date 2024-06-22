const authHeader = 'authorization';

const authenticate = (req, res, next) => {
    let authToken = req.headers[authHeader]; 
    if(!authToken){
        res.verified = false; 
        
    }else{
        //check token and should return user data from databse as a req.user

        res.verified = true; 

    }
    next();
}


module.exports = {authenticate}