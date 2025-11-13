import axios from 'axios';
import type {
  AnalyticsResponse,
  Branch,
  LoginPayload,
  LoginResponse,
  PyqResponse,
  SubjectsResponse
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchBranches = async (): Promise<Branch[]> => {
  const { data } = await api.get<Branch[]>('/api/branches');
  return data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/api/auth/login', payload);
  return data;
};

export const fetchSubjects = async (
  branch: string,
  semester: string
): Promise<SubjectsResponse> => {
  const { data } = await api.get<SubjectsResponse>('/api/subjects', {
    params: { branch, semester }
  });
  return data;
};

export const fetchPyqs = async (
  branch: string,
  semester: string,
  subject: string
): Promise<PyqResponse> => {
  const { data } = await api.get<PyqResponse>('/api/pyqs', {
    params: { branch, semester, subject }
  });
  return data;
};

export const fetchAnalytics = async (): Promise<AnalyticsResponse> => {
  const { data } = await api.get<AnalyticsResponse>('/api/analytics');
  return data;
};

export const buildViewUrl = (params: {
  branch: string;
  sem: string;
  subject: string;
  id: string;
}) => {
  const url = new URL('/files/view', api.defaults.baseURL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export const buildDownloadUrl = (params: {
  branch: string;
  sem: string;
  subject: string;
  id: string;
}) => {
  const url = new URL('/files/download', api.defaults.baseURL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export default api;

