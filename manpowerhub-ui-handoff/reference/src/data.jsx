// ManpowerHub — mock data

window.MockData = {
  user: {
    name: "Junaid Al-Rashid",
    email: "junaid@manpowerhub.ae",
    initials: "JA",
    plan: "Enterprise",
  },

  kpis: {
    revenue:     { label: "Active Workers",    value: "2,847",    delta: "+12%",    trend: "up",   sub: "this month" },
    outstanding: { label: "Monthly Payroll",   value: "AED 284K", delta: "+8%",     trend: "up",   sub: "vs last month" },
    overdue:     { label: "Collection Rate",   value: "98.4%",    delta: "+2.1%",   trend: "up",   sub: "improvement" },
    avgPay:      { label: "Active Sites",      value: "24",       delta: "+3",      trend: "up",   sub: "this quarter" },
  },

  // Agent feed items
  agentFeed: [
    { id: "af1", type: "payroll",  icon: "CircleCheck", title: "Payroll cycle complete", sub: "AED 284K · 0 errors",       when: "1h",  agent: "Payroll Agent" },
    { id: "af2", type: "planning", icon: "Users",       title: "142 workers → Site Alpha", sub: "Planning Agent",          when: "2m",  agent: "Planning Agent" },
    { id: "af3", type: "alert",    icon: "AlertTriangle", title: "3 workers expiring visas", sub: "Action required · Site Beta", when: "4h", agent: "Compliance Agent" },
  ],

  attention: [
    { id: "a1", kind: "overdue",   title: "Invoice KAT/2026/05/024 pending approval", who: "Al Naboodah Contracting · AED 14,385", action: "Review now" },
    { id: "a2", kind: "deadline",  title: "Quotation KAT/QTN/2026/05/041 expiring",  who: "Al Naboodah Contracting · 7 days",     action: "Follow up" },
    { id: "a3", kind: "approval",  title: "Quote KAT/QTN/2026/05/038 needs revision", who: "Al Futtaim Carillion · Revised",       action: "Open quote" },
  ],

  activity: [
    { id: "v1", type: "payment",  who: "Emaar Properties",     text: "approved invoice KAT/2026/05/023",  meta: "AED 8,750",    when: "30m ago" },
    { id: "v2", type: "approved", who: "Planning Agent",        text: "allocated 142 workers to Site Alpha", meta: "",           when: "2h ago"  },
    { id: "v3", type: "doc",      who: "You",                   text: "sent Quotation KAT/QTN/2026/05/041", meta: "Al Naboodah", when: "3h ago"  },
    { id: "v4", type: "payment",  who: "Al Futtaim Carillion",  text: "paid invoice KAT/2026/05/021",      meta: "AED 4,190",    when: "Yesterday" },
    { id: "v5", type: "time",     who: "You",                   text: "uploaded May timesheets",           meta: "2,847 workers", when: "Yesterday" },
    { id: "v6", type: "doc",      who: "You",                   text: "sent Invoice KAT/2026/05/024",      meta: "Al Naboodah",  when: "Mon" },
    { id: "v7", type: "comment",  who: "Mariam · Operations",   text: "approved KAT/2026/05/023",          meta: "Emaar",        when: "Mon" },
  ],

  pipeline: [
    { id: "p1", title: "Downtown Burj Phase 3",        client: "Emaar Properties PJSC",       status: "active",   value: "AED 94,500",  progress: 0.71, deadline: "Jun 30", risk: "low"  },
    { id: "p2", title: "Al Quoz Industrial Site",      client: "Al Naboodah Contracting",     status: "active",   value: "AED 61,000",  progress: 0.48, deadline: "Jul 15", risk: "med"  },
    { id: "p3", title: "Corporate Office Maintenance", client: "Sobha Realty Corporate Office",status: "planning", value: "AED 20,400",  progress: 0.15, deadline: "Aug 01", risk: "low"  },
    { id: "p4", title: "Festival City Expansion",      client: "Al Futtaim Carillion",        status: "active",   value: "AED 49,200",  progress: 0.38, deadline: "Jun 23", risk: "high" },
    { id: "p5", title: "Yas Island Villas Civil",      client: "Shapoorji Pallonji M.E.",     status: "on hold",  value: "AED 106,000", progress: 0.22, deadline: "—",      risk: "med"  },
  ],

  clients: [
    { id: "c1", name: "Al Naboodah Contracting",        contact: "Hamad Al Naboodah",   email: "hamad@alnaboodah.ae",     country: "AE", health: 88, projects: 3, revenue: 61000,  last: "Today"   },
    { id: "c2", name: "Emaar Properties PJSC",          contact: "Rania Khalifa",        email: "rania@emaar.ae",          country: "AE", health: 92, projects: 2, revenue: 94500,  last: "2d ago"  },
    { id: "c3", name: "Sobha Realty Corporate Office",  contact: "Pradeep Nair",         email: "pradeep@sobharealty.ae",  country: "AE", health: 74, projects: 1, revenue: 20400,  last: "5d ago"  },
    { id: "c4", name: "Al Futtaim Carillion",           contact: "James Holloway",       email: "james@alfuttaim.ae",      country: "AE", health: 62, projects: 2, revenue: 49200,  last: "3d ago"  },
    { id: "c5", name: "Shapoorji Pallonji M.E.",        contact: "Rustom Mistry",        email: "rustom@shapoorji.ae",     country: "AE", health: 55, projects: 1, revenue: 106000, last: "1w ago"  },
    { id: "c6", name: "ALEC Engineering",               contact: "Tarek Farhan",         email: "tarek@alec.ae",           country: "AE", health: 82, projects: 2, revenue: 38200,  last: "4d ago"  },
    { id: "c7", name: "Arabtec Construction",           contact: "Majid Al Futtaim",     email: "majid@arabtec.ae",        country: "AE", health: 70, projects: 1, revenue: 27600,  last: "1w ago"  },
    { id: "c8", name: "Drake & Scull International",    contact: "Sara Al Khatib",       email: "sara@drakescull.ae",      country: "AE", health: 46, projects: 1, revenue: 14800,  last: "2w ago"  },
  ],

  invoices: [
    { id: "KAT/2026/05/024", client: "Al Naboodah Contracting",        issued: "2026-05-20", due: "2026-06-19", amount: 14385, status: "pending_approval" },
    { id: "KAT/2026/05/023", client: "Emaar Properties PJSC",          issued: "2026-05-19", due: "2026-06-18", amount: 8750,  status: "sent"             },
    { id: "KAT/2026/05/022", client: "Sobha Realty Corporate Office",   issued: "2026-05-18", due: "2026-06-17", amount: null,  status: "draft"            },
    { id: "KAT/2026/05/021", client: "Al Futtaim Carillion",            issued: "2026-05-17", due: "2026-06-16", amount: 4190,  status: "approved"         },
    { id: "KAT/2026/05/020", client: "Shapoorji Pallonji M.E.",         issued: "2026-05-16", due: "2026-06-15", amount: 2900,  status: "overdue"          },
  ],

  // Invoice approvals map
  invoiceApprovals: {
    "KAT/2026/05/023": [
      { name: "Mariam", dept: "Operation Department" },
      { name: "Faisal", dept: "Account Department" },
    ],
    "KAT/2026/05/021": [
      { name: "Nasser", dept: "Operation Department" },
      { name: "Hind",   dept: "Account Department" },
    ],
  },

  // Quotation KPIs
  quotationKpis: {
    total:     { value: "5",             sub: "All quote records in the workspace" },
    pipeline:  { value: "3",             sub: "Draft, sent, and revised quotes" },
    accepted:  { value: "AED 12,570.00", sub: "Sum of accepted standard rates" },
    attention: { value: "4",             sub: "Expired or valid within 7 days" },
  },

  // Quotations — schema: QuotationAggregateData & QuotationPersistedMeta & { id }
  quotations: [
    {
      id: "q-001",
      quotationNumber: "KAT/QTN/2026/05/041",
      quotationDate: "2026-05-19",
      status: "SENT",
      createdAt: "2026-05-19T08:30:00Z",
      updatedAt: "2026-05-20T10:15:00Z",
      createdBy: "junaid@manpowerhub.ae",
      customer: {
        name: "Al Naboodah Contracting",
        address: "Al Quoz Industrial Area, Dubai, UAE",
        phoneNumber: "+971 4 339 4400",
        emailId: "hamad@alnaboodah.ae",
      },
      approvers: [
        { approverName: "Nasser Al Mansoori", approverId: "usr-ops-01", approverEmail: "nasser@manpowerhub.ae", decision: "APPROVED", approvedAt: "2026-05-20T09:00:00Z", requestedAt: "2026-05-19T08:30:00Z", comment: "Rates verified against site survey." },
        { approverName: "Hind Al Rashidi",    approverId: "usr-fin-01", approverEmail: "hind@manpowerhub.ae",   decision: "APPROVED", approvedAt: "2026-05-20T10:15:00Z", requestedAt: "2026-05-19T08:30:00Z", comment: "" },
      ],
      items: [
        { category: "General Labourers (Day Shift)",   quantity: "22", rate: "85",  otRate: "12.75" },
        { category: "General Labourers (Night Shift)",  quantity: "18", rate: "100", otRate: "15.00" },
      ],
    },
    {
      id: "q-002",
      quotationNumber: "KAT/QTN/2026/05/040",
      quotationDate: "2026-05-17",
      status: "APPROVED",
      createdAt: "2026-05-17T11:00:00Z",
      updatedAt: "2026-05-18T14:20:00Z",
      createdBy: "junaid@manpowerhub.ae",
      customer: {
        name: "Emaar Properties PJSC",
        address: "Emaar Square, Downtown Dubai, UAE",
        phoneNumber: "+971 4 367 3333",
        emailId: "rania@emaar.ae",
      },
      approvers: [
        { approverName: "Nasser Al Mansoori", approverId: "usr-ops-01", approverEmail: "nasser@manpowerhub.ae", decision: "APPROVED", approvedAt: "2026-05-18T13:00:00Z", requestedAt: "2026-05-17T11:00:00Z", comment: "Headcount confirmed with site PM." },
        { approverName: "Faisal Al Hammadi",  approverId: "usr-fin-02", approverEmail: "faisal@manpowerhub.ae", decision: "APPROVED", approvedAt: "2026-05-18T14:20:00Z", requestedAt: "2026-05-17T11:00:00Z", comment: "OT rate within budget." },
      ],
      items: [
        { category: "General Labourers (Day Shift)",   quantity: "30", rate: "90",  otRate: "13.50" },
        { category: "Skilled Operators (Night Shift)", quantity: "20", rate: "120", otRate: "18.00" },
      ],
    },
    {
      id: "q-003",
      quotationNumber: "KAT/QTN/2026/05/039",
      quotationDate: "2026-05-22",
      status: "DRAFT",
      createdAt: "2026-05-22T09:45:00Z",
      updatedAt: "2026-05-22T09:45:00Z",
      createdBy: "junaid@manpowerhub.ae",
      customer: {
        name: "Sobha Realty Corporate Office",
        address: "Sobha Hartland, MBR City, Dubai, UAE",
        phoneNumber: "+971 4 368 8888",
        emailId: "pradeep@sobharealty.ae",
      },
      approvers: [],
      items: [
        { category: "Facility Maintenance Workers", quantity: "12", rate: "80", otRate: "12.00" },
      ],
    },
    {
      id: "q-004",
      quotationNumber: "KAT/QTN/2026/05/038",
      quotationDate: "2026-05-15",
      status: "PENDING_APPROVAL",
      createdAt: "2026-05-15T07:30:00Z",
      updatedAt: "2026-05-16T08:00:00Z",
      createdBy: "junaid@manpowerhub.ae",
      customer: {
        name: "Al Futtaim Carillion",
        address: "Festival City, Dubai, UAE",
        phoneNumber: "+971 4 232 5000",
        emailId: "james@alfuttaim.ae",
      },
      approvers: [
        { approverName: "Nasser Al Mansoori", approverId: "usr-ops-01", approverEmail: "nasser@manpowerhub.ae", decision: "PENDING",  requestedAt: "2026-05-15T07:30:00Z" },
        { approverName: "Faisal Al Hammadi",  approverId: "usr-fin-02", approverEmail: "faisal@manpowerhub.ae", decision: "PENDING",  requestedAt: "2026-05-15T07:30:00Z" },
      ],
      items: [
        { category: "Civil Construction Workers",  quantity: "25", rate: "95",  otRate: "14.25" },
        { category: "Safety Officers",             quantity: "3",  rate: "150", otRate: "22.50" },
      ],
    },
    {
      id: "q-005",
      quotationNumber: "KAT/QTN/2026/05/037",
      quotationDate: "2026-05-10",
      status: "REJECTED",
      createdAt: "2026-05-10T10:00:00Z",
      updatedAt: "2026-05-12T16:00:00Z",
      createdBy: "junaid@manpowerhub.ae",
      customer: {
        name: "Shapoorji Pallonji M.E.",
        address: "Yas Island, Abu Dhabi, UAE",
        phoneNumber: "+971 2 444 5566",
        emailId: "rustom@shapoorji.ae",
      },
      approvers: [
        { approverName: "Nasser Al Mansoori", approverId: "usr-ops-01", approverEmail: "nasser@manpowerhub.ae", decision: "APPROVED",  approvedAt: "2026-05-11T09:00:00Z", requestedAt: "2026-05-10T10:00:00Z", comment: "" },
        { approverName: "Hind Al Rashidi",    approverId: "usr-fin-01", approverEmail: "hind@manpowerhub.ae",   decision: "REJECTED",  approvedAt: "2026-05-12T16:00:00Z", requestedAt: "2026-05-10T10:00:00Z", comment: "Rates exceed approved margin. Please revise." },
      ],
      items: [
        { category: "General Labourers",  quantity: "40", rate: "88", otRate: "13.20" },
        { category: "Crane Operators",    quantity: "8",  rate: "160", otRate: "24.00" },
      ],
    },
  ],

  tasks: [
    { id: "t1", title: "Process May payroll for Site Alpha",     project: "Site Alpha",      client: "Emaar Properties PJSC",    status: "in_progress", priority: "high", due: "Today",    overdue: false },
    { id: "t2", title: "Renew visas — 3 expiring workers",       project: "Compliance",      client: "Al Naboodah Contracting",  status: "todo",        priority: "high", due: "Tomorrow", overdue: false },
    { id: "t3", title: "Draft quotation — phase 2 expansion",    project: "Festival City",   client: "Al Futtaim Carillion",     status: "todo",        priority: "med",  due: "Jun 28",   overdue: false },
    { id: "t4", title: "Worker headcount audit — Site Beta",     project: "Site Beta",       client: "Sobha Realty",             status: "in_progress", priority: "med",  due: "Jun 30",   overdue: false },
    { id: "t5", title: "Submit monthly attendance report",       project: "Operations",      client: "All sites",                status: "todo",        priority: "low",  due: "Jul 01",   overdue: false },
    { id: "t6", title: "Approve timesheet batch — May",          project: "Payroll",         client: "Internal",                 status: "done",        priority: "med",  due: "Jun 20",   overdue: false },
    { id: "t7", title: "Onboard 18 new workers — Yas Island",    project: "Yas Island",      client: "Shapoorji Pallonji",       status: "todo",        priority: "low",  due: "Jun 15",   overdue: true  },
    { id: "t8", title: "QA uniform & safety compliance",         project: "Compliance",      client: "All sites",                status: "in_progress", priority: "high", due: "Jul 05",   overdue: false },
  ],

  expenses: [
    { id: "e1", date: "Jun 20", vendor: "Etisalat",        category: "Utilities",     project: "Operations",      amount: 480,  hasReceipt: true  },
    { id: "e2", date: "Jun 18", vendor: "DEWA",            category: "Utilities",     project: "Site Alpha",      amount: 1240, hasReceipt: true  },
    { id: "e3", date: "Jun 15", vendor: "Al Ansari",       category: "Travel",        project: "Site Beta",       amount: 320,  hasReceipt: true  },
    { id: "e4", date: "Jun 12", vendor: "Noon",            category: "Equipment",     project: "Yas Island",      amount: 680,  hasReceipt: false },
    { id: "e5", date: "Jun 08", vendor: "Cafu",            category: "Fuel",          project: "Site Alpha",      amount: 540,  hasReceipt: true  },
    { id: "e6", date: "Jun 05", vendor: "Emirates ID",     category: "Compliance",    project: "Compliance",      amount: 900,  hasReceipt: true  },
    { id: "e7", date: "Jun 01", vendor: "Bayt.com",        category: "Recruitment",   project: "Operations",      amount: 1500, hasReceipt: true  },
  ],

  revenueByMonth: [
    { m: "Jan", v: 210000 },
    { m: "Feb", v: 238000 },
    { m: "Mar", v: 225000 },
    { m: "Apr", v: 261000 },
    { m: "May", v: 284000 },
    { m: "Jun", v: 297000 },
  ],

  kanban: {
    todo: [
      { id: "k1", title: "Renew expiring visas — 3 workers",        priority: "high", assignee: "JA", due: "Tomorrow", labels: ["compliance"] },
      { id: "k2", title: "Draft phase-2 expansion quotation",        priority: "med",  assignee: "JA", due: "Jun 28",   labels: ["finance"] },
      { id: "k3", title: "Onboard new workers — Yas Island",         priority: "low",  assignee: "JA", due: "—",        labels: ["operations"] },
    ],
    in_progress: [
      { id: "k4", title: "Process May payroll — Site Alpha",         priority: "high", assignee: "JA", due: "Today",    labels: ["payroll"] },
      { id: "k5", title: "Headcount audit — Site Beta",              priority: "med",  assignee: "JA", due: "Jun 30",   labels: ["operations"] },
    ],
    done: [
      { id: "k6", title: "Approve May timesheets",                   priority: "med",  assignee: "JA", due: "Jun 20",   labels: ["payroll"] },
      { id: "k7", title: "Submit attendance report — April",         priority: "med",  assignee: "JA", due: "Jun 10",   labels: ["operations"] },
    ],
    cancelled: [
      { id: "k9", title: "Legacy system migration",                  priority: "low",  assignee: "JA", due: "—",        labels: ["tech"] },
    ],
  },

  cmdk: {
    quick: [
      { id: "q1", icon: "Sparkles", label: "Generate payroll summary for May 2026",     sub: "AI · Payroll Agent",    meta: "↵" },
      { id: "q2", icon: "Sparkles", label: "Draft quotation for Al Naboodah phase 2",   sub: "AI · Document Writer",  meta: "↵" },
      { id: "q3", icon: "Sparkles", label: "Summarise worker allocation across sites",  sub: "AI · Planning Agent",   meta: "↵" },
    ],
    navigate: [
      { id: "n1", icon: "Home",       label: "Dashboard",    meta: "G then D" },
      { id: "n2", icon: "Users",      label: "Workers",      meta: "G then W" },
      { id: "n3", icon: "Layers",     label: "Sites",        meta: "G then S" },
      { id: "n4", icon: "FileText",   label: "Quotations",   meta: "G then Q" },
      { id: "n5", icon: "Receipt",    label: "Invoices",     meta: "G then I" },
    ],
    create: [
      { id: "x1", icon: "Plus", label: "New proforma invoice",  meta: "⌘ + I" },
      { id: "x2", icon: "Plus", label: "New quotation",         meta: "⌘ + ⇧ + Q" },
      { id: "x3", icon: "Plus", label: "Add worker",            meta: "⌘ + ⇧ + W" },
    ],
  },
};
