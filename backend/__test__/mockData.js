const {createAuthToken} = require('../utils/authtoken');

exports.user1 = {
    "uuid": "u0000000001",
    "username": "user1",
    "firstname": "user1_firstname",
    "lastname": "user1_lastname",
    "email": "test1@email.com",
    "password": "user1_password",
    "authToken" : createAuthToken('u0000000001')
}

exports.club1 = {
    "uuid" : "c123456789",
    "name": "AKAI",
    "isopen": false,
    "university": "PoznanUniversityOfTechnology",
    "description" : "test_descritpion",
    "rules" : "test_rules"
}

exports.user2 =  {
    "uuid": "u0000000002",
    "username": "user2",
    "firstname": "user2_firstname",
    "lastname": "user2_lastname",
    "email": "test2@email.com",
    "password": "user2_password",
    "authToken" : createAuthToken('u0000000002')
}   
