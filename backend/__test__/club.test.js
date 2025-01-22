const request = require('supertest');
const app = require('../app');
const httpStatusCode = require('../utils/httpStatusCodes');

describe("Club TESTS:", ()=>{
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
    
      describe('POST /:uni/:clubname/join', ()=>{
    
        it('correct response 200', async()=>{      
    
          let loginRes = await request(app)
          .post('/login')
          .send({
            email: mockData.user1.email,
            password: mockData.user1.password
          });
    
          expect(loginRes.body).toHaveProperty("token", expect.any(String))
          
          let token = loginRes.body.token
          let club = mockData.club1;
    
          let res = await request(app)
          .get(`/${club.university}/${club.name}/join`)
          .set('Authorization', `${token}`)
          .send({});
    
          //expect(res.body).toHaveProperty()
    
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