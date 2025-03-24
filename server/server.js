import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import admin from 'firebase-admin';

import scoreRoutes from './routes/score.routes.js';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

let firebaseInitialized = false;

try {

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {

        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('Firebase Admin SDK initialized successfully');
        firebaseInitialized = true;
    } else {
        console.warn('Firebase configuration missing. Authentication not available.');
    }
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
}

const verifyFirebaseToken = async (req, res, next) => {

    if (!firebaseInitialized) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        next();
    }
};

app.use(cors());
app.use(express.json());
app.use(verifyFirebaseToken);

app.use('/api/scores', scoreRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Test API route working successfully!' });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
    });
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });
}); 