// A reference catalog of major DRC instruments worldwide.
// type:   Regulation | Law / Statute | Framework | Standard | Program / Cert
// scope:  "Global" (voluntary/international, usable anywhere) vs
//         "Region-specific" (legally binding within a jurisdiction)
// region: human-readable jurisdiction; regionGroup: bucket used for filtering.
//
// To extend: add an entry. Filters/lists derive from the data automatically.

export const catalog = [
  // ── Privacy & Data Protection ───────────────────────────────────────────
  { id: 'gdpr', name: 'GDPR', full: 'General Data Protection Regulation', type: 'Regulation', domain: 'Privacy & Data', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2018, summary: 'The benchmark privacy law: lawful basis, consent, data-subject rights, 72h breach notice, heavy fines. Extraterritorial reach.' },
  { id: 'uk-gdpr', name: 'UK GDPR + DPA 2018', full: 'UK GDPR & Data Protection Act 2018', type: 'Law / Statute', domain: 'Privacy & Data', region: 'United Kingdom', regionGroup: 'Europe', scope: 'Region-specific', year: 2018, summary: "Post-Brexit retained GDPR plus the UK's Data Protection Act, enforced by the ICO." },
  { id: 'ccpa', name: 'CCPA / CPRA', full: 'California Consumer Privacy Act (as amended by CPRA)', type: 'Law / Statute', domain: 'Privacy & Data', region: 'United States — California', regionGroup: 'North America', scope: 'Region-specific', year: 2020, summary: 'Consumer rights to know, delete, correct and opt out of sale/sharing. A model many US states now follow.' },
  { id: 'dpdp', name: 'DPDP Act', full: 'Digital Personal Data Protection Act, 2023', type: 'Law / Statute', domain: 'Privacy & Data', region: 'India', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 2023, summary: "India's consent-centric data protection law: notice, purpose limitation, data principal rights, the Data Protection Board." },
  { id: 'lgpd', name: 'LGPD', full: 'Lei Geral de Proteção de Dados', type: 'Law / Statute', domain: 'Privacy & Data', region: 'Brazil', regionGroup: 'Latin America', scope: 'Region-specific', year: 2020, summary: "Brazil's GDPR-aligned privacy law, enforced by the ANPD." },
  { id: 'pipeda', name: 'PIPEDA', full: 'Personal Information Protection and Electronic Documents Act', type: 'Law / Statute', domain: 'Privacy & Data', region: 'Canada', regionGroup: 'North America', scope: 'Region-specific', year: 2000, summary: 'Canada\'s federal private-sector privacy law built on ten fair-information principles.' },
  { id: 'pipl', name: 'PIPL', full: 'Personal Information Protection Law', type: 'Law / Statute', domain: 'Privacy & Data', region: 'China', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 2021, summary: "China's strict privacy law with consent rules and tight cross-border transfer controls." },
  { id: 'appi', name: 'APPI', full: 'Act on the Protection of Personal Information', type: 'Law / Statute', domain: 'Privacy & Data', region: 'Japan', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 2003, summary: "Japan's privacy law, with adequacy recognized by the EU." },
  { id: 'pdpa-sg', name: 'PDPA', full: 'Personal Data Protection Act (Singapore)', type: 'Law / Statute', domain: 'Privacy & Data', region: 'Singapore', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 2012, summary: 'Consent, purpose and notification obligations, overseen by the PDPC.' },
  { id: 'popia', name: 'POPIA', full: 'Protection of Personal Information Act', type: 'Law / Statute', domain: 'Privacy & Data', region: 'South Africa', regionGroup: 'Africa', scope: 'Region-specific', year: 2021, summary: "South Africa's data protection law, enforced by the Information Regulator." },
  { id: 'privacy-act-au', name: 'Privacy Act 1988', full: 'Privacy Act & Australian Privacy Principles', type: 'Law / Statute', domain: 'Privacy & Data', region: 'Australia', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 1988, summary: '13 Australian Privacy Principles plus a Notifiable Data Breaches scheme.' },
  { id: 'iso-27701', name: 'ISO/IEC 27701', full: 'Privacy Information Management System', type: 'Standard', domain: 'Privacy & Data', region: 'International', regionGroup: 'Global', scope: 'Global', year: 2019, summary: 'A privacy extension to ISO 27001 — certifiable PIMS, maps to GDPR-style obligations.' },

  // ── Children & Education ────────────────────────────────────────────────
  { id: 'coppa', name: 'COPPA', full: "Children's Online Privacy Protection Act", type: 'Law / Statute', domain: 'Privacy & Data', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', year: 1998, summary: 'Rules for collecting data from children under 13; FTC-enforced.' },
  { id: 'ferpa', name: 'FERPA', full: 'Family Educational Rights and Privacy Act', type: 'Law / Statute', domain: 'Privacy & Data', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', year: 1974, summary: 'Protects the privacy of student education records.' },

  // ── Health & Life Sciences ──────────────────────────────────────────────
  { id: 'hipaa', name: 'HIPAA', full: 'Health Insurance Portability and Accountability Act', type: 'Law / Statute', domain: 'Health', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', year: 1996, summary: 'Privacy & Security Rules for protected health information (PHI); breach notification.' },
  { id: 'hitrust', name: 'HITRUST CSF', full: 'HITRUST Common Security Framework', type: 'Framework', domain: 'Health', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'A certifiable framework that harmonizes HIPAA, ISO, NIST and more for healthcare.' },
  { id: 'cfr-part-11', name: '21 CFR Part 11', full: 'FDA Electronic Records & Signatures', type: 'Regulation', domain: 'Health', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', summary: 'FDA rules for trustworthy electronic records/signatures in regulated life sciences (GxP).' },

  // ── Financial Services ──────────────────────────────────────────────────
  { id: 'sox', name: 'SOX', full: 'Sarbanes-Oxley Act', type: 'Law / Statute', domain: 'Financial', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', year: 2002, summary: 'Financial-reporting integrity and internal controls (esp. §302/§404) for public companies.' },
  { id: 'glba', name: 'GLBA', full: 'Gramm-Leach-Bliley Act', type: 'Law / Statute', domain: 'Financial', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', year: 1999, summary: 'Safeguards Rule and privacy notices for financial institutions.' },
  { id: 'pci-dss', name: 'PCI DSS', full: 'Payment Card Industry Data Security Standard', type: 'Standard', domain: 'Financial', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'Contractual security standard for anyone storing/processing cardholder data — global by card-brand mandate.' },
  { id: 'basel-iii', name: 'Basel III', full: 'Basel III Accords', type: 'Framework', domain: 'Financial', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'Global banking standards for capital, leverage and liquidity risk (BCBS).' },
  { id: 'mifid2', name: 'MiFID II', full: 'Markets in Financial Instruments Directive II', type: 'Regulation', domain: 'Financial', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2018, summary: 'Investor protection, transparency and conduct rules for EU financial markets.' },
  { id: 'psd2', name: 'PSD2', full: 'Revised Payment Services Directive', type: 'Regulation', domain: 'Financial', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2018, summary: 'Open banking, strong customer authentication and third-party access in the EU.' },
  { id: 'dora', name: 'DORA', full: 'Digital Operational Resilience Act', type: 'Regulation', domain: 'Financial', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2025, summary: 'ICT risk, incident reporting and third-party (incl. cloud) oversight for EU financial entities.' },
  { id: 'nydfs-500', name: 'NYDFS 500', full: '23 NYCRR 500 Cybersecurity Regulation', type: 'Regulation', domain: 'Financial', region: 'United States — New York', regionGroup: 'North America', scope: 'Region-specific', year: 2017, summary: 'Cybersecurity program, CISO and incident-reporting rules for NY financial firms.' },
  { id: 'apra-cps234', name: 'APRA CPS 234', full: 'APRA Prudential Standard CPS 234 — Information Security', type: 'Regulation', domain: 'Financial', region: 'Australia', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 2019, summary: 'Mandatory information-security capabilities, controls and breach notification for APRA-regulated financial entities.' },
  { id: 'apra-cps230', name: 'APRA CPS 230', full: 'APRA Prudential Standard CPS 230 — Operational Risk Management', type: 'Regulation', domain: 'Financial', region: 'Australia', regionGroup: 'Asia-Pacific', scope: 'Region-specific', year: 2025, summary: 'Operational risk, business continuity and third-party (service-provider) management for APRA-regulated entities.' },

  // ── Security & IT Governance (frameworks/standards) ─────────────────────
  { id: 'iso-27001', name: 'ISO/IEC 27001', full: 'Information Security Management System', type: 'Standard', domain: 'Security', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'The leading certifiable ISMS standard — risk-based controls (Annex A).' },
  { id: 'iso-31000', name: 'ISO 31000', full: 'Risk Management — Guidelines', type: 'Standard', domain: 'Risk & Governance', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'Principles and a process for enterprise risk management (non-certifiable).' },
  { id: 'nist-csf', name: 'NIST CSF', full: 'NIST Cybersecurity Framework 2.0', type: 'Framework', domain: 'Security', region: 'United States (used globally)', regionGroup: 'Global', scope: 'Global', summary: 'Govern-Identify-Protect-Detect-Respond-Recover — voluntary, widely adopted worldwide.' },
  { id: 'nist-800-53', name: 'NIST SP 800-53', full: 'Security and Privacy Controls', type: 'Framework', domain: 'Security', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', summary: 'Detailed control catalog mandated for US federal systems (basis of FedRAMP).' },
  { id: 'soc2', name: 'SOC 2', full: 'AICPA Trust Services Criteria', type: 'Framework', domain: 'Security', region: 'United States (used globally)', regionGroup: 'Global', scope: 'Global', summary: 'Attestation over security, availability, confidentiality, processing integrity, privacy — the SaaS default.' },
  { id: 'cis', name: 'CIS Controls', full: 'CIS Critical Security Controls', type: 'Framework', domain: 'Security', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'A prioritized, practical set of defensive controls (v8).' },
  { id: 'cobit', name: 'COBIT', full: 'Control Objectives for Information & Related Technologies', type: 'Framework', domain: 'IT Governance', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'ISACA framework for governance and management of enterprise IT.' },
  { id: 'coso', name: 'COSO ERM', full: 'COSO Internal Control & Enterprise Risk Management', type: 'Framework', domain: 'Risk & Governance', region: 'International', regionGroup: 'Global', scope: 'Global', summary: 'The reference model for internal control and enterprise risk (underpins SOX programs).' },
  { id: 'fedramp', name: 'FedRAMP', full: 'Federal Risk and Authorization Management Program', type: 'Program / Cert', domain: 'Security', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', summary: 'Standardized security authorization for cloud services used by US federal agencies.' },
  { id: 'fisma', name: 'FISMA', full: 'Federal Information Security Modernization Act', type: 'Law / Statute', domain: 'Security', region: 'United States', regionGroup: 'North America', scope: 'Region-specific', year: 2014, summary: 'Mandates information security programs for US federal agencies.' },
  { id: 'cyber-essentials', name: 'Cyber Essentials', full: 'UK Cyber Essentials', type: 'Program / Cert', domain: 'Security', region: 'United Kingdom', regionGroup: 'Europe', scope: 'Region-specific', summary: 'UK government-backed baseline security certification.' },
  { id: 'nis2', name: 'NIS2', full: 'Network and Information Security Directive 2', type: 'Regulation', domain: 'Security', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2024, summary: 'Raised cybersecurity and incident-reporting duties for essential/important entities across the EU.' },

  // ── AI & Emerging ───────────────────────────────────────────────────────
  { id: 'eu-ai-act', name: 'EU AI Act', full: 'Artificial Intelligence Act', type: 'Regulation', domain: 'AI', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2024, summary: 'Risk-tiered rules for AI systems — the first comprehensive AI law.' },
  { id: 'iso-42001', name: 'ISO/IEC 42001', full: 'AI Management System', type: 'Standard', domain: 'AI', region: 'International', regionGroup: 'Global', scope: 'Global', year: 2023, summary: 'A certifiable management system for responsible AI governance.' },
  { id: 'nist-ai-rmf', name: 'NIST AI RMF', full: 'AI Risk Management Framework', type: 'Framework', domain: 'AI', region: 'United States (used globally)', regionGroup: 'Global', scope: 'Global', year: 2023, summary: 'Voluntary framework to map, measure, manage and govern AI risk.' },

  // ── ESG / Reporting ─────────────────────────────────────────────────────
  { id: 'csrd', name: 'CSRD', full: 'Corporate Sustainability Reporting Directive', type: 'Regulation', domain: 'ESG', region: 'European Union', regionGroup: 'Europe', scope: 'Region-specific', year: 2024, summary: 'Mandatory, audited sustainability/ESG reporting for large EU (and some non-EU) companies.' },
];

// Display order for region groups (Global first so the "used everywhere" set leads).
export const regionGroupOrder = ['Global', 'Europe', 'North America', 'Asia-Pacific', 'Latin America', 'Africa'];

export function uniqueValues(key) {
  return [...new Set(catalog.map((c) => c[key]))];
}

// Map an instrument to the road lesson whose concept it best illustrates:
// - laws & regulations are "the rules" → Rules of the Road
// - security standards/frameworks are how risk drops → The Controls
// - governance/risk/management frameworks are proven via → The Inspection
export function lessonSlugFor(item) {
  if (item.type === 'Law / Statute' || item.type === 'Regulation') return 'rules-of-the-road';
  if (item.domain === 'Security') return 'the-controls';
  return 'the-inspection';
}
