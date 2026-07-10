import { describe, it, expect } from "vitest";
import { createMockQuotationApi, seedQuotations } from "./quotation.mock";
import type { QuotationAggregateData } from "./quotation.types";

const draft = (): QuotationAggregateData => ({
  quotationNumber: "",
  quotationDate: "2026-07-09",
  customer: { name: "Acme", address: "Dubai", phoneNumber: "+971", emailId: "a@acme.com" },
  status: "DRAFT",
  items: [{ category: "Mason", quantity: "2", rate: "100", otRate: "20" }],
  approvers: [
    { approverId: "u1", approverName: "Lead", approverEmail: "l@x.com", decision: "PENDING" },
    { approverId: "u2", approverName: "Mgr", approverEmail: "m@x.com", decision: "PENDING" },
  ],
});

describe("createMockQuotationApi", () => {
  it("seeds one quotation per status", async () => {
    const api = createMockQuotationApi();
    const list = await api.list();
    const statuses = new Set(list.map((q) => q.status));
    expect(statuses).toEqual(
      new Set(["DRAFT", "PENDING_APPROVAL", "APPROVED", "SENT", "REJECTED"]),
    );
    expect(list.length).toBe(5);
  });
  it("seeds and lists quotations", async () => {
    const api = createMockQuotationApi();
    expect((await api.list()).length).toBeGreaterThan(0);
  });
  it("creates with id, number, DRAFT status and meta", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.create(draft());
    expect(q.id).toBeTruthy();
    expect(q.quotationNumber).toMatch(/^Q-\d{4}$/);
    expect(q.status).toBe("DRAFT");
    expect(q.createdAt).toBeTruthy();
  });
  it("submitForApproval flips DRAFT to PENDING_APPROVAL and stamps approvers", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.create(draft());
    const s = await api.submitForApproval(q.id);
    expect(s.status).toBe("PENDING_APPROVAL");
    expect(s.approvers[0]!.requestedAt).toBeTruthy();
  });
  it("APPROVED only after all approvers approve", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.submitForApproval((await api.create(draft())).id);
    const one = await api.decide(q.id, "u1", "APPROVED");
    expect(one.status).toBe("PENDING_APPROVAL");
    const all = await api.decide(q.id, "u2", "APPROVED");
    expect(all.status).toBe("APPROVED");
  });
  it("any rejection sets REJECTED", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.submitForApproval((await api.create(draft())).id);
    const r = await api.decide(q.id, "u1", "REJECTED", "too high");
    expect(r.status).toBe("REJECTED");
    expect(r.approvers[0]!.comment).toBe("too high");
  });
  it("update patches and remove deletes", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.create(draft());
    const u = await api.update(q.id, { customer: { ...q.customer, name: "New" } });
    expect(u.customer.name).toBe("New");
    await api.remove(q.id);
    expect(await api.get(q.id)).toBeUndefined();
  });
  it("throws on missing id", async () => {
    const api = createMockQuotationApi([]);
    await expect(api.update("nope", {})).rejects.toThrow();
  });
});

describe("seedQuotations", () => {
  it("seeds quotations carrying the new optional fields", () => {
    const seed = seedQuotations();
    const withTerms = seed.find((q) => q.terms);
    expect(withTerms).toBeDefined();
    expect(withTerms!.dueDate).toBeTruthy();
    expect(withTerms!.customerNotes).toBeTruthy();
    expect(withTerms!.items.some((i) => i.description)).toBe(true);
  });
});
