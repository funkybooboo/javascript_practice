import {z} from 'zod';

const schema = z.object({
    name: z.string().min(1).max(255),
    price: z.number().min(0.01).max(1000),
});

export default schema;