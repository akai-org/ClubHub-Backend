const Joi = require('joi');

const email = Joi.string().email().required();
const password = Joi.string().required();
const username = Joi.string().required(); 

const firstname = Joi.string().optional(); 
const lastname = Joi.string().optional(); 

const uuid = Joi.string()

const clubname = Joi.string().required(); 
const university = Joi.string().optional(); 
const isopen = Joi.boolean().optional();
const description = Joi.string().max(1000).required()
const rules = Joi.string().optional(); 

exports.loginValidSchema = Joi.object({ 
    email,
    password
})

exports.registerValidSchema = Joi.object({
    email,
    password, 
    username,
    firstname,
    lastname,
})

exports.editUserValidSchema = Joi.object({
    uniList : Joi.alternatives().try( 
        Joi.object({
            push : Joi.array().items(Joi.string()).optional(), 
            pull : Joi.array().items(Joi.string()).optional(), 
            }).optional(),
        Joi.array().items(Joi.string()).optional()
        ),
    firstname, 
    lastname, 

})

exports.userValidSchema = Joi.object({
    uuid : Joi.string().optional(),
    createdAt: Joi.string().optional(), 
    username: Joi.string().optional(),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    password: Joi.string().optional(),
})

exports

exports.clubCreateValidSchema = Joi.object({
    name : clubname, 
    university, 
    isopen,
    description,
    rules,
})

exports.searchValidSchema = Joi.object({
    meet : Joi.boolean().optional(), 
    event : Joi.boolean().optional(), 
    project : Joi.boolean().optional(), 
    club : Joi.boolean().optional(), 
    user : Joi.boolean().optional(), 
    uuid : Joi.string().optional()
}).unknown()

exports.createProjectValidSchema = Joi.object({
    //required
    name : Joi.string().required(), 
    description : Joi.string().required(), 
    //optional
    visible : Joi.boolean().optional(), 
    technologies : Joi.array().items(Joi.string()).optional(), 
    tags : Joi.array().items(Joi.string()).optional(),
    externalSources : Joi.array().items(Joi.object({
        name : Joi.string(), 
        source : Joi.string()
    })).optional(), 

})

exports.joinRequestAcceptValidSchema = Joi.object({
    uuid, 
    accept : Joi.boolean(), 
})