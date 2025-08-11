import type { BaseOut } from "./common";
import type { ApiResponse } from "./api";

export const LoanStatusEnum = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    RETURNED: 'RETURNED',
    OVERDUE: 'OVERDUE',
    CANCELLED: 'CANCELLED'
}

export type LoanStatus = typeof LoanStatusEnum[keyof typeof LoanStatusEnum];

export interface Loan extends BaseOut {
    status: LoanStatus;
    book_title: string;
    loan_data?: string;
    due_date?: string;
    return_date?: Date;
}

export type GetAllLoansResponse = ApiResponse<Loan[]>;
export type GetAllLoansByUserResponse = ApiResponse<Loan[]>;