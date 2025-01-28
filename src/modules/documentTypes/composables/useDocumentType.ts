import { storeToRefs } from "pinia";
import { useDocumentTypeStore } from "@/modules/documentTypes/stores/documentTypeStore";
import { DocumentTypeRepository } from "@/modules/documentTypes/repositories/documentTypeRepository";

export function useDocumentType() {
    const documentTypeStore = useDocumentTypeStore();
    const { documentTypes } =
        storeToRefs(documentTypeStore);

    const fetchDocumentTypes = async () => {
        try {
            const response = await DocumentTypeRepository.fetchDocumentTypes();
            documentTypeStore.setDocumentTypes(response.data);
        } catch (error) {
            console.error("Error al obtener los tipos de documentos:", error);
        }
    };

    return {
        documentTypes,
        fetchDocumentTypes,
    };
}
