import express from 'express';
import request from 'supertest';
import { commonUploadMiddleware } from './uploadFile';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(commonUploadMiddleware);

app.post('/upload', (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' });
});

describe('commonUploadMiddleware', () => {
    it('should parse form data successfully', async () => {
        const response = await request(app)
            .post('/upload')
            .field('file', 'test-file-content');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File uploaded successfully');
    });

    it('should return 400 if form data parsing fails', async () => {
        const response = await request(app)
            .post('/upload')
            .set('Content-Type', 'application/json')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to parse form data');
    });
});