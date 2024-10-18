const request = require('supertest');
const app = require('../app');
const db = require('../repositories/mongoose/index');

const {hash} = require('../utils/hash')

const httpStatusCode = require('../utils/httpStatusCodes');

describe("Request body validation tests:", ()=>{

  describe('POST /register', ()=>{

    it('correct response 200', async()=>{
      let res = await request(app)
      .post('/register')
      .send( {
        email : 'incorrect@email.com',
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

      await db.userRepo.model.deleteMany()
      let body = {
        email : 'correct@email.com',
        password : 'correct_passwd', 
        username: 'username',
        firstname : 'firstname',
        lastname : 'lastname'
      }
  
      let res = await request(app)
      .post('/register')
      .send(body);
  
      expect(res.statusCode).toEqual(httpStatusCode.OK);
      expect(res.body).toHaveProperty('uuid');
      expect(res.body.uuid).toMatch(/u.*/)
     
      res = await request(app)
      .post('/register')
      .send(body);
  
      expect(res.statusCode).toEqual(httpStatusCode.CONFLICT);
      expect(res.body).toHaveProperty('error', 'AlreadyInUseError');
      expect(res.body).toHaveProperty('message', expect.any(String));
    })
  })
 
  describe('POST /login', ()=>{

    beforeAll(async () => {
      // Directly create a user in the database without making an API call
      await db.userRepo.model.create({
        uuid: 'u123456789',
        createdAt: Date.now(), 
        username: 'test_username',
        firstname: 'tests_firstname',
        lastname: 'test_lastname',
        email: 'test@email.com',
        password: `${await hash('test_password')}` // Make sure this is a hashed password
      });
    });

    afterAll(async ()=>{
      await db.userRepo.model.deleteMany(); 
    })

    it('Correct response 200', async()=>{
      let res = await request(app)
      .post('/login')
      .send({
        email: 'test@email.com',
        password: 'test_password'
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
    beforeAll(async () => {
      // Directly create a user in the database without making an API call
      await db.userRepo.model.create({
        uuid: 'u123456789',
        createdAt: Date.now(), 
        username: 'test_username',
        firstname: 'tests_firstname',
        lastname: 'test_lastname',
        email: 'test@email.com',
        password: `${await hash('test_password')}` // Make sure this is a hashed password
      });
    });

    afterAll(async ()=>{
      await db.userRepo.model.deleteMany(); 
    })

    it('correct response 200', async()=>{
      let uuid = 'u123456789'
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
  describe('PUT /account/:uuid/edit', ()=>{
    it.todo('to do')
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
  describe('GET /account/:uuid/clubs', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname', ()=>{
    it.todo('to do')
  })
  describe('DELETE /:uni/:clubname', ()=>{
    it.todo('to do')
  })
  describe('PUT /:uni/:clubname/edit', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname/meet', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/:clubname/meet', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname/:meetName', ()=>{
    it.todo('to do')
  })
  describe('PUT /:uni/:clubname/:meetName', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/:clubname/:meetName/join', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname/event', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname/:eventName', ()=>{
    it.todo('to do')
  })
  describe('PUT /:uni/:clubname/:eventName', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/:clubname/:eventNme/join ', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname/project ', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/:clubname/project ', ()=>{
    it.todo('to do')
  })
  describe('GET /:uni/:clubname/:projectName', ()=>{
    it.todo('to do')
  })
  describe('PUT /:uni/:clubname/:projectName', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/:clubname/:projectName/join', ()=>{
    it.todo('to do')
  })

  /*
    TEST
    User join club
  */
  describe('POST /:uni/:clubname/join', ()=>{

    beforeAll(async () => {
      await db.userRepo.model.create({
        uuid: 'u123456789',
        createdAt: Date.now(), 
        username: 'test_username',
        firstname: 'tests_firstname',
        lastname: 'test_lastname',
        email: 'test@email.com',
        password: `${await hash('test_password')}` // Make sure this is a hashed password
      });

      await db.scienceClubRepo.model.create({
        uuid : "c123456789",
        name: "AKAI",
        isopen: false,
        members: [ { uuid : "u_test_user", role : "test_role"}],
        university: "PoznanUniversityOfTechnology",
        description : "test_descritpion",
        rules : "test_rules",
        joinrequests : []
      });
    });

    afterAll(async ()=>{
      await db.scienceClubRepo.model.deleteMany(); 
      await db.userRepo.model.deleteMany(); 
    })

    it('correct response 200', async()=>{      

      let loginRes = await request(app)
      .post('/login')
      .send({
        email: 'test@email.com',
        password: 'test_password'
      });

      expect(loginRes.body).toHaveProperty("token", expect.any(String))

      let club = {
        uni : "PoznanUniversityOfTechnology", 
        name : "AKAI"
      }

      let res = await request(app)
      .get(`/${club.uni}/${club.name}/join`)
      .set('Authorization', `${loginRes.body.token}`)
      .send({});

      expect(res.body).toHaveProperty()

    })
  })
  describe('GET /:uni/:clubname/:join-requests', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/:clubname/:join-requests', ()=>{
    it.todo('to do')
  })
  describe('DELETE /:uni/:clubname/leave', ()=>{
    it.todo('to do')
  })
  describe('DELETE /:uni/:clubname/kick', ()=>{
    it.todo('to do')
  })
  describe('POST /:uni/create-club', ()=>{
    it.todo('to do')
  })

})