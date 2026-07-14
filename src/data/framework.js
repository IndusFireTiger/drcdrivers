// ─────────────────────────────────────────────────────────────────────────
// The Governance Framework assembly.
//
// The Navigator already derives three-quarters of a Data Governance Framework
// from a product's answers: a risk register (dataRiskProfile), the policies
// that mandate controls (policyPlan), and the regulatory obligations + next
// actions (advisorMeta). What a real framework adds ON TOP of those is the
// governance *operating model* — the principles it commits to, WHO is
// accountable for what, and the cadence at which it is assured.
//
// This module supplies exactly that missing layer and nothing the engine
// already computes: it takes the pieces the Navigator has already produced and
// assembles them into one framework, so there is no static per-product content
// to drift out of sync. `buildFramework` is pure — feed it answers + the
// computed model pieces and it returns the framework view model.
//
// Educational guidance, not legal advice.
// ─────────────────────────────────────────────────────────────────────────

// ── helpers over the answer object ────────────────────────────────────────
const has = (arr, v) => Array.isArray(arr) && arr.includes(v);
const hasPersonalData = (a) => a.dataTypes.some((d) => ['pii', 'health', 'children', 'financial', 'employee'].includes(d));
const doesAutomated = (a) => has(a.activities, 'adm') || has(a.activities, 'ai');
const highRiskProcessing = (a) =>
  doesAutomated(a) || has(a.dataTypes, 'health') || has(a.dataTypes, 'children');

// ── Principles: the tenets the framework commits to. Some are universal;
//    others switch on only when the product's answers make them relevant. ──
export const FRAMEWORK_PRINCIPLES = [
  { id: 'accountability', title: 'Accountability & ownership', detail: 'Every dataset, risk and control has a named owner; leadership owns the framework and its outcomes.' },
  { id: 'lawful', title: 'Lawfulness, fairness & transparency', detail: 'Process data only on a documented lawful basis and tell people plainly what you do with it.' },
  { id: 'purpose', title: 'Purpose limitation', detail: 'Use data only for the purposes it was collected for — no quiet scope creep.' },
  { id: 'minimisation', title: 'Data minimisation', detail: 'Collect and keep the least data needed to do the job.' },
  { id: 'accuracy', title: 'Accuracy & quality', detail: 'Keep data correct, current and de-duplicated so decisions built on it are sound.' },
  { id: 'storage', title: 'Storage limitation', detail: 'Retain data on a schedule and delete it — verifiably, across every copy — when it is no longer needed.' },
  { id: 'security', title: 'Security & resilience by design', detail: 'Confidentiality, integrity and availability are engineered in, not bolted on after launch.' },
  { id: 'rights', title: 'Individual rights & empowerment', detail: 'People can access, correct, export and erase their data through a defined process.', when: hasPersonalData },
  { id: 'transfer', title: 'Lawful, protected cross-border flows', detail: 'Data crosses borders only under a valid transfer mechanism and honours localisation rules.', when: (a) => has(a.activities, 'transfer') },
  { id: 'fairness', title: 'Fairness & human oversight of automation', detail: 'Automated decisions are explainable, tested for bias, and reviewable by a person.', when: doesAutomated },
  { id: 'children', title: 'Child-centric, age-appropriate design', detail: 'Extra care, verifiable parental consent and no profiling for children by default.', when: (a) => has(a.dataTypes, 'children') },
];

// ── The governance operating model: canonical roles and the owner-strings in
//    the advisor data that map to each. `match` is matched case-insensitively
//    against every next-action / policy owner. `board` always appears (it owns
//    the framework); every other role appears only if it actually owns work. ──
export const FRAMEWORK_ROLES = [
  { key: 'board', name: 'Board / Executive sponsor', mandate: 'Owns the framework, sets the risk appetite, and is accountable for data-governance outcomes.', match: [], always: true },
  { key: 'dpo', name: 'Data Protection / Privacy Officer', mandate: 'Independent oversight of privacy compliance, impact assessments and data-subject rights; the point of contact for regulators.', match: ['data protection officer', 'dpo', 'encarregado', 'information officer', 'privacy'] },
  { key: 'legal', name: 'Legal / Compliance', mandate: 'Interprets obligations, owns contracts and regulatory filings, and tracks legal change.', match: ['legal', 'compliance'] },
  { key: 'security', name: 'Security / CISO', mandate: 'Designs and operates technical and organisational controls, and leads incident response.', match: ['security', 'ciso', 'infosec'] },
  { key: 'engineering', name: 'Engineering', mandate: 'Implements controls in the product and infrastructure — encryption, access, validation, resilience.', match: ['engineering', 'quality / eng', 'quality'] },
  { key: 'product', name: 'Product', mandate: 'Builds privacy and rights into the product: consent capture, notices and data-subject request flows.', match: ['product'] },
  { key: 'risk', name: 'Risk management', mandate: 'Maintains the risk register, sets tolerances, and reports residual risk to the board.', match: ['risk'] },
  { key: 'ops', name: 'Operations / Vendor management', mandate: 'Runs day-to-day processes plus vendor due diligence and data-processing agreements.', match: ['ops', 'vendor'] },
  { key: 'aigov', name: 'AI governance', mandate: 'Oversight of automated decisions and AI systems — fairness, data provenance and human review.', match: ['ai governance'] },
  { key: 'finance', name: 'Finance', mandate: 'Financial-reporting controls and funding of the governance programme.', match: ['finance'] },
];

