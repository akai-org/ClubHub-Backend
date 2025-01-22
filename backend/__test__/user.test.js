const request = require('supertest');
const app = require('../app');

const db = require('../repositories/mongoose/index');

const httpStatusCode = require('../utils/httpStatusCodes');

describe("User TESTS:", ()=>{

  describe('POST /register', ()=>{

    it('correct response 200', async()=>{
      let res = await request(app)
      .post('/register')
      .send( {
        email : 'correct@email.com',
        password : 'correct_passwd', 
        username: 'username',
        firstname : 'firstname',
        lastname : 'lastname'
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('uuid'); 
      expect(res.body.uuid).toMatch(/u.*/); 

    })

    it("Incorrect data format 401", async ()=>{

      let res = await request(app)
      .post('/register')
      .send( {
        email : 'incorrect.email.com',
        password : 'correct_passwd', 
        username: 'username',
        firstname : 'firstname',
        lastname : 23
      });
  
      expect(res.statusCode).toEqual(httpStatusCode.BAD_REQUEST);
      expect(res.body).toHaveProperty('error', 'ValidationError');
      expect(res.body).toHaveProperty('message', expect.any(String));
    })

    it('Using already existing email in db 409', async ()=>{

      // User with this email is already in databse 
      // for user creation look at jest.setup.js 
      let body = {
        username: 'user0',
        email: mockData.user1.email,
        password: "test_password"
      }

      res = await request(app)
      .post('/register')
      .send(body);
  
      expect(res.statusCode).toEqual(httpStatusCode.CONFLICT);
      expect(res.body).toHaveProperty('error', 'AlreadyInUseError');
      expect(res.body).toHaveProperty('message', expect.any(String));
    })
  })
 
  describe('POST /login', ()=>{

    it('Correct response 200', async()=>{
      let res = await request(app)
      .post('/login')
      .send({
        email: mockData.user1.email,
        password: mockData.user1.password,
      });
  
      expect(res.statusCode).toEqual(httpStatusCode.OK);
      expect(res.body).toHaveProperty('token', expect.any(String));
    });

    it('Invalid login data 401', async()=>{
      let res = await request(app)
      .post('/login')
      .send({
        email: 'incorect_test@email.com',
        password: 'test_password'
      });
  
      expect(res.statusCode).toEqual(httpStatusCode.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Invalid email or password');
      expect(res.body).toHaveProperty('error', 'AuthenticationError');
    })
  });

  describe('GET /account/:uuid', ()=>{

    it('correct response 200', async()=>{
      let uuid = mockData.user1.uuid
      let res = await request(app)
      .get(`/account/${uuid}`)
      .send({});

      expect(res.statusCode).toEqual(httpStatusCode.OK)
      expect(res.body).toHaveProperty('user', expect.any(Object))
    })

    it('account not found 404', async()=>{
      let uuid = 'u_incorect_uuid'
      let res = await request(app)
      .get(`/account/${uuid}`)
      .send({});

      expect(res.statusCode).toEqual(httpStatusCode.NOT_FOUND);
      expect(res.body).toHaveProperty('error', 'NotFoundError');
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/user .* was not found/)
    })
  });

  describe('PATCH /account/:uuid', ()=>{
    
    it('correct response 200', async ()=>{
      let res = await request(app)
      .patch(`/account/${mockData.user1.uuid}`)
      .set('Authorization', `${mockData.user1.authToken}`)
      .send({
          username : "new_username", 
          firstname : "new_firstname",
      })

      let user = await db.userRepo.FindByUuid(mockData.user1.uuid); 
      expect(res.statusCode).toEqual(200); 
      expect(user.username).toEqual("new_username"); 
      expect(user.firstname).toEqual("new_firstname"); 

      // clean up to persist previous state of uesr1 document in db
      await db.userRepo.updateOne({uuid : mockData.user1.uuid},{
          firstname : mockData.user1.firstname,
          username : mockData.user1.username,
        })

    }); 

    it('forbiden request unmodifieable fields 403', async ()=>{
      let res = await request(app)
      .patch(`/account/${mockData.user1.uuid}`)
      .set('Authorization', `${mockData.user1.authToken}`)
      .send({
          password : "new_password", 
          uuid : "u123456"
      })

      expect(res.statusCode).toEqual(403); 
      expect(res.body).toHaveProperty("error", "ImmutableFieldError"); 
      expect(res.body).toHaveProperty("message", expect.any(String));
    })

    it('bad request not valid request 400', async()=>{
      let res = await request(app)
      .patch(`/account/${mockData.user1.uuid}`)
      .set('Authorization', `${mockData.user1.authToken}`)
      .send({
        username : 23, 
        firstname : true, 
        notDefinedField : "value",
      });

      expect(res.statusCode).toEqual(400); 
      expect(res.body).toHaveProperty("error", "ValidationError"); 
      expect(res.body).toHaveProperty("message", expect.any(String)); 

    })
  })

  describe('GET /account/:uuid/event', ()=>{
    it.todo('to do')
  })
  describe('GET /account/:uuid/meet', ()=>{
    it.todo('to do')
  })
  describe('GET /account/:uuid/project', ()=>{
    it.todo('to do')
  })

});