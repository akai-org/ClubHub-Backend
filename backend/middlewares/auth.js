const authHeader = 'authorization';

// request -> authentication -> autorization -> route controller -> ...

const authenticate = (req, res, next) => {
    let authToken = req.headers[authHeader]; 
    if(!authToken){
        req.authenticated = false; 
    }else{
        //try to find user in data base based on given autorization token or other procedure
        //if user found assign its user data to req.user
        req.authenticated = true;   
    }
    next();
}

const authorize = (req, res, next) => {
    //checks user roles and permisiona base on authentication process
}


module.exports = {authenticate}