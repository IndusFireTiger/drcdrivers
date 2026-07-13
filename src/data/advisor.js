// ─────────────────────────────────────────────────────────────────────────
// The Navigator — sidecar data for "What applies to my product or organisation?"
//
// This is the DRC (Data Risk & Compliance) analog of the AI Governance
// Academy's Applicability Advisor. It sits ON TOP of the instrument catalog in
// ./drc-catalog.js: the catalog provides display fields (name, full, summary,
// type, scope), and this file adds, per instrument, the applicability TAGS +
// obligations + next actions the Navigator needs to answer "does this apply to
// you, and what then?".
//
// Style note: abbreviations are spelled out in full on first use within each
// card so a reader unfamiliar with the term still knows what it means.
//
// Educational guidance, not legal advice — every claim must be verified against
// the official source and qualified counsel.
//
// To add an instrument to the Navigator: add an `advisorMeta` entry keyed to a
// catalog `id`. Untagged catalog entries simply don't appear in the Navigator.
// ─────────────────────────────────────────────────────────────────────────

// ── Question vocabularies ────────────────────────────────────────────────
// Each option carries a `phrase` used to generate human "why this applies" text.

export const jurisdictionOptions = [
  { value: 'eu', label: 'European Union', phrase: 'operate in the EU' },
  { value: 'uk', label: 'United Kingdom', phrase: 'operate in the UK' },
  { value: 'us-ca', label: 'US — California', phrase: 'have California users' },
  { value: 'us-ny', label: 'US — New York', phrase: 'operate in New York' },
  { value: 'us-federal', label: 'US — federal / nationwide', phrase: 'operate in the US' },
  { value: 'india', label: 'India', phrase: 'operate in India' },
  { value: 'australia', label: 'Australia', phrase: 'operate in Australia' },
  { value: 'canada', label: 'Canada', phrase: 'operate in Canada' },
  { value: 'brazil', label: 'Brazil', phrase: 'operate in Brazil' },
  { value: 'singapore', label: 'Singapore', phrase: 'operate in Singapore' },
  { value: 'china', label: 'China', phrase: 'operate in China' },
  { value: 'japan', label: 'Japan', phrase: 'operate in Japan' },
  { value: 'southafrica', label: 'South Africa', phrase: 'operate in South Africa' },
  { value: 'other', label: 'Somewhere else / not sure', phrase: 'operate in your region' },
];

export const sectorOptions = [
  { value: 'healthcare', label: 'Healthcare / life sciences', phrase: 'work in healthcare' },
  { value: 'financial', label: 'Financial services / fintech', phrase: 'work in financial services' },
  { value: 'children', label: 'Children / EdTech (education technology)', phrase: 'serve children or students' },
  { value: 'public', label: 'Public sector / government', phrase: 'serve the public sector' },
  { value: 'payments', label: 'Payments / retail', phrase: 'handle payments' },
  { value: 'saas', label: 'General B2B (business-to-business) / SaaS (software-as-a-service)', phrase: 'are a SaaS business' },
];

export const dataOptions = [
  { value: 'pii', label: 'Personal data (Personally Identifiable Information, PII)', phrase: 'handle personal data' },
  { value: 'health', label: 'Health data (Protected Health Information, PHI)', phrase: 'handle health data' },
  { value: 'children', label: "Children's data", phrase: "handle children's data" },
  { value: 'cardholder', label: 'Cardholder / payment data', phrase: 'handle cardholder data' },
  { value: 'financial', label: 'Financial account records', phrase: 'handle financial records' },
  { value: 'employee', label: 'Employee data', phrase: 'handle employee data' },
];

export const activityOptions = [
  { value: 'store', label: 'Collect & store it', phrase: 'collect and store data' },
  { value: 'transfer', label: 'Transfer it across borders', phrase: 'transfer data across borders' },
  { value: 'thirdparty', label: 'Share it with third parties / processors', phrase: 'share data with third parties' },
  { value: 'adm', label: 'Make automated decisions', phrase: 'make automated decisions' },
  { value: 'ai', label: 'Train AI (artificial intelligence) / ML (machine learning) on it', phrase: 'train AI on data' },
];

export const roleOptions = [
  { value: 'controller', label: 'Controller (you decide why/how data is used)', phrase: 'act as a data controller' },
  { value: 'processor', label: 'Processor (you handle data on behalf of others)', phrase: 'act as a data processor' },
  { value: 'both', label: 'Both', phrase: 'act as both controller and processor' },
];

// ── Baseline traits (catch-all: what most DRC regimes share) ──────────────
export const traitLabels = {
  'lawful-basis': 'Lawful basis & transparent notice',
  dsr: 'Data-subject / consumer rights (access, deletion, correction)',
  security: 'Reasonable security safeguards',
  breach: 'Breach notification duties',
  retention: 'Retention limits & verifiable deletion',
  vendor: 'Processor / vendor management',
  transfer: 'Cross-border transfer controls',
};

