import {z} from 'zod';

const schema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255)
});

export default schema;