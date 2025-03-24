import React from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Global variables
let app;
let auth;
let analytics = null;

// Initialize Firebase
try {
    console.log("Initializing Firebase with config:", JSON.stringify(firebaseConfig));
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully");

    auth = getAuth(app);
    console.log("Firebase Auth initialized successfully");

    // Analytics might not be available in all environments
    if (typeof window !== 'undefined') {
        try {
            analytics = getAnalytics(app);
            console.log("Firebase Analytics initialized successfully");
        } catch (e) {
            console.error("Analytics initialization error:", e.message);
        }
    }
} catch (error) {
    console.error("Firebase initialization error:", error.message, error.stack);
    throw new Error(`Firebase initialization failed: ${error.message}`);
}

export const registerWithEmailAndPassword = async (email, password) => {
    console.log(`Attempting to register user with email: ${email}`);
    try {
        if (!auth) {
            throw new Error("Auth is not initialized");
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Registration successful:", result.user.uid);
        return result;
    } catch (error) {
        console.error("Registration error:", error.code, error.message);
        throw error;
    }
};

export const loginWithEmailAndPassword = async (email, password) => {
    console.log(`Attempting to log in user with email: ${email}`);
    try {
        if (!auth) {
            throw new Error("Auth is not initialized");
        }
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful:", result.user.uid);
        return result;
    } catch (error) {
        console.error("Login error:", error.code, error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    console.log("Attempting to log out user");
    try {
        if (!auth) {
            throw new Error("Auth is not initialized");
        }
        await signOut(auth);
        console.log("Logout successful");
    } catch (error) {
        console.error("Logout error:", error.code, error.message);
        throw error;
    }
};

export const authStateListener = (callback) => {
    try {
        console.log("Starting auth state change listener");
        if (!auth) {
            throw new Error("Auth is not initialized");
        }

        return onAuthStateChanged(auth, user => {
            console.log("Auth state changed:", user ? `User ${user.uid}` : "No user logged in");
            callback(user);
        });
    } catch (error) {
        console.error("Error checking authentication status:", error.code, error.message);

        return () => { };
    }
};


export const getCurrentUser = () => {
    try {
        if (!auth) {
            throw new Error("Auth is not initialized");
        }

        const user = auth.currentUser;
        console.log("Current user:", user ? user.uid : "No user logged in");
        return user;
    } catch (error) {
        console.error("Error getting current user:", error.code, error.message);
        return null;
    }
};

export { auth, analytics }; 