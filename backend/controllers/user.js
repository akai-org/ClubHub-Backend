const {registerUser} = require('../services/user')

const bcrypt = require('bcrypt')

const register = async (req, res) => {
    const {email, password, name} = req.body
    try{
        let result = await registerUser({email, password, name})

        if(result.succesfull){
            console.log("user registered succesfully")
            res.status(200).json(result);
        }else{
            console.log("user not registered")
            res.status(500).json(result);
        }

    }catch(error) {
        console.error('Error in register controller:', error.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
}

const login = (req, res)=>{
    console.log("/login test")
    if(!res.verified){
        console.log("verified"); 
        //check database for user 
        const {email, password, name} = req.body
        if(name === 'Seweryn') //check if credentials are correct
        {

            res.json({
                message : "login succesfull" + email + password + name,
                authToken : "23324255" // function to create tokens
            })
        }else{
            res.json({
                message : "login unsuccesfull"
            })
        }
    }
    res.json({message : "user aready verified with token"}); 
}

module.exports = {register ,login}