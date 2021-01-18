import dotenv from 'dotenv';

dotenv.config();

export default {
    /* Below is our connection to the MongoDb environment */
    MONGODB_URL: process.env.MONGODB_URL,
    /* Below is the master key that encrypts my web token for my users. This is originally located in the .env file */
    JWT_SECRET: process.env.JWT_SECRET,
    /* Below is our connection to the Paypal client */
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
};
