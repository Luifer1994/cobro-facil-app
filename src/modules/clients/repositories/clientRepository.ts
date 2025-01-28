import axiosHttp from "@/utils/axios";
import type {
  Client,
  ClientListResponse,
} from "@/modules/clients/types/clientInterfaces";

export const ClientRepository = {
  fetchClients: async (
    limit: number,
    search: string,
    page: number
  ): Promise<ClientListResponse> => {
    const response = await axiosHttp.get("clients/list", {
      params: {
        limit,
        search,
        page,
      },
    });
    return response.data;
  },

  getClientById: async (id: number): Promise<Client> => {
    const response = await axiosHttp.get(`clients/show/${id}`);
    return response.data.data;
  },

  createClient: async (client: Client): Promise<void> => {
    await axiosHttp.post("clients/create", client);
  },

  updateClient: async (client: Client): Promise<void> => {
    await axiosHttp.put(`clients/update/${client.id}`, client);
  },

  getActiveClients: async (): Promise<Client[]> => {
    const response = await axiosHttp.get("clients/list-active");
    return response.data.data;
  },
};
