export interface Application {
    id: number;
    fullName: string;
    contactNumber: string;
    education: string;
    skills: string;
    appliedAt: string; // or Date, depending on your data type
    status: string;
    resumeLink: string | null;
  }
  