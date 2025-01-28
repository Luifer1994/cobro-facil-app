export interface ListDocumentTypeResponse {
    status: string;
    message: string;
    data: DocumentType[];
}

export interface DocumentType {
    id: string;
    name: string;
    code: string;
}

export interface DocumentTypeState {
    documentTypes: DocumentType[];
    loading: boolean;
}