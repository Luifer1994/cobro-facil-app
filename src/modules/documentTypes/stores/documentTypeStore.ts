import { defineStore } from "pinia";
import type {
    DocumentType,
    DocumentTypeState,
} from "@/modules/documentTypes/types/documentTypeInterfaces";

export const useDocumentTypeStore = defineStore({
    id: "documentTypeStore",
    state: (): DocumentTypeState => ({
        documentTypes: [],
    }),

    actions: {
        setDocumentTypes(documentTypes: DocumentType[]) {
            this.documentTypes = documentTypes;
        },
    },
});
