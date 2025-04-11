import express from 'express';
import request from 'supertest';
import { commonUploadMiddleware } from './uploadFile';

const app = express();

app.use(express.json());
app.post('/upload', commonUploadMiddleware, (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' });
});

describe('commonUploadMiddleware', () => {
    it('should return 400 if form data parsing fails', async () => {
        const response = await request(app)
            .post('/upload')
            .set('Content-Type', 'multipart/form-data')
            .send({}); // Sending empty form data to trigger error

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Failed to parse form data' });
    });

    it('should proceed to the next middleware if form data parsing succeeds', async () => {
        const response = await request(app)
            .post('/upload')
            .set('Content-Type', 'multipart/form-data')
            .attach('file', 'path/to/file.txt'); // Replace with a valid file path

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'File uploaded successfully' });
    });
});