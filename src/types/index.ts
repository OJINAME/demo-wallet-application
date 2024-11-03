import { UserCreationDTO, LoginDTO, AuthResponse } from "./user";
import { KarmaCheckResponse, KarmaType, KarmaIdentityType, KarmaMeta, KarmaReportingEntity, KarmaResponseData } from "./karma";

export interface User {
    id: string;
    email: string;
    phone_number: string;
    password_hash: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
export interface Wallet {
id: string;
user_id: string;
balance: number;
status: 'active' | 'frozen';
created_at?: Date;
updated_at?: Date;
}

export interface Transaction {
id: string;
wallet_id: string;
type: 'deposit' | 'withdrawal' | 'transfer';
amount: number;
reference: string;
status: 'pending' | 'completed' | 'failed';
metadata?: any;
created_at?: Date;
updated_at?: Date;
}

export { UserCreationDTO, LoginDTO, AuthResponse };
export { KarmaCheckResponse, KarmaIdentityType, KarmaMeta, KarmaReportingEntity, KarmaResponseData, KarmaType }

