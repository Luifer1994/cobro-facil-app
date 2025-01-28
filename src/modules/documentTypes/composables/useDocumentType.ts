import { storeToRefs } from "pinia";
import { useDocumentTypeStore } from "@/modules/documentTypes/stores/documentTypeStore";
import { DocumentTypeRepository } from "@/modules/documentTypes/repositories/documentTypeRepository";
import { getDocumentTypesOffline, saveDocumentTypesOffline } from "@/modules/documentTypes/composables/offlineDocumentTypes"; 
// ^ Ajusta la ruta si es distinta

export function useDocumentType() {
  const documentTypeStore = useDocumentTypeStore();
  const { documentTypes, loading } = storeToRefs(documentTypeStore);

  const fetchDocumentTypes = async () => {
    documentTypeStore.setLoading(true);
    try {
      if (!navigator.onLine) {
        // OFFLINE -> Cargar de IndexedDB
        const offlineData = await getDocumentTypesOffline();
        documentTypeStore.setDocumentTypes(offlineData);
      } else {
        // ONLINE -> API + guardar en IndexedDB
        const response = await DocumentTypeRepository.fetchDocumentTypes();
        documentTypeStore.setDocumentTypes(response.data);
        await saveDocumentTypesOffline(response.data);
      }
    } catch (error) {
      console.error("Error al obtener los tipos de documentos:", error);
      // fallback si la API falla
      const offlineData = await getDocumentTypesOffline();
      if (offlineData.length) {
        documentTypeStore.setDocumentTypes(offlineData);
      }
    } finally {
      documentTypeStore.setLoading(false);
    }
  };

  return {
    documentTypes,
    loading,
    fetchDocumentTypes,
  };
}
