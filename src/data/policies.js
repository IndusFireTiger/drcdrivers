// ─────────────────────────────────────────────────────────────────────────
// The Policy Library — the reference catalogue behind the Navigator.
//
// The Navigator's answer-driven report recommends the *subset* of policies that
// mitigate a product's live risks (see policyPlan in Navigator.jsx). This file
// is the full, standing library: every policy, the controls it establishes, the
// obligation themes it helps you meet, the role that owns it, and a ready-to-
// adapt sample draft. It is the single source of truth for both surfaces.
//
// Educational guidance, not legal advice — adapt every draft to your own
// context and have it reviewed by qualified counsel before you rely on it.
// ─────────────────────────────────────────────────────────────────────────

import { dataRiskProfile } from './risks.js';
import { FRAMEWORK_ROLES } from './framework.js';

// ── Control catalog: id → human name. Shared by risks, policies and library. ─
export const CONTROLS = {
  encryption: 'Encryption (at rest & in transit)',
  'access-control': 'Access control & least privilege',
  mfa: 'Multi-factor authentication',
  logging: 'Logging & monitoring',
  'vuln-mgmt': 'Vulnerability & patch management',
  backup: 'Backup & recovery',
  retention: 'Retention schedule & secure deletion',
  'data-inventory': 'Data inventory, mapping & classification',
  'dsar-process': 'Data-subject-request fulfilment',
  'consent-mgmt': 'Consent & lawful-basis management',
  'vendor-mgmt': 'Vendor due diligence & data-processing agreements',
  'transfer-mechanism': 'Cross-border transfer mechanism',
  dpia: 'Data Protection Impact Assessment (DPIA)',
  'incident-response': 'Incident-response & breach runbook',
  'security-training': 'Security & privacy awareness training',
  'age-verification': 'Age verification & parental consent',
  'pci-scope': 'PCI scope reduction & tokenisation',
  'human-review': 'Human oversight of automated decisions',
  'bias-testing': 'Bias & fairness testing',
  'data-quality': 'Data-quality controls (validation, de-duplication)',
  'model-governance': 'AI / model governance & data provenance',
  'data-minimization': 'Data minimisation',
};

// ── Obligation themes: the compliance areas a policy helps you stay on top of.
//    Keys align with the instrument `traits` in advisor.js where they overlap,
//    plus a few extra themes the trait vocabulary doesn't name. ──────────────
export const OBLIGATION_THEMES = {
  'lawful-basis': 'Lawful basis & transparency',
  dsr: 'Data-subject / consumer rights',
  consent: 'Consent management',
  security: 'Security safeguards',
  breach: 'Breach notification',
  retention: 'Retention & deletion',
  vendor: 'Vendor / processor management',
  transfer: 'Cross-border transfer',
  children: 'Children & age-appropriate design',
  automated: 'Automated decisions & AI governance',
  quality: 'Data accuracy & quality',
  payments: 'Payment-card protection',
};

// Example instruments (by catalog id) that each theme's obligations come from —
// used to show "helps you comply with" concretely. Themes that map onto the
// advisor `traits` vocabulary reuse it; the rest are listed explicitly.
export const THEME_INSTRUMENTS = {
  'lawful-basis': ['gdpr', 'uk-gdpr', 'ccpa', 'dpdp', 'lgpd', 'pipeda'],
  dsr: ['gdpr', 'uk-gdpr', 'ccpa', 'dpdp', 'lgpd'],
  consent: ['gdpr', 'dpdp', 'pipl', 'appi', 'coppa'],
  security: ['gdpr', 'hipaa', 'iso-27001', 'soc2', 'nist-csf', 'nydfs-500'],
  breach: ['gdpr', 'hipaa', 'pdpa-sg', 'privacy-act-au', 'nydfs-500'],
  retention: ['gdpr', 'coppa', 'mifid2', 'sox'],
  vendor: ['gdpr', 'hipaa', 'dora', 'iso-27001', 'soc2'],
  transfer: ['gdpr', 'uk-gdpr', 'pipl', 'appi', 'lgpd'],
  children: ['coppa', 'ferpa', 'dpdp'],
  automated: ['eu-ai-act', 'iso-42001', 'nist-ai-rmf'],
  quality: ['sox', 'basel-iii', 'iso-31000'],
  payments: ['pci-dss', 'psd2'],
};

