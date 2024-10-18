const request = require('supertest');
const app = require('../app');

const mockData = require('./mockData')

describe('User workflow', ()=>{

  let user = Object.assign({}, mockData.user1);
  let club = Object.assign({}, mockData.club);

  describe('First User', () => {
    it('Register a user', async () => {
      body = {   email : user.email,
        password : user.password, 
        username: user.username,
        firstname : user.firstname,
        lastname : user.firstname
      }
      
      const res = await request(app)
        .post('/register')
        .send(body);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('uuid', expect.any(String));
      user.uuid = res.body.uuid
    });

    it('Login user', async()=>{

      const body = {
        email : user.email, 
        password : user.password
      }

      const res = await request(app)
      .post('/login')
      .send(body);

      expect(res.statusCode).toEqual(200); 
      expect(res.body).toHaveProperty('token', expect.any(String));

      user.authToken = res.body.token
    })

    it('Get user profile', async()=>{
      const res = await request(app)
      .get(`/account/${user.uuid}`)
      .send({});

      expect(res.statusCode).toEqual(200); 
      expect(res.body).toHaveProperty('user', expect.any(Object))
    })

    it('Create Club', async()=>{
      const body = {
        name : club.name,
        description : club.description, 
        rules : club.rules, 
        isopen : club.isopen
      }
      const res = await request(app)
      .post(`/${club.univeristy}/club-create`)
      .set('Authorization', `${user.authToken}`)
      .send(body);

      expect(res.statusCode).toEqual(200); 
      expect(res.body).toHaveProperty('uuid', expect.any(String));
      club.uuid = res.body.uuid; 
    })
  });


  describe('Second User', ()=>{
    let user2 = Object.assign({}, mockData.user2);  

    it('Register a user', async () => {
      body = {   email : user2.email,
        password : user2.password, 
        username: user2.username,
        firstname : user2.firstname,
        lastname : user2.firstname
      }
      const res = await request(app)
      .post('/register')
      .send(body);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('uuid', expect.any(String));
      user2.uuid = res.body.uuid
    });

    it('Login user', async()=>{

      const body = {
        email : user2.email, 
        password : user2.password
      }

      const res = await request(app)
      .post('/login')
      .send(body);

      expect(res.statusCode).toEqual(200); 
      expect(res.body).toHaveProperty('token', expect.any(String));

      user2.authToken = res.body.token
    })

    it('Send join request to club', async()=>{
      const res = await request(app)
      .post(`/${club.univeristy}/${club.name}/join`)
      .set('Authorization', `${user2.authToken}`)
      .send({});
      expect(res.statusCode).toEqual(200); 
      //expect(res.body).toHaveProperty('uuid', expect.any(String));
    
    })
  })

  describe('First User', ()=>{
    it.todo('Resolve a join Request')
  })

})