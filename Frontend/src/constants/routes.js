export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Candidate
  CANDIDATE_DASHBOARD: "/candidate/dashboard",
  CANDIDATE_PROFILE: "/candidate/profile",
  CANDIDATE_RESUME: "/candidate/resume",
  CANDIDATE_JOBS: "/candidate/jobs",
  CANDIDATE_JOB: (id) => `/candidate/jobs/${id}`,
  CANDIDATE_SAVED_JOBS: "/candidate/saved-jobs",
  CANDIDATE_APPLICATIONS: "/candidate/applications",
  CANDIDATE_APPLICATION: (id) => `/candidate/applications/${id}`,
  CANDIDATE_INTERVIEWS: "/candidate/interviews",
  CANDIDATE_OFFERS: "/candidate/offers",
  CANDIDATE_NOTIFICATIONS: "/candidate/notifications",

  // Recruiter
  RECRUITER_DASHBOARD: "/recruiter/dashboard",
  RECRUITER_COMPANY: "/recruiter/company",
  RECRUITER_COMPANY_CREATE: "/recruiter/company/create",
  RECRUITER_COMPANY_EDIT: "/recruiter/company/edit",
  RECRUITER_JOBS: "/recruiter/jobs",
  RECRUITER_JOB_CREATE: "/recruiter/jobs/create",
  RECRUITER_JOB_EDIT: (id) => `/recruiter/jobs/${id}/edit`,
  RECRUITER_JOB_APPLICANTS: (id) => `/recruiter/jobs/${id}/applicants`,
  RECRUITER_APPLICATIONS: "/recruiter/applications",
  RECRUITER_APPLICATION: (id) => `/recruiter/applications/${id}`,
  RECRUITER_INTERVIEWS: "/recruiter/interviews",
  RECRUITER_OFFERS: "/recruiter/offers",
  RECRUITER_NOTIFICATIONS: "/recruiter/notifications",
  RECRUITER_CANDIDATE: (id) => `/recruiter/candidates/${id}`,

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_COMPANIES: "/admin/companies",
  ADMIN_VERIFICATION: "/admin/verification",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
};

export const ROLE_DASHBOARDS = {
  candidate: ROUTES.CANDIDATE_DASHBOARD,
  recruiter: ROUTES.RECRUITER_DASHBOARD,
  admin: ROUTES.ADMIN_DASHBOARD,
};
