export interface GetRolesResponse {
    status:  string;
    message: string;
    data:    Role[];
}

export interface Role {
    id:   number;
    name: string;
    code: string;
    description: string;
}


export interface RoleState {
    roles: Role[];
    loading: boolean;
}