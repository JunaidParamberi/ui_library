import type {
  ApprovalDecision,
  PersistedQuotation,
  QuotationAggregateData,
} from "./quotation.types";

export interface QuotationApi {
  list(): Promise<PersistedQuotation[]>;
  get(id: string): Promise<PersistedQuotation | undefined>;
  create(data: QuotationAggregateData): Promise<PersistedQuotation>;
  update(id: string, patch: Partial<QuotationAggregateData>): Promise<PersistedQuotation>;
  remove(id: string): Promise<void>;
  submitForApproval(id: string): Promise<PersistedQuotation>;
  decide(
    id: string,
    approverId: string,
    decision: "APPROVED" | "REJECTED",
    comment?: string,
  ): Promise<PersistedQuotation>;
}

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function seedQuotations(): PersistedQuotation[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid(),
      quotationNumber: "Q-1001",
      quotationDate: "2026-07-01",
      status: "DRAFT",
      customer: { name: "Northwind Labs", address: "Mumbai 400013, India", phoneNumber: "+91 22 555 0100", emailId: "priya@northwind.io" },
      items: [
        { category: "Site Engineer", quantity: "2", rate: "1200", otRate: "180" },
        { category: "Mason", quantity: "6", rate: "400", otRate: "60" },
      ],
      approvers: [
        { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "PENDING" },
      ],
      createdAt: now, updatedAt: now, createdBy: "system",
    },
    {
      id: uid(),
      quotationNumber: "Q-1002",
      quotationDate: "2026-07-03",
      status: "PENDING_APPROVAL",
      customer: { name: "Phoenix Mills", address: "Lower Parel, Mumbai", phoneNumber: "+91 22 555 0200", emailId: "ops@phoenix.io" },
      items: [{ category: "Scaffolder", quantity: "4", rate: "500", otRate: "75" }],
      approvers: [
        { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "APPROVED", requestedAt: now, approvedAt: now },
        { approverId: "u2", approverName: "Sam Ali", approverEmail: "sam@studio.com", decision: "PENDING", requestedAt: now },
      ],
      createdAt: now, updatedAt: now, createdBy: "system",
    },
  ];
}

export function createMockQuotationApi(seed: PersistedQuotation[] = seedQuotations()): QuotationApi {
  const store = new Map<string, PersistedQuotation>(seed.map((q) => [q.id, q]));
  let counter = 1002 + seed.length;

  const require_ = (id: string): PersistedQuotation => {
    const q = store.get(id);
    if (!q) throw new Error(`Quotation not found: ${id}`);
    return q;
  };
  const touch = (q: PersistedQuotation): PersistedQuotation => {
    const next = { ...q, updatedAt: new Date().toISOString() };
    store.set(q.id, next);
    return next;
  };

  return {
    async list() { await delay(); return [...store.values()]; },
    async get(id) { await delay(); return store.get(id); },
    async create(data) {
      await delay();
      const now = new Date().toISOString();
      counter += 1;
      const q: PersistedQuotation = {
        ...data,
        id: uid(),
        quotationNumber: data.quotationNumber || `Q-${counter}`,
        status: "DRAFT",
        createdAt: now, updatedAt: now, createdBy: "system",
      };
      store.set(q.id, q);
      return q;
    },
    async update(id, patch) {
      await delay();
      return touch({ ...require_(id), ...patch });
    },
    async remove(id) { await delay(); require_(id); store.delete(id); },
    async submitForApproval(id) {
      await delay();
      const q = require_(id);
      const now = new Date().toISOString();
      return touch({
        ...q,
        status: "PENDING_APPROVAL",
        approvers: q.approvers.map((a) => ({ ...a, decision: "PENDING" as ApprovalDecision, requestedAt: now })),
      });
    },
    async decide(id, approverId, decision, comment) {
      await delay();
      const q = require_(id);
      const now = new Date().toISOString();
      const approvers = q.approvers.map((a) =>
        a.approverId === approverId
          ? { ...a, decision, comment, approvedAt: now }
          : a,
      );
      const status = approvers.some((a) => a.decision === "REJECTED")
        ? "REJECTED"
        : approvers.every((a) => a.decision === "APPROVED")
          ? "APPROVED"
          : "PENDING_APPROVAL";
      return touch({ ...q, approvers, status });
    },
  };
}
