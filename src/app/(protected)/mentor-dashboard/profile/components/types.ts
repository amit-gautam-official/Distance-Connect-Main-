// types.ts
export enum CompanyType {
    STARTUP = "STARTUP",
    SME = "SME",
    ENTERPRISE = "ENTERPRISE",
  }
  
  export interface Education {
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
  }
  
  export interface Experience {
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
    current: boolean;
    proofUrl : string; // proof of experience image url
    verified: boolean;
  }