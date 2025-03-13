import admin from "firebase-admin"
import { getStorage } from "firebase-admin/storage"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })
}

export const storage = getStorage().bucket()
export const db = getFirestore()
