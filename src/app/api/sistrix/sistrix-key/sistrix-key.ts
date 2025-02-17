// import type { NextApiRequest, NextApiResponse } from "next"
// import { doc, getDoc } from "firebase/firestore"
// import { db, auth } from "@/src/firebase"

// import crypto from "crypto"

// const decryptApiKey = (encryptedKey: string, iv: string, secret: string): string => {
//     const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secret, "hex"), Buffer.from(iv, "hex"))
//     let decrypted = decipher.update(encryptedKey, "hex", "utf8")
//     decrypted += decipher.final("utf8")
//     return decrypted
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         const user = auth.currentUser
//         const docRef = doc(db, `users/${user?.uid}`)
//         const docSnap = await getDoc(docRef)
//         if (!docSnap.exists()) {
//             throw new Error("API key not found")
//         }
//         const data = docSnap.data()
//         if (!data || !data.encryptedKey || !data.iv) {
//             throw new Error("Invalid API key data")
//         }
//         const secret = process.env.API_KEY_SECRET
//         if (!secret) {
//             throw new Error("API_KEY_SECRET is not set")
//         }
//         const apiKey = decryptApiKey(data.encryptedKey, data.iv, secret)
//         res.status(200).json({ apiKey })
//     } catch (error: any) {
//         res.status(500).json({ error: error.message })
//     }
// }
