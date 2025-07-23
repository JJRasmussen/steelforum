import { Pool } from 'pg';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test'){
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
};

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    database: 
        process.env.NODE_ENV === 'test'
        ? process.env.DATABASE_TEST_NAME
        : process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;