const chai = require('chai');
const chaiHttp = require('chai-http');

// Use Chai HTTP plugin
chai.use(chaiHttp);

// Set up expect from Chai
const expect = chai.expect;



describe('Notes Controller Tests', () => {

    let noteId = '';
    let yourTestToken = '';
    describe('login', () => {
        it('should login a user', async () => {
            const res = await chai.request('http://localhost:5001')
                .post('/api/auth/login')
                .send({
                    email: 'srana1_be21@thapar.edu',
                    password: 'test12345'
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('user');
            expect(res.body).to.have.property('token');
            yourTestToken = res.body.token;
        });
    });

    describe('getNotes', () => {
        it('should get user notes', async () => {
            const res = await chai.request('http://localhost:5001')
                .get('/api/notes')
                .set('Authorization', `Bearer ${yourTestToken}`); // Include a valid test token

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('notes');
            expect(res.body.notes).to.be.an('array');
        });
    });

    describe('getNote', () => {
        it('should get a specific note', async () => {
            // Adjust this test based on your specific scenario
            const res = await chai.request('http://localhost:5001')
                .get('/api/notes/6595abdc1d48fd56fc9de409') // Replace with a valid note ID
                .set('Authorization', `Bearer ${yourTestToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('note');
        });
    });

    describe('createNote', () => {
        it('should create a note', async () => {
            // Adjust this test based on your specific scenario
            const res = await chai.request('http://localhost:5001')
                .post('/api/notes')
                .set('Authorization', `Bearer ${yourTestToken}`)
                .send({
                    title: 'Test Note',
                    content: 'This is a test note'
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('username');
            expect(res.body).to.have.property('note');
            expect(res.body.note).to.have.property('title');
            expect(res.body.note).to.have.property('content');
            expect(res.body.note).to.have.property('_id');
            expect(res.body.note).to.have.property('createdAt');
            expect(res.body.note).to.have.property('updatedAt');
            expect(res.body.note).to.have.property('__v', 0);
            noteId = res.body.note._id;
        });
    });

    describe('updateNote', () => {
        it('should update a note', async () => {
            // Adjust this test based on your specific scenario
            const res = await chai.request('http://localhost:5001')
                .put(`/api/notes/${noteId}`) // Replace with a valid note ID
                .set('Authorization', `Bearer ${yourTestToken}`)
                .send({
                    title: 'Test Note',
                    content: 'This is a test note'
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('note');
        });
    });

    describe('share Note', () => {
        it('should share a note with a valid user', async () => {
            const res = await chai.request('http://localhost:5001')
                .post(`/api/notes/${noteId}/share`)
                .set('Authorization', `Bearer ${yourTestToken}`)
                .send({
                    username: 'shreyasrana123'
                });

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('note');

        });
    });
    describe('user not found', () => {
        it('should fail to share a note with an invalid user', async () => {
            const res = await chai.request('http://localhost:5001')
                .post(`/api/notes/${noteId}/share`)
                .set('Authorization', `Bearer ${yourTestToken}`)
                .send({
                    username: 'shreyasrana1234'
                });

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message');
        });
    });

    describe('note already shared', () => {
        it('should fail to share a note that is already shared', async () => {
            const res = await chai.request('http://localhost:5001')
                .post(`/api/notes/${noteId}/share`)
                .set('Authorization', `Bearer ${yourTestToken}`)
                .send({
                    username: 'shreyasrana12'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message').that.equals('Note already shared with this user');
        });
    });

    describe('search query', () => {
        it('should search for a note', async () => {
            const res = await chai.request('http://localhost:5001')
                .get(`/api/search?q=test`)
                .set('Authorization', `Bearer ${yourTestToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('notes');
        });
    });

    describe('deleteNote', () => {
        it('should delete a note', async () => {
            // Adjust this test based on your specific scenario
            const res = await chai.request('http://localhost:5001')
                .delete(`/api/notes/${noteId}`) // Replace with a valid note ID
                .set('Authorization', `Bearer ${yourTestToken}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Note deleted successfully');
        });
    });

    describe('Unauthorized Deletion', () => {
        it('should fail to delete a note without authorization', async () => {
            const deleteResponse = await chai.request('http://localhost:5001')
                .delete(`/api/notes/${noteId}`);

            expect(deleteResponse).to.have.status(401);
            expect(deleteResponse.body).to.have.property('status').that.equals(false);

            expect(deleteResponse.body).to.have.property('errors');
        });
    });


    after(async () => {
        // You might need to handle cleanup or teardown here
    });
});