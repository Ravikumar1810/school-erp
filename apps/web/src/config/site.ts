
export const siteConfig = {
  name: "School ERP",

  shortName: "ERP",

  title: "School ERP | Modern School Management System",

  description:
    "A modern School ERP platform that helps principals, teachers, students, and parents manage attendance, marks, classes, and academic records with a secure role-based system.",

  url: "https://school-erp.vercel.app",

  ogImage: "/og-image.png",

  author: "Ravikumar N K",

  keywords: [
    "School ERP",
    "School Management System",
    "Education ERP",
    "Attendance Management",
    "Student Management",
    "Teacher Dashboard",
    "Principal Dashboard",
    "Next.js",
    "NestJS",
    "PostgreSQL",
  ],

  links: {
    github: "https://github.com/Ravikumar1810/school-erp.git",
    linkedin: "https://www.linkedin.com/in/ravikumar-n-k/",
    portfolio: "https://ravikumarnk.vercel.app/",
  },

  navigation: [
     {
    label: "Home",
    href: "/",
  },
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Workflow",
    href: "#workflow",
  },
  {
    label: "Contact",
    href: "#contact",
  },
  ],

  auth: {
    loginRedirect: "/login",

    superAdminDashboard: "/super-admin",

    adminDashboard: "/admin",

    studentDashboard: "/student",
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} School ERP. All rights reserved.`,
  },
} as const;

export type SiteConfig = typeof siteConfig;