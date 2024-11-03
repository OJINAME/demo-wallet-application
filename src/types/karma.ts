export interface KarmaReportingEntity {
    name: string;
    email: string;
  }
  
  export interface KarmaType {
    karma: string;
  }
  
  export interface KarmaIdentityType {
    identity_type: 'Email' | 'Phone' | 'Domain' | 'BVN' | 'NUBAN';
  }
  
  export interface KarmaResponseData {
    karma_identity: string;
    amount_in_contention: string;
    reason: string | null;
    default_date: string;
    karma_type: KarmaType;
    karma_identity_type: KarmaIdentityType;
    reporting_entity: KarmaReportingEntity;
  }
  
  export interface KarmaMeta {
    cost: number;
    balance: number;
  }
  
  export interface KarmaCheckResponse {
    status: string;
    message: string;
    data: KarmaResponseData | null;
    meta: KarmaMeta;
  }