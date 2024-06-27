# Set up Instruction 

## Backend

### Prerequisites
- Nodejs 
- MongoDB

### Set up 
``` bash
git clone https://github.com/Seweryn-Was/SciClubHub.git
cd ./SciClubHub/backend
npm install  
```
### .env
Create .env file with all enviromental variables which app will use<br>
example .env 
```
PORT = 3000
JWT_SECRET = some_random_string
```
|variable| description| type|
|------|---------------|---|
|`PORT` | port on which backend will recive its all requests|integer|
|`JWT_SECRET`| secret that will be used for Json Web Tokens to hash certain data |string|