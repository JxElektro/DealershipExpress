import request from 'supertest';
import chai from 'chai';
import app from '../app1.js';
import User from '../models/user.js';
import getToken from './utils.js';
import { before } from 'mocha';


const { expect } = chai;

// Test The enpoint auth/register

describe('Test endpoint auth/register', () => {
 
    it('The enpoint has a 201 status and the obj cant be null', async () => {

      const payload = {
        'name': 'teast',
        'email': 'test@test.com',
        'password': '123456'
      }

      // pretends to send a post to the endpoint auth/register with the payload and await the response
      const { body, status } = await request(app).post('/auth/register').send(payload);
      expect(status).to.equal(201);

      // check if the user was created in the database
      expect(body).to.have.property('userId');
      const userId = body.userId;
      const user = await User.findByPk(userId);
      expect(user).to.not.be.null;

    });
    it('The enpoint has a 400 status if the obj is incomplete', async () => {
      const payload = {
        'name': 'test',
        'email': 'test@test.com'
      }
      // pretends to send a post to the endpoint auth/register with the payload and await the response
      const { body, status } = await request(app).post('/auth/register').send(payload);
      expect(status).to.equal(400);
    });
    
    it("should fail if email is incorrect", async () => {
      const payload = {
        'email': 'unexsitedEmail@email.com',
        'password': '123456'
      }

      const { body, status } = await request(app)
        .post('/auth/login')
        .type("json")
        .send(payload);
      expect(status).to.equal(404);
      // expect body to have a message
      expect(body.message).contains('No user found with email');
    });
    it("should fail if password is incorrect", async () => {
      const payload = {
        'email': 'test@test.com',
        'password': 'badPassword'
      }
      const { body, status } = await request(app)
        .post('/auth/login')
        .type("json")
        .send(payload);
      expect(status).to.equal(401);
      // expect body to have a message
      expect(body.message).contains('Invalid Password');
    });

  });
