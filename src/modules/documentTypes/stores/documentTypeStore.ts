import { defineStore } from "pinia";
import type {
    DocumentType,
    DocumentTypeState,
} from "@/modules/documentTypes/types/documentTypeInterfaces";

export const useDocumentTypeStore = defineStore({
    id: "documentTypeStore",
    state: (): DocumentTypeState => ({
        documentTypes: [],
        loading: false,
    }),

    actions: {
        setDocumentTypes(documentTypes: DocumentType[]) {
            this.documentTypes = documentTypes;
        },
        setLoading(isLoading: boolean) {
            this.loading = isLoading;
        },
    },
});
