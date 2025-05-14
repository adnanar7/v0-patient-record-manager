"use client"

import { db, storage } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

export interface MedicalRecord {
  id?: string
  userId: string
  title: string
  type: "prescription" | "lab_result" | "doctor_note" | "imaging" | "other"
  date: Date
  provider: string
  notes: string
  fileUrl?: string
  fileName?: string
  laymanSummary?: string
  doctorSummary?: string
  createdAt?: any
  updatedAt?: any
}

export async function addRecord(
  record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">,
  file?: File,
): Promise<string> {
  try {
    let fileUrl = ""
    let fileName = ""

    if (file) {
      const storageRef = ref(storage, `records/${record.userId}/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      fileUrl = await getDownloadURL(storageRef)
      fileName = file.name
    }

    const docRef = await addDoc(collection(db, "records"), {
      ...record,
      fileUrl,
      fileName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding record:", error)
    throw error
  }
}

export async function updateRecord(id: string, data: Partial<MedicalRecord>, file?: File): Promise<void> {
  try {
    const recordRef = doc(db, "records", id)
    const record = await getDoc(recordRef)

    if (!record.exists()) {
      throw new Error("Record not found")
    }

    let fileUrl = data.fileUrl || record.data().fileUrl
    let fileName = data.fileName || record.data().fileName

    if (file) {
      // Delete old file if it exists
      if (record.data().fileUrl) {
        try {
          const oldFileRef = ref(storage, record.data().fileUrl)
          await deleteObject(oldFileRef)
        } catch (error) {
          console.error("Error deleting old file:", error)
        }
      }

      // Upload new file
      const storageRef = ref(storage, `records/${record.data().userId}/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      fileUrl = await getDownloadURL(storageRef)
      fileName = file.name
    }

    await updateDoc(recordRef, {
      ...data,
      fileUrl,
      fileName,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating record:", error)
    throw error
  }
}

export async function deleteRecord(id: string): Promise<void> {
  try {
    const recordRef = doc(db, "records", id)
    const record = await getDoc(recordRef)

    if (!record.exists()) {
      throw new Error("Record not found")
    }

    // Delete file if it exists
    if (record.data().fileUrl) {
      try {
        const fileRef = ref(storage, record.data().fileUrl)
        await deleteObject(fileRef)
      } catch (error) {
        console.error("Error deleting file:", error)
      }
    }

    await deleteDoc(recordRef)
  } catch (error) {
    console.error("Error deleting record:", error)
    throw error
  }
}

export async function getUserRecords(userId: string): Promise<MedicalRecord[]> {
  try {
    const q = query(collection(db, "records"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as MedicalRecord,
    )
  } catch (error) {
    console.error("Error getting user records:", error)
    throw error
  }
}

export async function getRecord(id: string): Promise<MedicalRecord> {
  try {
    const docRef = doc(db, "records", id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error("Record not found")
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as MedicalRecord
  } catch (error) {
    console.error("Error getting record:", error)
    throw error
  }
}
