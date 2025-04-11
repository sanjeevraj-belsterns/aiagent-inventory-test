import { commonUploadMiddleware } from '../src/middlewares/uploadFile';
import express from 'express';
import multer from 'multer';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use(commonUploadMiddleware);

app.post('/upload', (req, res) => {
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

    it('should return 400 if there is an error parsing form data', async () => {
        const response = await request(app)
            .post('/upload')
            .send({}); // Sending empty data to trigger error
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to parse form data');
    });
});