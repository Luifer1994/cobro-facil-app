export interface GetCitiesResponse {
  status: string;
  message: string;
  data: City[];
}

export interface City {
  id: number;
  name: string;
  department_id: number;
  department: Department;
}

export interface CityState {
  cities: City[];
  loading: boolean;
}

export interface Department {
  id: number;
  name: string;
  country_id: number;
  country: Country;
}

export interface Country {
  id: number;
  name: string;
}