// ── Per-instrument applicability + obligations + next actions ─────────────
// `applicability` dims: jurisdictions, sectors, dataTypes, activities, roles.
//   'any' = not gated on that dimension; an array = must intersect the answer.
// `bindingness`: 'binding' (law) | 'recommended' (voluntary) | 'watch' (proposed).
export const advisorMeta = [
  // ── Binding privacy laws ────────────────────────────────────────────────
  {
    id: 'gdpr',
    bindingness: 'binding',
    status: 'In force',
    url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    applicability: {
      jurisdictions: ['eu'], sectors: 'any', dataTypes: ['pii', 'health', 'children', 'financial', 'employee'], activities: 'any', roles: 'any',
    },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'retention', 'vendor', 'transfer'],
    obligations: [
      { title: 'Establish a lawful basis', detail: 'Every processing purpose needs a documented lawful basis (consent, contract, legitimate interest, etc.).' },
      { title: 'Honour data-subject rights', detail: 'Access, rectification, erasure, portability and objection — with response deadlines.' },
      { title: '72-hour breach notification', detail: 'Notify the supervisory authority within 72 hours of becoming aware of a personal-data breach.', appliesWhen: 'on a breach' },
      { title: 'Special-category safeguards', detail: 'Health and other Article 9 data need an additional condition and stronger controls.', appliesWhen: 'if you handle health data' },
      { title: 'Records & impact assessments', detail: 'Keep records of processing (Article 30) and run Data Protection Impact Assessments (DPIAs) for high-risk processing.' },
    ],
    nextActions: [
      { id: 'ropa', action: 'Build a Record of Processing Activities (RoPA)', owner: 'Data Protection Officer (DPO) / Legal', placeholder: 'Map every purpose, data category and recipient' },
      { id: 'dsr-flow', action: 'Stand up a Data-Subject-Access-Request (DSAR) workflow', owner: 'Product / Ops', placeholder: 'Intake, identity check, fulfil within 1 month' },
      { id: 'breach-runbook', action: 'Write a 72-hour breach runbook', owner: 'Security', placeholder: 'Detection → assessment → authority + subject notice' },
    ],
    keyDates: [{ date: '2018-05-25', label: 'GDPR (General Data Protection Regulation) became applicable' }],
  },
  {
    id: 'uk-gdpr',
    bindingness: 'binding',
    status: 'In force',
    url: 'https://ico.org.uk/for-organisations/data-protection-and-the-eu/',
    applicability: {
      jurisdictions: ['uk'], sectors: 'any', dataTypes: ['pii', 'health', 'children', 'financial', 'employee'], activities: 'any', roles: 'any',
    },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'retention', 'vendor', 'transfer'],
    obligations: [
      { title: 'UK GDPR + DPA 2018 duties', detail: 'Mirrors the General Data Protection Regulation (GDPR): lawful basis, rights, security and accountability, enforced by the Information Commissioner’s Office (ICO).' },
      { title: '72-hour breach notification to the ICO', detail: 'Report qualifying personal-data breaches to the Information Commissioner’s Office within 72 hours.', appliesWhen: 'on a breach' },
      { title: 'International transfer safeguards', detail: 'Use the International Data Transfer Agreement (IDTA) or UK Addendum for restricted transfers out of the UK.', appliesWhen: 'if you transfer data abroad' },
    ],
    nextActions: [
      { id: 'ico-register', action: "Confirm Information Commissioner's Office (ICO) registration / data-protection fee", owner: 'Legal', placeholder: 'Most controllers must register and pay the fee' },
      { id: 'idta', action: 'Adopt the International Data Transfer Agreement (IDTA) for restricted transfers', owner: 'Legal', placeholder: 'Replace legacy Standard Contractual Clauses for UK-origin transfers' },
    ],
  },
  {
    id: 'ccpa',
    bindingness: 'binding',
    status: 'In force',
    url: 'https://oag.ca.gov/privacy/ccpa',
    applicability: {
      jurisdictions: ['us-ca'], sectors: 'any', dataTypes: ['pii', 'children', 'financial', 'employee'], activities: 'any', roles: 'any',
    },
    traits: ['lawful-basis', 'dsr', 'security', 'vendor'],
    obligations: [
      { title: 'Consumer rights', detail: 'Rights to know, delete, correct, and opt out of sale/sharing of personal information.' },
      { title: '"Do Not Sell or Share" mechanism', detail: 'Honour opt-out signals (including the Global Privacy Control, GPC) and post the required link.' },
      { title: 'Notice at collection', detail: 'Disclose the categories collected and the purposes at or before the point of collection.' },
    ],
    nextActions: [
      { id: 'dns-link', action: 'Add a "Do Not Sell or Share My Info" flow', owner: 'Product', placeholder: 'Honour Global Privacy Control (GPC) browser signals automatically' },
      { id: 'threshold', action: 'Confirm you meet a California Consumer Privacy Act (CCPA) applicability threshold', owner: 'Legal', placeholder: 'Revenue / volume / data-sale tests' },
    ],
  },
  {
    id: 'dpdp',
    bindingness: 'binding',
    status: 'Enacted; rules phasing in',
    url: 'https://www.meity.gov.in/data-protection-framework',
    applicability: {
      jurisdictions: ['india'], sectors: 'any', dataTypes: ['pii', 'health', 'children', 'financial', 'employee'], activities: 'any', roles: 'any',
    },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'retention', 'vendor'],
    obligations: [
      { title: 'Consent-first processing', detail: 'Give clear notice and obtain consent; support consent withdrawal as easily as it was given.' },
      { title: 'Verifiable parental consent for children', detail: 'No tracking / targeted ads to children; parental consent required.', appliesWhen: "if you handle children's data" },
      { title: 'Data-principal rights & grievance redress', detail: 'Access, correction, erasure and a grievance mechanism, overseen by the Data Protection Board.' },
    ],
    nextActions: [
      { id: 'consent-notice', action: 'Rework consent notices to the Digital Personal Data Protection (DPDP) standard', owner: 'Product / Legal', placeholder: 'Itemised, plain-language, withdrawable' },
      { id: 'grievance', action: 'Publish a grievance-redress contact', owner: 'Ops', placeholder: 'Named officer + response service-level agreement (SLA)' },
    ],
  },

  // ── Binding sectoral laws ───────────────────────────────────────────────
  {
    id: 'hipaa',
    bindingness: 'binding',
    status: 'In force',
    url: 'https://www.hhs.gov/hipaa/index.html',
    applicability: {
      jurisdictions: ['us-federal', 'us-ca', 'us-ny'], sectors: ['healthcare'], dataTypes: ['health'], activities: 'any', roles: 'any',
    },
    traits: ['security', 'breach', 'vendor', 'dsr'],
    obligations: [
      { title: 'Privacy & Security Rules for PHI', detail: 'Administrative, physical and technical safeguards for Protected Health Information (PHI).' },
      { title: 'Business Associate Agreements (BAAs)', detail: 'Sign a Business Associate Agreement with any vendor that touches Protected Health Information on your behalf.', appliesWhen: 'if you use processors' },
      { title: 'Breach notification', detail: 'Notify individuals, the Department of Health and Human Services (HHS) and (for large breaches) the media within set timelines.', appliesWhen: 'on a breach' },
    ],
    nextActions: [
      { id: 'baa', action: 'Inventory PHI vendors and sign Business Associate Agreements (BAAs)', owner: 'Legal / Security', placeholder: 'No Protected Health Information to a vendor without a signed BAA' },
      { id: 'sra', action: 'Run a HIPAA Security Risk Assessment (SRA)', owner: 'Security', placeholder: 'Document safeguards against the Security Rule' },
    ],
  },
  {
    id: 'glba',
    bindingness: 'binding',
    status: 'In force',
    url: 'https://www.ftc.gov/business-guidance/privacy-security/gramm-leach-bliley-act',
    applicability: {
      jurisdictions: ['us-federal', 'us-ca', 'us-ny'], sectors: ['financial'], dataTypes: ['financial', 'pii'], activities: 'any', roles: 'any',
    },
    traits: ['security', 'lawful-basis', 'vendor'],
    obligations: [
      { title: 'Safeguards Rule', detail: 'Maintain a written information-security program with a qualified individual accountable for it.' },
      { title: 'Privacy notices & opt-out', detail: 'Give consumers privacy notices and an opt-out of certain information sharing.' },
    ],
    nextActions: [
      { id: 'infosec-program', action: 'Document a GLBA-aligned information-security (InfoSec) program', owner: 'Security', placeholder: 'Named owner, risk assessment, controls' },
    ],
  },
  {
    id: 'coppa',
    bindingness: 'binding',
    status: 'In force',
    url: 'https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa',
    applicability: {
      jurisdictions: ['us-federal', 'us-ca', 'us-ny'], sectors: ['children'], dataTypes: ['children'], activities: 'any', roles: 'any',
    },
    traits: ['lawful-basis', 'dsr', 'retention', 'vendor'],
    obligations: [
      { title: 'Verifiable parental consent', detail: 'Get verifiable parental consent before collecting data from children under 13.' },
      { title: 'Data minimisation & deletion', detail: 'Collect only what is needed and delete when no longer required.' },
    ],
    nextActions: [
      { id: 'age-gate', action: 'Add an age screen + parental-consent flow', owner: 'Product', placeholder: 'Block under-13 data collection without consent' },
    ],
  },
  {
    id: 'pci-dss',
    bindingness: 'binding',
    status: 'Contractual (card-brand mandate)',
    url: 'https://www.pcisecuritystandards.org/',
    applicability: {
      jurisdictions: 'any', sectors: 'any', dataTypes: ['cardholder'], activities: 'any', roles: 'any',
    },
    traits: ['security', 'vendor', 'retention'],
    obligations: [
      { title: 'Protect cardholder data', detail: 'Encrypt, restrict and monitor access to stored cardholder data; never store the Card Verification Value (CVV).' },
      { title: 'Scope minimisation', detail: 'Reduce Payment Card Industry (PCI) scope — tokenise or outsource to a compliant payment processor.' },
      { title: 'Annual validation', detail: 'Complete the Self-Assessment Questionnaire (SAQ) or a Qualified Security Assessor (QSA) assessment matched to your merchant level.' },
    ],
    nextActions: [
      { id: 'scope', action: 'Minimise cardholder-data scope', owner: 'Engineering', placeholder: 'Use a tokenising Payment Service Provider (PSP); keep the Primary Account Number (PAN) out of your systems' },
      { id: 'saq', action: 'Determine your merchant level + Self-Assessment Questionnaire (SAQ) type', owner: 'Security / Finance', placeholder: 'Volume decides SAQ vs. Qualified Security Assessor (QSA) audit' },
    ],
  },

  // ── Recommended voluntary standards (global) ────────────────────────────
  {
    id: 'iso-27001',
    bindingness: 'recommended',
    status: 'Voluntary standard',
    url: 'https://www.iso.org/standard/27001',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'vendor', 'retention'],
    obligations: [
      { title: 'Risk-based ISMS', detail: 'Run an Information Security Management System (ISMS) with Annex A controls selected by risk.' },
      { title: 'Certifiable', detail: 'An accredited certificate is the credential enterprise buyers most often ask for.' },
    ],
    nextActions: [
      { id: 'gap', action: 'Run an ISO/IEC 27001 gap assessment', owner: 'Security', placeholder: 'Map current controls to Annex A' },
    ],
  },
  {
    id: 'iso-27701',
    bindingness: 'recommended',
    status: 'Voluntary standard',
    url: 'https://www.iso.org/standard/71670.html',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: ['pii', 'health', 'children', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'vendor'],
    obligations: [
      { title: 'Privacy Information Management System', detail: 'A certifiable Privacy Information Management System (PIMS) extension to ISO/IEC 27001 that maps to General Data Protection Regulation (GDPR)-style obligations.' },
    ],
    nextActions: [
      { id: 'pims', action: 'Extend your Information Security Management System (ISMS) to a Privacy Information Management System (PIMS)', owner: 'Data Protection Officer (DPO) / Security', placeholder: 'Adds controller/processor privacy controls' },
    ],
  },
  {
    id: 'soc2',
    bindingness: 'recommended',
    status: 'Voluntary attestation',
    url: 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2',
    applicability: { jurisdictions: 'any', sectors: ['saas', 'financial', 'healthcare'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'vendor'],
    obligations: [
      { title: 'Trust Services Criteria', detail: 'Independent attestation (by the American Institute of Certified Public Accountants, AICPA) over security — and optionally availability, confidentiality, processing integrity, privacy.' },
      { title: 'Type I vs Type II', detail: 'Type II tests controls over a period — the version most buyers require.' },
    ],
    nextActions: [
      { id: 'soc2-scope', action: 'Pick your System and Organization Controls 2 (SOC 2) criteria + window', owner: 'Security', placeholder: 'Security is mandatory; add others by buyer demand' },
    ],
  },
  {
    id: 'nist-csf',
    bindingness: 'recommended',
    status: 'Voluntary framework',
    url: 'https://www.nist.gov/cyberframework',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'breach'],
    obligations: [
      { title: 'Govern-Identify-Protect-Detect-Respond-Recover', detail: 'A common language to organise your security program; maps to most other standards.' },
    ],
    nextActions: [
      { id: 'csf-profile', action: 'Set a current + target Cybersecurity Framework (CSF) profile', owner: 'Security', placeholder: 'Prioritise gaps by the six functions' },
    ],
  },

  // ── More binding privacy laws (region-specific) ─────────────────────────
  {
    id: 'lgpd', bindingness: 'binding', status: 'In force', url: 'https://www.gov.br/anpd/',
    applicability: { jurisdictions: ['brazil'], sectors: 'any', dataTypes: ['pii', 'health', 'children', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'vendor', 'transfer'],
    obligations: [
      { title: 'Legal basis & data-subject rights', detail: "Brazil's General Data Protection Regulation (GDPR)-aligned law: a legal basis for processing plus access, correction and deletion rights, enforced by the National Data Protection Authority (ANPD)." },
      { title: 'Appoint a Data Protection Officer (DPO)', detail: 'Controllers must designate a person in charge of data (the "encarregado").' },
    ],
    nextActions: [{ id: 'anpd-dpo', action: 'Designate a Data Protection Officer (DPO)', owner: 'Legal', placeholder: 'Publish contact for data-subject requests' }],
  },
  {
    id: 'pipeda', bindingness: 'binding', status: 'In force', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/',
    applicability: { jurisdictions: ['canada'], sectors: 'any', dataTypes: ['pii', 'health', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'vendor'],
    obligations: [
      { title: 'Ten fair-information principles', detail: 'Consent, accountability, limiting collection/use, safeguards and individual access govern private-sector data.' },
      { title: 'Breach reporting to the OPC', detail: 'Report breaches of security safeguards posing real risk of significant harm to the Office of the Privacy Commissioner (OPC).', appliesWhen: 'on a breach' },
    ],
    nextActions: [{ id: 'consent-review', action: 'Review consent against the PIPEDA principles', owner: 'Legal', placeholder: 'Meaningful, purpose-specific consent' }],
  },
  {
    id: 'pipl', bindingness: 'binding', status: 'In force', url: 'http://www.npc.gov.cn/',
    applicability: { jurisdictions: ['china'], sectors: 'any', dataTypes: ['pii', 'health', 'children', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'transfer'],
    obligations: [
      { title: 'Separate consent', detail: 'Sensitive data and many uses require specific, separate consent.' },
      { title: 'Cross-border transfer controls', detail: 'A security assessment, standard contract or certification is required before exporting personal information from China.', appliesWhen: 'if you transfer data abroad' },
    ],
    nextActions: [{ id: 'pipl-transfer', action: 'Pick a Personal Information Protection Law (PIPL) cross-border mechanism', owner: 'Legal', placeholder: 'Cyberspace Administration of China (CAC) assessment / standard contract / certification' }],
  },
  {
    id: 'appi', bindingness: 'binding', status: 'In force', url: 'https://www.ppc.go.jp/en/',
    applicability: { jurisdictions: ['japan'], sectors: 'any', dataTypes: ['pii', 'health', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'transfer'],
    obligations: [
      { title: 'Purpose specification & consent', detail: 'Specify the purpose of use; obtain consent for third-party provision.' },
      { title: 'Transfer restrictions', detail: 'Additional steps are needed to transfer personal data outside Japan.', appliesWhen: 'if you transfer data abroad' },
    ],
    nextActions: [{ id: 'appi-purpose', action: 'Publish purpose-of-use notices', owner: 'Legal', placeholder: 'Japanese-language, per the APPI' }],
  },
  {
    id: 'pdpa-sg', bindingness: 'binding', status: 'In force', url: 'https://www.pdpc.gov.sg/',
    applicability: { jurisdictions: ['singapore'], sectors: 'any', dataTypes: ['pii', 'health', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'vendor'],
    obligations: [
      { title: 'Consent, purpose & notification', detail: 'Obtain consent, limit to notified purposes, and protect data — overseen by the Personal Data Protection Commission (PDPC).' },
      { title: 'Mandatory breach notification', detail: 'Notify the Personal Data Protection Commission and affected individuals for notifiable breaches.', appliesWhen: 'on a breach' },
    ],
    nextActions: [{ id: 'pdpa-dpo', action: 'Appoint a Data Protection Officer (DPO)', owner: 'Ops', placeholder: 'Required for all organisations in Singapore' }],
  },
  {
    id: 'popia', bindingness: 'binding', status: 'In force', url: 'https://inforegulator.org.za/',
    applicability: { jurisdictions: ['southafrica'], sectors: 'any', dataTypes: ['pii', 'health', 'children', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'vendor'],
    obligations: [
      { title: 'Eight processing conditions', detail: 'Lawful, minimal, purpose-limited processing with security safeguards, enforced by the Information Regulator.' },
    ],
    nextActions: [{ id: 'popia-officer', action: 'Register an Information Officer', owner: 'Legal', placeholder: 'Register with the Information Regulator' }],
  },
  {
    id: 'privacy-act-au', bindingness: 'binding', status: 'In force', url: 'https://www.oaic.gov.au/privacy/the-privacy-act',
    applicability: { jurisdictions: ['australia'], sectors: 'any', dataTypes: ['pii', 'health', 'financial', 'employee'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'security', 'breach', 'vendor'],
    obligations: [
      { title: '13 Australian Privacy Principles (APPs)', detail: 'Open, fair collection and handling of personal information.' },
      { title: 'Notifiable Data Breaches scheme', detail: 'Notify the Office of the Australian Information Commissioner (OAIC) and affected individuals of eligible data breaches.', appliesWhen: 'on a breach' },
    ],
    nextActions: [{ id: 'app-map', action: 'Map handling to the 13 Australian Privacy Principles (APPs)', owner: 'Legal', placeholder: 'Gap-check collection, use and disclosure' }],
  },
  {
    id: 'ferpa', bindingness: 'binding', status: 'In force', url: 'https://studentprivacy.ed.gov/',
    applicability: { jurisdictions: ['us-federal', 'us-ca', 'us-ny'], sectors: ['children'], dataTypes: ['pii', 'children'], activities: 'any', roles: 'any' },
    traits: ['lawful-basis', 'dsr', 'vendor', 'retention'],
    obligations: [
      { title: 'Protect education records', detail: 'Control disclosure of Personally Identifiable Information (PII) from student education records.' },
      { title: 'School-official / consent basis', detail: 'Vendors act under the "school official" exception with direct control and use limits.', appliesWhen: 'if you serve schools' },
    ],
    nextActions: [{ id: 'ferpa-dpa', action: 'Sign FERPA-compliant data agreements with schools', owner: 'Legal', placeholder: 'Bind use, redisclosure and deletion' }],
  },

  // ── Health (sectoral) ───────────────────────────────────────────────────
  {
    id: 'cfr-part-11', bindingness: 'binding', status: 'In force', url: 'https://www.fda.gov/',
    applicability: { jurisdictions: ['us-federal', 'us-ca', 'us-ny'], sectors: ['healthcare'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'retention'],
    obligations: [
      { title: 'Trustworthy electronic records', detail: 'Audit trails, validation and controls for electronic records/signatures in Food and Drug Administration (FDA)-regulated Good Practice (GxP) contexts.' },
    ],
    nextActions: [{ id: 'part11-validate', action: 'Validate systems for 21 CFR Part 11', owner: 'Quality / Eng', placeholder: 'Audit trails + electronic-signature controls' }],
  },
  {
    id: 'hitrust', bindingness: 'recommended', status: 'Voluntary framework', url: 'https://hitrustalliance.net/',
    applicability: { jurisdictions: 'any', sectors: ['healthcare'], dataTypes: ['health', 'pii'], activities: 'any', roles: 'any' },
    traits: ['security', 'vendor'],
    obligations: [
      { title: 'Certifiable harmonised controls', detail: 'A certifiable framework that maps HIPAA (Health Insurance Portability and Accountability Act), ISO (International Organization for Standardization) and NIST (National Institute of Standards and Technology) into one healthcare control set.' },
    ],
    nextActions: [{ id: 'hitrust-scope', action: 'Scope a HITRUST assessment', owner: 'Security', placeholder: 'e1 / i1 / r2 by risk and buyer demand' }],
  },

  // ── Financial (sectoral) ────────────────────────────────────────────────
  {
    id: 'sox', bindingness: 'binding', status: 'In force', url: 'https://www.sec.gov/',
    applicability: { jurisdictions: ['us-federal', 'us-ca', 'us-ny'], sectors: ['financial'], dataTypes: ['financial'], activities: 'any', roles: 'any' },
    traits: ['security', 'retention'],
    obligations: [
      { title: 'Internal controls over financial reporting', detail: 'Management assessment and controls (Sections 302/404) for public-company financial data.' },
    ],
    nextActions: [{ id: 'itgc', action: 'Document IT General Controls (ITGCs)', owner: 'Finance / Security', placeholder: 'Access, change and operations controls' }],
  },
  {
    id: 'basel-iii', bindingness: 'recommended', status: 'Framework (via regulators)', url: 'https://www.bis.org/bcbs/basel3.htm',
    applicability: { jurisdictions: 'any', sectors: ['financial'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security'],
    obligations: [
      { title: 'Capital, leverage & liquidity risk', detail: 'Global banking standards implemented through national prudential regulators.' },
    ],
    nextActions: [{ id: 'risk-data', action: 'Confirm risk-data aggregation quality', owner: 'Risk', placeholder: 'Basel Committee on Banking Supervision (BCBS) 239 data lineage & accuracy' }],
  },
  {
    id: 'mifid2', bindingness: 'binding', status: 'In force', url: 'https://www.esma.europa.eu/',
    applicability: { jurisdictions: ['eu'], sectors: ['financial'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['retention', 'security'],
    obligations: [
      { title: 'Conduct, transparency & record-keeping', detail: 'Investor protection and record-keeping (including communications) for EU investment firms.' },
    ],
    nextActions: [{ id: 'comms-retention', action: 'Retain records & communications', owner: 'Compliance', placeholder: 'Meet MiFID II (Markets in Financial Instruments Directive II) retention windows' }],
  },
  {
    id: 'psd2', bindingness: 'binding', status: 'In force', url: 'https://www.eba.europa.eu/',
    applicability: { jurisdictions: ['eu'], sectors: ['financial', 'payments'], dataTypes: ['financial', 'cardholder'], activities: 'any', roles: 'any' },
    traits: ['security', 'lawful-basis'],
    obligations: [
      { title: 'Strong Customer Authentication', detail: 'Strong Customer Authentication (SCA) and secure open-banking Application Programming Interfaces (APIs) for EU payment services.' },
    ],
    nextActions: [{ id: 'sca', action: 'Implement Strong Customer Authentication (SCA) on payment flows', owner: 'Engineering', placeholder: 'Two-factor per the PSD2 Regulatory Technical Standards (RTS)' }],
  },
  {
    id: 'dora', bindingness: 'binding', status: 'Applies from 2025', url: 'https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en',
    applicability: { jurisdictions: ['eu'], sectors: ['financial'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'breach', 'vendor'],
    obligations: [
      { title: 'ICT risk & incident reporting', detail: 'Manage Information and Communication Technology (ICT) risk, report major incidents, and test operational resilience.' },
      { title: 'Third-party (cloud) oversight', detail: 'Register and manage critical Information and Communication Technology third-party providers.', appliesWhen: 'if you rely on cloud/vendors' },
    ],
    nextActions: [{ id: 'ict-register', action: 'Build an Information and Communication Technology (ICT) third-party register', owner: 'Risk / Vendor mgmt', placeholder: 'Map critical providers + exit plans' }],
    keyDates: [{ date: '2025-01-17', label: 'DORA (Digital Operational Resilience Act) became applicable' }],
  },
  {
    id: 'nydfs-500', bindingness: 'binding', status: 'In force', url: 'https://www.dfs.ny.gov/industry_guidance/cybersecurity',
    applicability: { jurisdictions: ['us-ny'], sectors: ['financial'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'breach'],
    obligations: [
      { title: 'Cybersecurity program + CISO', detail: 'A risk-based program, a designated Chief Information Security Officer (CISO), and 72-hour incident reporting.' },
    ],
    nextActions: [{ id: 'ciso', action: 'Designate a Chief Information Security Officer (CISO) + annual certification', owner: 'Security', placeholder: 'File the NYDFS certification' }],
  },
  {
    id: 'apra-cps234', bindingness: 'binding', status: 'In force', url: 'https://www.apra.gov.au/information-security-cps-234',
    applicability: { jurisdictions: ['australia'], sectors: ['financial'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'breach', 'vendor'],
    obligations: [
      { title: 'Information-security capability', detail: 'Maintain controls sized to threats and notify the Australian Prudential Regulation Authority (APRA) of material incidents.' },
    ],
    nextActions: [{ id: 'cps234-test', action: 'Test controls & third-party assurance', owner: 'Security', placeholder: 'Evidence control effectiveness to APRA' }],
  },
  {
    id: 'apra-cps230', bindingness: 'binding', status: 'Applies from 2025', url: 'https://www.apra.gov.au/operational-risk-management',
    applicability: { jurisdictions: ['australia'], sectors: ['financial'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'vendor'],
    obligations: [
      { title: 'Operational risk & continuity', detail: 'Manage operational risk, business continuity and service-provider arrangements.' },
    ],
    nextActions: [{ id: 'cps230-bcp', action: 'Set tolerances for critical operations', owner: 'Risk', placeholder: 'Map critical ops + provider dependencies' }],
    keyDates: [{ date: '2025-07-01', label: 'APRA CPS 230 (Operational Risk Management) took effect' }],
  },

  // ── Security & IT governance (frameworks/standards) ─────────────────────
  {
    id: 'iso-31000', bindingness: 'recommended', status: 'Voluntary standard', url: 'https://www.iso.org/iso-31000-risk-management.html',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security'],
    obligations: [{ title: 'Enterprise risk process', detail: 'Principles and a process to identify, assess and treat risk (non-certifiable).' }],
    nextActions: [{ id: 'risk-register', action: 'Stand up a risk register', owner: 'Risk', placeholder: 'Rate by likelihood × impact, assign owners' }],
  },
  {
    id: 'nist-800-53', bindingness: 'binding', status: 'Mandated (US federal)', url: 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final',
    applicability: { jurisdictions: ['us-federal'], sectors: ['public'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'vendor'],
    obligations: [{ title: 'Control catalog', detail: 'Detailed security & privacy controls mandated for US federal systems (the basis of the Federal Risk and Authorization Management Program, FedRAMP).' }],
    nextActions: [{ id: 'baseline', action: 'Select a control baseline (Low/Moderate/High)', owner: 'Security', placeholder: 'Tailor NIST SP 800-53 controls to impact level' }],
  },
  {
    id: 'cis', bindingness: 'recommended', status: 'Voluntary framework', url: 'https://www.cisecurity.org/controls',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security'],
    obligations: [{ title: 'Prioritised defensive controls', detail: 'A practical, ranked set of security controls (version 8) from the Center for Internet Security (CIS) — a fast starting point.' }],
    nextActions: [{ id: 'ig1', action: 'Implement CIS Implementation Group 1 (IG1)', owner: 'Security', placeholder: 'Essential cyber hygiene first' }],
  },
  {
    id: 'cobit', bindingness: 'recommended', status: 'Voluntary framework', url: 'https://www.isaca.org/resources/cobit',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'vendor'],
    obligations: [{ title: 'IT governance model', detail: 'A framework (from ISACA) aligning information-technology governance and management to enterprise goals.' }],
    nextActions: [{ id: 'cobit-map', action: 'Map governance objectives to COBIT', owner: 'IT governance', placeholder: 'Assign accountability for IT processes' }],
  },
  {
    id: 'coso', bindingness: 'recommended', status: 'Voluntary framework', url: 'https://www.coso.org/',
    applicability: { jurisdictions: 'any', sectors: ['financial', 'public'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security'],
    obligations: [{ title: 'Internal control & ERM', detail: 'The reference model for internal control and Enterprise Risk Management (ERM) that underpins Sarbanes-Oxley (SOX) programs.' }],
    nextActions: [{ id: 'coso-controls', action: 'Frame controls to the COSO components', owner: 'Finance / Risk', placeholder: 'Control environment → monitoring' }],
  },
  {
    id: 'fedramp', bindingness: 'binding', status: 'Authorization program', url: 'https://www.fedramp.gov/',
    applicability: { jurisdictions: ['us-federal'], sectors: ['public'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'vendor'],
    obligations: [{ title: 'Cloud authorization', detail: 'A standardized security authorization required to sell cloud services to US agencies.' }],
    nextActions: [{ id: 'fedramp-path', action: 'Choose a FedRAMP path (agency / Program Management Office, PMO)', owner: 'Security / Sales', placeholder: 'Sponsor + NIST SP 800-53 control implementation' }],
  },
  {
    id: 'fisma', bindingness: 'binding', status: 'In force', url: 'https://www.cisa.gov/topics/cyber-threats-and-advisories/federal-information-security-modernization-act',
    applicability: { jurisdictions: ['us-federal'], sectors: ['public'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security'],
    obligations: [{ title: 'Federal security program', detail: 'Information-security programs and reporting for US federal agencies and contractors.' }],
    nextActions: [{ id: 'ato', action: 'Pursue an Authority to Operate (ATO)', owner: 'Security', placeholder: 'Document + assess against NIST SP 800-53' }],
  },
  {
    id: 'cyber-essentials', bindingness: 'recommended', status: 'UK certification', url: 'https://www.ncsc.gov.uk/cyberessentials/overview',
    applicability: { jurisdictions: ['uk'], sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security'],
    obligations: [{ title: 'Baseline security certification', detail: 'A UK government-backed baseline (often required for public-sector contracts).' }],
    nextActions: [{ id: 'ce-cert', action: 'Certify to Cyber Essentials', owner: 'Security', placeholder: 'Five technical controls; the Plus tier adds an audit' }],
  },
  {
    id: 'nis2', bindingness: 'binding', status: 'In force', url: 'https://digital-strategy.ec.europa.eu/en/policies/nis2-directive',
    applicability: { jurisdictions: ['eu'], sectors: ['healthcare', 'financial', 'public', 'payments'], dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['security', 'breach', 'vendor'],
    obligations: [
      { title: 'Cyber risk management + reporting', detail: 'Security measures and incident reporting for essential/important entities.' },
      { title: 'Management accountability', detail: 'Governing bodies are accountable for cybersecurity risk measures.' },
    ],
    nextActions: [{ id: 'nis2-scope', action: 'Confirm essential/important classification', owner: 'Legal / Security', placeholder: 'Sector + size decide if NIS2 applies' }],
  },

  // ── AI & emerging ───────────────────────────────────────────────────────
  {
    id: 'eu-ai-act', bindingness: 'watch', status: 'Phasing in through 2027', url: 'https://artificial-intelligence-act.eu/',
    applicability: { jurisdictions: ['eu'], sectors: 'any', dataTypes: 'any', activities: ['ai', 'adm'], roles: 'any' },
    traits: ['security', 'dsr'],
    obligations: [
      { title: 'Risk-tiered AI obligations', detail: 'Prohibited / high-risk / limited / minimal tiers set duties from bans to transparency.' },
      { title: 'High-risk system duties', detail: 'Risk management, data governance, logging, human oversight and documentation.', appliesWhen: 'if your AI is high-risk' },
    ],
    nextActions: [{ id: 'ai-tier', action: 'Classify your AI system risk tier', owner: 'Product / Legal', placeholder: 'Check Annex III high-risk categories' }],
    keyDates: [{ date: '2026-08-02', label: 'High-risk obligations begin to apply' }],
  },
  {
    id: 'iso-42001', bindingness: 'recommended', status: 'Voluntary standard', url: 'https://www.iso.org/standard/81230.html',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: ['ai', 'adm'], roles: 'any' },
    traits: ['security', 'dsr'],
    obligations: [{ title: 'AI management system', detail: 'A certifiable management system for responsible Artificial Intelligence (AI) governance.' }],
    nextActions: [{ id: 'aims', action: 'Stand up an AI Management System (AIMS)', owner: 'AI governance', placeholder: 'Policies, impact assessments, oversight' }],
  },
  {
    id: 'nist-ai-rmf', bindingness: 'recommended', status: 'Voluntary framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    applicability: { jurisdictions: 'any', sectors: 'any', dataTypes: 'any', activities: ['ai', 'adm'], roles: 'any' },
    traits: ['security'],
    obligations: [{ title: 'Map–Measure–Manage–Govern', detail: 'A voluntary framework to identify and manage Artificial Intelligence (AI) risk across the lifecycle.' }],
    nextActions: [{ id: 'ai-rmf', action: 'Run the AI Risk Management Framework (AI RMF) Govern + Map functions', owner: 'AI governance', placeholder: 'Context, risks and roles for each system' }],
  },

  // ── ESG / reporting ─────────────────────────────────────────────────────
  {
    id: 'csrd', bindingness: 'watch', status: 'Phasing in by company wave', url: 'https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en',
    applicability: { jurisdictions: ['eu'], sectors: 'any', dataTypes: 'any', activities: 'any', roles: 'any' },
    traits: ['retention'],
    obligations: [{ title: 'Audited sustainability reporting', detail: 'Mandatory, assured Environmental, Social and Governance (ESG) disclosures for large EU (and some non-EU) companies, phased by size.' }],
    nextActions: [{ id: 'csrd-scope', action: 'Check if/when your company is in scope', owner: 'Finance / Legal', placeholder: 'Size thresholds decide your reporting year' }],
  },
];

// ── Case-study presets (also the manual regression fixtures) ──────────────
// Keep the quartet spanning: EU-sensitive, US-sector, multi-jurisdiction, and
// uncovered-jurisdiction (catch-all) — that's what keeps coverage broad.
export const caseStudies = [
  {
    id: 'medisummary',
    name: 'MediSummary Health',
    blurb: 'EU + UK health SaaS, health data, cross-border',
    inputs: {
      jurisdictions: ['eu', 'uk'], sectors: ['healthcare', 'saas'], dataTypes: ['pii', 'health'], activities: ['store', 'transfer', 'thirdparty'], role: 'controller',
    },
  },
  {
    id: 'paywise',
    name: 'PayWise Lending',
    blurb: 'US fintech, payment + financial data',
    inputs: {
      jurisdictions: ['us-federal', 'us-ny'], sectors: ['financial', 'payments'], dataTypes: ['pii', 'financial', 'cardholder'], activities: ['store', 'adm'], role: 'controller',
    },
  },
  {
    id: 'littlelearn',
    name: 'LittleLearn EdTech',
    blurb: "India + US kids' app, children's data",
    inputs: {
      jurisdictions: ['india', 'us-federal'], sectors: ['children'], dataTypes: ['pii', 'children'], activities: ['store', 'thirdparty'], role: 'controller',
    },
  },
  {
    id: 'globaldata',
    name: 'GlobalData Startup',
    blurb: 'Uncovered jurisdiction, general personal data',
    inputs: {
      jurisdictions: ['other'], sectors: ['saas'], dataTypes: ['pii'], activities: ['store', 'ai'], role: 'processor',
    },
  },
];

// ── Join advisor meta with catalog display fields ─────────────────────────
export function buildItems(catalog) {
  const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
  return advisorMeta
    .map((m) => {
      const c = byId[m.id];
      if (!c) return null;
      return {
        instrumentId: m.id,
        name: c.name,
        full: c.full,
        summary: c.summary,
        type: c.type,
        scope: c.scope,
        domain: c.domain,
        ...m,
      };
    })
    .filter(Boolean);
}
