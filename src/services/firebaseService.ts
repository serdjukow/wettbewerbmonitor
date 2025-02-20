import { db } from "@/src/firebase"
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
    getDoc,
} from "firebase/firestore"
import { Company } from "@/src/utils/types"
import { toast } from "react-toastify"
import { auth } from "@/src/firebase"
import { onAuthStateChanged } from "firebase/auth"

const removeUndefinedFields = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
        return obj.map(removeUndefinedFields)
    } else if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, removeUndefinedFields(value)])
        )
    }
    return obj
}

export const addCompanyToDB = async (company: Omit<Company, "uuid">) => {
    try {
        const user = auth.currentUser
        if (!user) {
            toast.error("User is not authenticated!")
            throw new Error("User not authenticated")
        }
        const companiesCollection = collection(
            db,
            `users/${user.uid}/companies`
        )
        const cleanedCompany = removeUndefinedFields(company)
        const docRef = await addDoc(companiesCollection, cleanedCompany)
        const firestoreId = docRef.id
        await updateDoc(doc(db, `users/${user.uid}/companies/${firestoreId}`), {
            uuid: firestoreId,
        })
        toast.success("The company was successfully added!")
        return { ...company, uuid: firestoreId }
    } catch (error) {
        toast.error(`Error when adding a company: ${error}`)
        throw error
    }
}

export const getCompanies = async (): Promise<Company[]> => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) return
            try {
                const userCompaniesCollection = collection(
                    db,
                    `users/${user.uid}/companies`
                )
                const querySnapshot = await getDocs(userCompaniesCollection)
                const companies = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    uuid: doc.id,
                })) as Company[]
                resolve(companies)
            } catch (error) {
                toast.error(`Error when receiving companies: ${error}`)
                reject(error)
            }
        })
    })
}

export const deleteCompanyFromDB = async (uuid: string) => {
    try {
        const user = auth.currentUser
        if (!user) {
            throw new Error("User not authenticated")
        }
        const companyRef = doc(db, `users/${user.uid}/companies`, uuid)
        await deleteDoc(companyRef)
    } catch (error) {
        toast.error(`Error deleting company: ${error}`)
        throw error
    }
}

export const updateCompanyInDB = async (
    uuid: string,
    updatedData: Partial<Company>
) => {
    try {
        const user = auth.currentUser
        const cleanData = Object.fromEntries(
            Object.entries(updatedData).filter(([, v]) => v !== undefined)
        )
        if (!user) {
            throw new Error("User not authenticated")
        }
        const companyRef = doc(db, `users/${user.uid}/companies`, uuid)
        await updateDoc(companyRef, cleanData)
    } catch (error) {
        throw error
    }
}

export const addSistrixApiKey = async (apiKey: string) => {
    try {
        const user = auth.currentUser
        if (!user) {
            toast.error("User is not authenticated!")
            throw new Error("User not authenticated")
        }

        const userRef = doc(db, `users/${user.uid}`)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
            await setDoc(userRef, { sistrixApiKey: apiKey })
            toast.success("Sistrix API Key added successfully")
        } else {
            await updateDoc(userRef, { sistrixApiKey: apiKey })
            toast.success("Sistrix API Key updated successfully")
        }
    } catch (error) {
        toast.error(`Error adding Sistrix API Key: ${error}`)
        throw error
    }
}

export const getSistrixApiKey = async (): Promise<string | null> => {
    try {
        const user = auth.currentUser
        if (!user) {
            toast.error("User is not authenticated!")
            throw new Error("User not authenticated")
        }
        const userRef = doc(db, `users/${user.uid}`)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data()
            const apiKey = userData?.sistrixApiKey ?? null
            return apiKey
        } else {
            toast.error("User data not found")
            return null
        }
    } catch (error) {
        toast.error(`Error retrieving Sistrix API Key: ${error}`)
        throw error
    }
}