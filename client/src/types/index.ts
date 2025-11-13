export interface Branch {
  id: string;
  code: string;
  name: string;
  slug: string;
  totalSubjects: number;
}

export interface SubjectsResponse {
  branch: {
    code: string;
    name: string;
    slug: string;
  };
  semester: string;
  subjects: SubjectSummary[];
}

export interface SubjectSummary {
  name: string;
  slug: string;
  totalPyqs: number;
}

export interface PyqItem {
  id: string;
  title: string;
  file: string;
  year: number;
  sizeBytes: number;
}

export interface PyqResponse {
  branch: string;
  semester: string;
  subject: string;
  items: PyqItem[];
}

export interface AuthUser {
  name: string;
  email: string;
  branch: string;
  branchSlug: string;
}

export interface LoginPayload {
  name: string;
  email: string;
  password: string;
  branch: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface BookmarkItem {
  id: string;
  pyqId: string;
  title: string;
  subjectName: string;
  subjectSlug: string;
  branchSlug: string;
  semester: string;
  file: string;
  year: number;
  sizeBytes: number;
}

export interface AnalyticsResponse {
  views: Record<string, number>;
  downloads: Record<string, number>;
}

