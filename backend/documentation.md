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