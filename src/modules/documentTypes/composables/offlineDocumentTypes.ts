import { getDB } from '@/offline/offlineDB'
import type { DocumentType } from '../types/documentTypeInterfaces'

/** Guardar DocumentTypes en la store 'documentTypes_offline' */
export async function saveDocumentTypesOffline(documentTypes: DocumentType[]) {
  const db = await getDB()
  const tx = db.transaction('documentTypes_offline', 'readwrite')
  // Limpiamos la store para evitar duplicados
  await tx.store.clear()
  for (const docType of documentTypes) {
    await tx.store.put(docType)
  }
  await tx.done
  console.log('DocumentTypes guardados offline:', documentTypes)
}

/** Obtener los DocumentTypes de la store 'documentTypes_offline' */
export async function getDocumentTypesOffline(): Promise<DocumentType[]> {
  const db = await getDB()
  const docTypesOffline = await db.getAll('documentTypes_offline')
  console.log('DocumentTypes offline:', docTypesOffline)
  return docTypesOffline
}