// Each policy's lead role, so policies are attributed in the operating model.
// Keyed by the policy ids defined in the Navigator's POLICIES catalog.
export const POLICY_LEAD = {
  infosec: 'security', access: 'security', incident: 'security', pci: 'security',
  retention: 'dpo', classification: 'dpo', dpia: 'dpo',
  privacy: 'legal', transfer: 'legal',
  dsar: 'product', consent: 'product',
  vendor: 'ops',
  awareness: 'legal',
  ai: 'aigov',
  quality: 'risk',
};

// ── Assurance & review cadence: how the framework stays alive. Conditional
//    rows switch on with the product's answers, mirroring the principles. ──
export const FRAMEWORK_CADENCE = [
  { activity: 'Governance forum reviews risks, incidents and metrics', frequency: 'Quarterly', owner: 'Board / DPO' },
  { activity: 'Risk register review & re-rating', frequency: 'Quarterly', owner: 'Risk' },
  { activity: 'Access & permission recertification', frequency: 'Quarterly', owner: 'Security' },
  { activity: 'Data inventory / Record of Processing refresh', frequency: 'Annual', owner: 'DPO', when: hasPersonalData },
  { activity: 'Impact assessment (DPIA) for new high-risk processing', frequency: 'Per launch', owner: 'DPO / Product', when: highRiskProcessing },
  { activity: 'Policy set review & sign-off', frequency: 'Annual', owner: 'Legal' },
  { activity: 'Incident-response tabletop exercise', frequency: 'Annual', owner: 'Security', when: hasPersonalData },
  { activity: 'Vendor / processor reassessment', frequency: 'Annual', owner: 'Operations', when: (a) => has(a.activities, 'thirdparty') },
  { activity: 'Cross-border transfer mechanism review', frequency: 'Annual', owner: 'Legal', when: (a) => has(a.activities, 'transfer') },
  { activity: 'Bias & model-governance review', frequency: 'Semi-annual', owner: 'AI governance', when: doesAutomated },
  { activity: 'Staff privacy & security training', frequency: 'Annual + at onboarding', owner: 'All staff' },
];

// ── The assembler ─────────────────────────────────────────────────────────
// obligations: the flat list of matched instrument `item`s (each with
//   nextActions[].owner). policies: the output of policyPlan (each with id + name).
function ownerMatches(role, ownerStr) {
  const s = (ownerStr || '').toLowerCase();
  return role.match.some((kw) => s.includes(kw));
}

export function buildFramework(answers, { risks = [], policies = [], obligations = [] } = {}) {
  const principles = FRAMEWORK_PRINCIPLES.filter((p) => !p.when || p.when(answers));

  // Attribute every next-action and policy to the roles that own it.
  const roles = FRAMEWORK_ROLES.map((role) => {
    const owns = [];
    obligations.forEach((item) => {
      (item.nextActions || []).forEach((n) => {
        if (ownerMatches(role, n.owner)) owns.push({ kind: 'action', label: n.action, from: item.name });
      });
    });
    policies.forEach((p) => {
      if (POLICY_LEAD[p.id] === role.key) owns.push({ kind: 'policy', label: p.name });
    });
    return { ...role, owns };
  }).filter((r) => r.always || r.owns.length);

  const cadence = FRAMEWORK_CADENCE.filter((c) => !c.when || c.when(answers));

  return {
    principles,
    roles,
    cadence,
    stats: {
      principles: principles.length,
      roles: roles.length,
      policies: policies.length,
      risks: risks.length,
      obligations: obligations.length,
    },
  };
}
