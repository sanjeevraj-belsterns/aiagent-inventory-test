import request from 'supertest';
import express from 'express';
import { commonUploadMiddleware } from '../../src/middlewares/uploadFile';

const app = express();
app.use(express.json());
app.post('/upload', commonUploadMiddleware, (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' });
});

describe('commonUploadMiddleware', () => {
    it('should parse form data successfully', async () => {
        const response = await request(app)
            .post('/upload')
            .attach('file', 'path/to/test/file.txt');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File uploaded successfully');
    });

    it('should return 400 if form data parsing fails', async () => {
        const response = await request(app)
            .post('/upload')
            .send({}); // Sending empty data to trigger error
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to parse form data');
    });
});