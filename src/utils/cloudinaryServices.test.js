import cloudinary from './cloudinaryServices';

describe('Cloudinary Configuration', () => {
    it('should be configured with the correct cloud name, api key, and api secret', () => {
        expect(cloudinary.config).toBeDefined();
        expect(cloudinary.config.cloud_name).toBe('dqn1j6ibx');
        expect(cloudinary.config.api_key).toBe('437446844599716');
        expect(cloudinary.config.api_secret).toBe('6qul0HL3ULlOcDspQcLbBVO2uHs');
    });
});