import axiosHttp from "@/utils/axios";
import type { ListDocumentTypeResponse } from "@/modules/documentTypes/types/documentTypeInterfaces";

export const DocumentTypeRepository = {

    fetchDocumentTypes: async (): Promise<ListDocumentTypeResponse> => {
        const response = await axiosHttp.get("document-types/list");
        return response.data;
    },
    
};