// ── The library. Each policy: id · name · desc · owner (framework role key) ·
//    controls it establishes · obligation themes it supports · a sample draft.
//    `id`, `name`, `desc`, `controls` are consumed by policyPlan too — keep them.
export const POLICIES = [
  {
    id: 'infosec',
    name: 'Information Security Policy',
    desc: 'Baseline technical & organisational security measures.',
    owner: 'security',
    controls: ['encryption', 'access-control', 'mfa', 'logging', 'vuln-mgmt', 'backup'],
    themes: ['security', 'breach'],
    draft: {
      purpose:
        'Establish the baseline technical and organisational measures that protect the confidentiality, integrity and availability of [Organisation]’s information and systems.',
      scope:
        'All information assets, systems, networks and applications, and everyone who uses them — employees, contractors and third parties.',
      clauses: [
        'Information is protected in proportion to its classification (see the Data Classification & Handling Policy); encryption is applied to data at rest and in transit using current, industry-standard algorithms.',
        'Access to systems and data follows least-privilege and is granted, reviewed and revoked under the Access Control Policy; multi-factor authentication protects remote and privileged access.',
        'Production systems are logged and monitored; security-relevant events are retained for at least [12] months and reviewed for anomalies.',
        'Systems are patched on a risk-based schedule; critical vulnerabilities are remediated within [target] days.',
        'Backups are taken, encrypted and periodically tested for restorability; recovery objectives are defined for critical systems.',
        'Suspected security incidents are reported and handled under the Incident Response & Breach Notification Policy.',
      ],
      review: 'at least annually, and after any material change or significant incident',
    },
  },
  {
    id: 'access',
    name: 'Access Control Policy',
    desc: 'Who may access what, and how access is granted & reviewed.',
    owner: 'security',
    controls: ['access-control', 'mfa', 'logging'],
    themes: ['security'],
    draft: {
      purpose:
        'Define how access to [Organisation]’s systems and data is requested, approved, provisioned, reviewed and revoked, so that people can reach only what their role requires.',
      scope: 'All user, administrative and service accounts across all systems that hold organisational or customer data.',
      clauses: [
        'Access is granted on a least-privilege, need-to-know basis and mapped to a defined role or job function.',
        'Multi-factor authentication is required for all remote, administrative and privileged access.',
        'Every access request is approved by the relevant system or data owner and recorded.',
        'User access rights are recertified at least [quarterly]; access is revoked within [24 hours] of a role change or departure.',
        'Shared, default and hard-coded credentials are prohibited; privileged actions are logged and monitored.',
      ],
      review: 'at least annually',
    },
  },
  {
    id: 'retention',
    name: 'Data Retention & Disposal Policy',
    desc: 'How long data is kept and how it is securely deleted.',
    owner: 'dpo',
    controls: ['retention', 'data-minimization', 'data-inventory'],
    themes: ['retention'],
    draft: {
      purpose:
        'Ensure personal and business data is kept only as long as necessary and then disposed of securely, reducing risk exposure and meeting storage-limitation duties.',
      scope: 'All data held by [Organisation] in any format — production systems, backups, exports, analytics and paper.',
      clauses: [
        'Each data category has a defined retention period in the retention schedule, justified by a legal, contractual or business need.',
        'Data is not kept beyond its retention period unless a legal hold applies; expiry is enforced through automated deletion wherever possible.',
        'Disposal is irreversible — secure erasure for digital media, destruction for physical — and covers backups and third-party copies.',
        'The retention schedule is maintained against the data inventory so no category is left ungoverned.',
      ],
      review: 'annually, with the retention schedule',
    },
  },
  {
    id: 'classification',
    name: 'Data Classification & Handling Policy',
    desc: 'Labelling data by sensitivity, with handling rules per label.',
    owner: 'dpo',
    controls: ['data-inventory', 'encryption', 'access-control'],
    themes: ['security', 'retention'],
    draft: {
      purpose:
        'Give every piece of data a sensitivity label and clear handling rules, so protection is consistent and proportionate to risk.',
      scope: 'All data created, received, stored or processed by [Organisation] and everyone who handles it.',
      clauses: [
        'Data is classified into [Public / Internal / Confidential / Restricted]; the highest applicable label governs.',
        'Each label carries handling rules for storage, access, sharing, transmission and disposal.',
        'Confidential and Restricted data is encrypted at rest and in transit and access is tightly restricted.',
        'The data inventory records where each class of data lives and who owns it.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'privacy',
    name: 'Privacy Policy & Notice',
    desc: 'How personal data is collected, used and shared, and on what basis.',
    owner: 'legal',
    controls: ['consent-mgmt', 'dsar-process', 'data-minimization'],
    themes: ['lawful-basis', 'dsr', 'consent'],
    draft: {
      purpose:
        'Tell individuals plainly what personal data [Organisation] collects, why, on what lawful basis, who it is shared with, and what rights they have.',
      scope: 'All personal data of customers, users, employees and other individuals, across every collection point.',
      clauses: [
        'Each processing purpose is recorded with its lawful basis; data is collected only for specified, explicit purposes.',
        'A plain-language privacy notice is provided at or before the point of collection and kept current.',
        'Only the minimum data needed for each purpose is collected and retained.',
        'Individuals can exercise their rights (access, correction, deletion, objection, portability) through the Data-Subject Rights Policy.',
        'Data is shared with third parties only under a contract and a valid basis.',
      ],
      review: 'annually, and whenever processing changes',
    },
  },
  {
    id: 'dsar',
    name: 'Data-Subject Rights Policy',
    desc: 'The process to fulfil access, correction and erasure requests.',
    owner: 'product',
    controls: ['dsar-process', 'data-inventory'],
    themes: ['dsr'],
    draft: {
      purpose:
        'Define how [Organisation] receives, verifies and fulfils requests from individuals to exercise their data rights within statutory deadlines.',
      scope: 'All requests to access, correct, delete, port, restrict or object, from any individual whose data is held.',
      clauses: [
        'Requests can be made through [named channels]; receipt is acknowledged and logged.',
        'The requester’s identity is verified proportionately before any data is disclosed or changed.',
        'Requests are fulfilled within [one month / statutory deadline]; extensions and refusals are documented and communicated with reasons.',
        'The data inventory is used to locate the individual’s data across every system, including backups and third parties.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'consent',
    name: 'Consent Management Policy',
    desc: 'Capturing, recording and withdrawing consent (incl. children).',
    owner: 'product',
    controls: ['consent-mgmt', 'age-verification'],
    themes: ['consent', 'lawful-basis', 'children'],
    draft: {
      purpose:
        'Ensure that, where consent is the lawful basis, it is freely given, specific, informed and as easy to withdraw as it was to give.',
      scope: 'All processing that relies on consent, including marketing, non-essential cookies and children’s data.',
      clauses: [
        'Consent is captured through a clear affirmative action — no pre-ticked boxes or bundled consent.',
        'Each consent is recorded with what was agreed, when, and the notice shown at the time.',
        'Withdrawal is offered through the same ease of action as granting, and honoured promptly across systems.',
        'For children below the applicable age, verifiable parental consent and age assurance are obtained first.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'vendor',
    name: 'Third-Party / Vendor Management Policy',
    desc: 'Due diligence and contracts for processors & suppliers.',
    owner: 'ops',
    controls: ['vendor-mgmt', 'logging'],
    themes: ['vendor', 'transfer'],
    draft: {
      purpose:
        'Ensure third parties that process data on [Organisation]’s behalf are assessed, contracted and monitored so accountability is never lost.',
      scope: 'All suppliers, processors and sub-processors that access, store or process organisational or customer data.',
      clauses: [
        'Vendors undergo risk-based due diligence before onboarding, proportionate to the data they will handle.',
        'A written data-processing agreement (or Business Associate Agreement) is in place before any data is shared.',
        'Sub-processors are disclosed and flow-down obligations are imposed; cross-border transfers use a valid mechanism.',
        'Vendor security and compliance are reassessed at least [annually] and on material change; exit and data-return terms are defined.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'transfer',
    name: 'International Data Transfer Policy',
    desc: 'Lawful mechanisms for moving data across borders.',
    owner: 'legal',
    controls: ['transfer-mechanism', 'data-inventory'],
    themes: ['transfer'],
    draft: {
      purpose:
        'Ensure personal data crosses borders only under a valid legal mechanism and in line with data-localisation rules.',
      scope: 'All transfers of personal data from one jurisdiction to another, including access from abroad and cloud storage.',
      clauses: [
        'Every cross-border flow is mapped in the data inventory with its origin, destination and mechanism.',
        'Transfers rely on an approved mechanism (adequacy, Standard Contractual Clauses, IDTA, BCRs or a valid derogation).',
        'A transfer risk assessment is completed where required, with supplementary measures applied to close gaps.',
        'Data-localisation requirements are identified and honoured for the relevant jurisdictions.',
      ],
      review: 'annually, and whenever a transfer mechanism changes',
    },
  },
  {
    id: 'incident',
    name: 'Incident Response & Breach Notification Policy',
    desc: 'Detect, assess, contain and notify within statutory clocks.',
    owner: 'security',
    controls: ['incident-response', 'logging'],
    themes: ['breach', 'security'],
    draft: {
      purpose:
        'Ensure security and data-breach incidents are detected, contained, assessed and notified within the required timelines to limit harm.',
      scope: 'All suspected or confirmed security incidents and personal-data breaches across all systems and staff.',
      clauses: [
        'Anyone who suspects an incident reports it immediately through [channel]; incidents are triaged and logged.',
        'A defined response team contains, investigates and records each incident with severity and impact.',
        'Where a personal-data breach is likely to cause risk, authorities are notified within the statutory clock (e.g. 72 hours) and affected individuals as required.',
        'A post-incident review captures root cause and corrective actions; the runbook is tested at least [annually].',
      ],
      review: 'annually, and after every significant incident',
    },
  },
  {
    id: 'dpia',
    name: 'DPIA / Risk Assessment Policy',
    desc: 'When and how to assess high-risk processing before launch.',
    owner: 'dpo',
    controls: ['dpia'],
    themes: ['lawful-basis', 'automated'],
    draft: {
      purpose:
        'Ensure high-risk processing is assessed for its impact on individuals before it begins, and that risks are mitigated to an acceptable level.',
      scope: 'Any new or materially changed processing that is likely to result in a high risk — large-scale, sensitive, automated or novel.',
      clauses: [
        'A screening question set decides whether a Data Protection Impact Assessment (DPIA) is required.',
        'The DPIA describes the processing, assesses necessity and proportionality, and identifies risks to individuals.',
        'Mitigations are agreed and tracked; residual high risk is escalated (and consulted with the regulator where required) before launch.',
        'Completed DPIAs are retained and revisited when the processing changes.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'awareness',
    name: 'Acceptable Use & Security Awareness Policy',
    desc: 'Staff responsibilities and recurring training.',
    owner: 'legal',
    controls: ['security-training', 'access-control'],
    themes: ['security'],
    draft: {
      purpose:
        'Set out how staff may use [Organisation]’s systems and data responsibly, and ensure they are trained to recognise and avoid security and privacy risks.',
      scope: 'All employees, contractors and anyone with access to organisational systems or data.',
      clauses: [
        'Systems and data are used only for authorised business purposes and handled per their classification.',
        'Staff complete security and privacy awareness training at onboarding and at least [annually].',
        'Phishing, weak passwords, unauthorised software and data sharing are addressed with clear do/don’t rules.',
        'Policy breaches are handled under the disciplinary process; suspected incidents are reported promptly.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'ai',
    name: 'Responsible AI & Automated-Decision Policy',
    desc: 'Oversight, fairness and data provenance for AI / automated decisions.',
    owner: 'aigov',
    controls: ['human-review', 'bias-testing', 'model-governance'],
    themes: ['automated'],
    draft: {
      purpose:
        'Ensure automated decisions and AI systems are lawful, fair, explainable and subject to meaningful human oversight.',
      scope: 'All systems that make or materially support automated decisions, and all models trained on organisational or personal data.',
      clauses: [
        'Each AI/automated system is inventoried and risk-classified before deployment.',
        'Training data provenance and lawful basis are documented; data quality and representativeness are assessed.',
        'Models are tested for bias and performance before and during use; results and limitations are recorded.',
        'Decisions with significant effects are subject to human review, explanation and a route to contest.',
      ],
      review: 'at least annually, and before each new deployment',
    },
  },
  {
    id: 'quality',
    name: 'Data Quality & Governance Policy',
    desc: 'Accuracy, validation and ownership of data.',
    owner: 'risk',
    controls: ['data-quality', 'data-inventory'],
    themes: ['quality'],
    draft: {
      purpose:
        'Ensure data is accurate, complete, current and well-owned, so decisions and reporting built on it are reliable.',
      scope: 'All datasets used for operations, reporting and decision-making across [Organisation].',
      clauses: [
        'Every significant dataset has a named data owner accountable for its quality.',
        'Data is validated at entry and reconciled to reduce errors, gaps and duplication.',
        'Data-quality issues are logged, prioritised and remediated; critical measures are monitored.',
        'The data inventory records ownership, definitions and lineage for key data.',
      ],
      review: 'annually',
    },
  },
  {
    id: 'pci',
    name: 'Payment Card (PCI DSS) Policy',
    desc: 'Protecting cardholder data and reducing PCI scope.',
    owner: 'security',
    controls: ['pci-scope', 'encryption', 'access-control'],
    themes: ['payments', 'security'],
    draft: {
      purpose:
        'Protect cardholder data and keep [Organisation] compliant with the Payment Card Industry Data Security Standard (PCI DSS) while minimising its scope.',
      scope: 'All people, processes and systems that store, process or transmit cardholder data.',
      clauses: [
        'PCI scope is minimised — card data is tokenised or outsourced to a compliant payment processor wherever possible.',
        'The Primary Account Number is rendered unreadable in storage; sensitive authentication data (e.g. CVV) is never stored after authorisation.',
        'Access to cardholder data is restricted on a need-to-know basis, uniquely identified and logged.',
        'Applicable validation (Self-Assessment Questionnaire or assessment) is completed for the merchant level [annually].',
      ],
      review: 'annually, and with each PCI validation',
    },
  },
];

// ── Library derivations ─────────────────────────────────────────────────────
// The Policy Library is answer-independent: it shows every policy against the
// full universe of risks. We derive that master risk catalogue by running the
// risk engine over a maximal answer set, then attribute risks to policies by the
// controls they share — so the Library never drifts from the live engine.
const ALL_ANSWERS = {
  jurisdictions: ['eu', 'uk', 'us-ca', 'us-ny', 'us-federal', 'india', 'australia', 'canada', 'brazil', 'singapore', 'china', 'japan', 'southafrica', 'other'],
  sectors: ['healthcare', 'financial', 'children', 'public', 'payments', 'saas'],
  dataTypes: ['pii', 'health', 'children', 'cardholder', 'financial', 'employee'],
  activities: ['store', 'transfer', 'thirdparty', 'adm', 'ai'],
  role: 'both',
};
const MASTER_RISKS = dataRiskProfile(ALL_ANSWERS);
const ROLE_BY_KEY = Object.fromEntries(FRAMEWORK_ROLES.map((r) => [r.key, r]));

// Each policy joined with the role that owns it, the risks it addresses (shared
// control), and the example instruments its obligation themes come from.
export function libraryRows() {
  return POLICIES.map((p) => {
    const risks = MASTER_RISKS.filter((r) => (r.controls || []).some((c) => p.controls.includes(c)));
    const instrumentIds = [...new Set((p.themes || []).flatMap((t) => THEME_INSTRUMENTS[t] || []))];
    return { ...p, role: ROLE_BY_KEY[p.owner], risks, instrumentIds };
  });
}
