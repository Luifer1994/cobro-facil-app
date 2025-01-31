// src/modules/loans/composables/offlineLoans.ts

import { getDB } from '@/offline/offlineDB'
import axiosHttp from '@/utils/axios'
import type { Loan } from '@/modules/loans/types/loanInterfaces';

/**
 * Guarda un prestamo (generalmente creado offline) en la store 'loans_offline'.
 */
export async function saveLoanOffline(loan: Loan) {
  const db = await getDB()
  const rawLoan = JSON.parse(JSON.stringify(loan))
  await db.put('loans_offline', rawLoan)
  console.log('prestamo guardado offline (create):', rawLoan)
}

/**
 * Actualiza un prestamo en 'loans_offline'. 
 * - Si es localOnly=true, solo se guardan sus cambios localmente.
 * - Si es localOnly=false (existe en server), le pondremos pendingUpdate=true para luego sincronizar.
 */
export async function updateLoanOffline(loan: Loan) {
  const db = await getDB()
  const rawLoan = JSON.parse(JSON.stringify(loan))
  await db.put('loans_offline', rawLoan)
  console.log('prestamo actualizado offline (update):', rawLoan)
}

/**
 * Guarda la lista de prestamos que vienen del servidor, marcándolos localOnly = false.
 * Realizamos un "merge" para no perder los localOnly.
 */
export async function saveLoansOffline(serverLoans: Loan[]) {
  const db = await getDB()

  // Obtenemos todo lo existente
  const existing = await db.getAll('loans_offline')

  const tx = db.transaction('loans_offline', 'readwrite')

  for (const serverC of serverLoans) {
    serverC.localOnly = false
    serverC.pendingUpdate = false
    const raw = JSON.parse(JSON.stringify(serverC))
    await tx.store.put(raw)
  }
  await tx.done
  console.log('prestamos (server) mergeados en offline:', serverLoans)
}

/**
 * Retorna TODOS los prestamos en 'loans_offline'.
 */
export async function getOfflineLoans(): Promise<Loan[]> {
  const db = await getDB()
  const all = await db.getAll('loans_offline')
  return all
}

/**
 * Elimina un prestamo local por ID (autoIncrement o real).
 */
export async function removeOfflineLoan(id: number) {
  const db = await getDB()
  await db.delete('loans_offline', id)
  console.log('prestamo offline eliminado, ID:', id)
}

/**
 * Sincroniza los prestamos con el servidor:
 *  1) localOnly=true => POST /loans/create
 *  2) pendingUpdate=true => PUT /loans/update/:id
 */
export async function syncOfflineLoans() {
  const db = await getDB()
  const list = await db.getAll('loans_offline')

  for (const loan of list) {
    try {
      if (loan.localOnly) {
        // Aún no existe en el server => POST create
        const resp = await axiosHttp.post('loans/create', loan)
        const created = resp.data.data as Loan

        // Eliminamos el loan local "viejo"
        if (loan.id != null) {
          await removeOfflineLoan(loan.id)
        }
        // Insertamos el loan creado: localOnly=false
        created.localOnly = false
        created.pendingUpdate = false
        const rawCreated = JSON.parse(JSON.stringify(created))
        await db.put('loans_offline', rawCreated)

        console.log('prestamo creado en server y offline:', created)
      }
      else if (loan.pendingUpdate) {
        // Ya existe en el server => PUT update
        if (!loan.id) {
          console.error('prestamo sin id, no se puede PUT:', loan)
          continue
        }
        const resp = await axiosHttp.put(`loans/update/${loan.id}`, loan)
        const updated = resp.data.data as Loan

        // Eliminamos el Loan local "viejo"
        await removeOfflineLoan(loan.id)

        updated.localOnly = false
        updated.pendingUpdate = false
        const rawUpdated = JSON.parse(JSON.stringify(updated))
        await db.put('loans_offline', rawUpdated)

        console.log('prestamo actualizado en server y offline:', updated)
      }
      else {
        // Ni localOnly ni pendingUpdate => no hacemos nada
        // (ya sincronizado)
      }
    } catch (error) {
      console.error('Fallo al sincronizar prestamo offline:', loan, error)
    }
  }
}