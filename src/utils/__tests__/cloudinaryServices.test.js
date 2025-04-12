import cloudinary from '../cloudinaryServices';

describe('Cloudinary Configuration', () => {
    it('should have the correct cloud name', () => {
        expect(cloudinary.config.cloud_name).toBe('dqn1j6ibx');
    });

    it('should have the correct api key', () => {
        expect(cloudinary.config.api_key).toBe('437446844599716');
    });

    it('should have the correct api secret', () => {
        expect(cloudinary.config.api_secret).toBe('6qul0HL3ULlOcDspQcLbBVO2uHs');
    });
});