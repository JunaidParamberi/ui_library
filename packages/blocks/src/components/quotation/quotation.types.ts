export type QuotationStatus =
  | "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT" | "REJECTED";
export type ApprovalDecision = "PENDING" | "APPROVED" | "REJECTED";

export interface ApprovalStep {
  approverId: string;
  approverName: string;
  approverEmail: string;
  decision: ApprovalDecision;
  comment?: string;
  requestedAt?: string;
  approvedAt?: string;
}

export interface Customer {
  name: string;
  address: string;
  phoneNumber: string;
  emailId: string;
}

export interface QuotationItem {
  category: string;
  quantity: string;
  rate: string;
  otRate: string;
}

export interface QuotationPersistedMeta {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface QuotationAggregateData {
  quotationNumber: string;
  quotationDate: string;
  customer: Customer;
  status: QuotationStatus;
  approvers: ApprovalStep[];
  items: QuotationItem[];
}

export type PersistedQuotation =
  QuotationAggregateData & QuotationPersistedMeta & { id: string };
