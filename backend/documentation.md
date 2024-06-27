## Directories
- /config 
stores configuration files. For Example database configuration file, configuration variables .json file etc.
- /controllesrs
stores controller files which handle the logic of diffrent routes of the API
- /models
stores model, schema definition. For example mongoose databse schemas etc. 
- /routes 
stores routes definition for API 
- /middleware 
stores custom middleware functions 
- /services 
stores buisness logic and service functions (functions related to user operations)
- /utils 
stores utility functions and helpers like loger, email format validation, hashing function etc. 
- /databse 
stores files with databse classes and functions neccesary to manage databse(should be created as dependencie for easy and flexible changeof  databse)

### My Definition of Controller, Service, Middleware used in code managment 
Controller vs Sevice vs Middleware
Controller is supposed to handle logic of managing requests and responses where Sevice is supposed to handle buisnes logic of API endpoint(the action which user wants to achive). Middleware on toher hand is similar to Controller however its supposed to be a more of a help function not performing tha main logic of given Route

# API endpoints

### 1. /login
Logs in user based on given credentials. If User is registerd response will be succesfull and will return authorization token for login session. This token should be later used for user authentication.<br>
If user has provided "Atuhorization" header will return that User has authenticated himself with token. 
If login action is not succesfull then variable "success" is false, otherwise true. "auth" is variable holding authorization token for user next API calls in order to identify him. If during API call there will be an error varaible "error" will be added with value true. 
<br>

#### Path Parameters
None
#### Request Body 

| Field Name|Required/Optional | Field description | Type|
|-----------|------------------|-------------------|-----|
|email      | required         | email owned by user| string| 
|password   | required         | password with which user will log in | string | 

##### Request Example 
``` 
body: {
  "email" : "my.email@domain.com", 
  "password" : "my_password"
}
```

#### Response Definitions

| Field Name| Field description | Type|
|-----------|-------------------|-----|
|success    |informs if request was succesfull| bool| 
|message    |return inforamtion about result of request| string | 
|auth | authorization token for next API calls to identify user | string |
|error      |returns true if internal error ocured | bool | 

##### Response Example
``` 
{
  "success": true,
  "auth": "eyJhbGciOiJIUzI1NiJ9.MTcxOTUwODY1MzEzMA.Yu0Ii6iUtqD9-kBJEKk5U7Q4aKs35nU02PBNvZ86XAY",
  "message": "Login succesfull"
}
```

### 2. /register
Register API endpoint takes new user credentials as given. If during user account creation error will occure variable "error" will be added sugesting internal API error.  

#### Path Parameters
None
#### Request Body 

| Field Name|Required/Optional | Field description | Type|
|-----------|------------------|-------------------|-----|
|email      | required         | email owned by user| string| 
|password   | required         | password with which user will log in | string | 
|firstname  | optional         | first name of user| string | 
|lastname   | optional         | last name of user | string | 
|discord    | optional         | discord nikc      | string | 

##### Request Example 
```
{
  "email" : "Willy@gmail.com", 
  "password" : "pawadss", 
  "username" : "Will"
  "lastname" : "Octavian Walenrod"
  "firstname" : "William"  
}
```

#### Response Definitions

| Field Name| Field description | Type|
|-----------|-------------------|-----|
|success    |informs if request was succesfull| bool| 
|duplicate  |when trying to register user filed given in "duplicatedFields"<br> were already assigned to other user(must be unique)| bool | 
|duplicatedFields| duplicated fields which should be unique for user|string array|
|message    |return inforamtion about result of request| string | 
|error      |returns true if internal error ocured | bool | 

##### Response Example 
```
{
  "succesfull": true,
  "duplicate": false,
  "duplicatedFields" : []
  "message": "User saved in database",
  "error" : false
}
```

### 3. /:username
API endpoint returning data about user with given username. For now all data is being returned held by databse **MUST BE CHANGED**<br>
#### Path Parameters

|Path Parameter| Description |
|-----------|------------------|
|username   |username of user which data wants to retrived from databse| 

#### Request Body 

None

##### Request Example 
```
Path: /Will
```

#### Response Definitions
| Field Name| Field description | Type|
|-----------|-------------------|-----|
|success    |informs if request was succesfull| bool| 
|message    |return inforamtion about result of request| string | 
|error      |returns true if internal error ocured | bool | 
|user | object with user data | json | 
|{user}.email | email of the user | string | 
|{user}.username | username of the user | string | 
|{user}.membership| array of club names in which user is member | string array| 

##### Response Example <br> TO DO return only few user object elements
```
{
  "success": true,
  "message": "userFound",
  "error" : false, 
  "user": {
    "username": "serafin",
    "email": "seweryn.wasilewski@gmail.com",
    "membership" : ["AKAI", "RPG"], 
  }
} 
```

TO DO.

### 3. /club/create TO DO 
### 4. /club/:clubname TO DO 
### 5. /club/:clubname/join TO DO 
### 6. /club/:clubname/getJoinRequests TO DO
### 7. /club/:clubname/resolveJoinRequest TO DO 
### 8. /club/:clubname/leave TO DO 