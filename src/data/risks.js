// ─────────────────────────────────────────────────────────────────────────
// The data-risk engine — the DRC analog of a risk-tier classifier.
//
// `dataRiskProfile` turns a set of answers (jurisdictions, sectors, data types,
// activities, role) into a numbered risk register, each risk rated by likelihood
// × impact, tagged with the controls that mitigate it and the CIA property it
// threatens. Extracted from the Navigator so both the answer-driven report and
// the standing Policy Library can share one source of truth.
//
// Likelihood / impact are rated low|med|high; severity is their product on a
// 3×3 matrix (green ≤2, amber 3–4, red ≥6).
//
// Educational guidance, not legal advice.
// ─────────────────────────────────────────────────────────────────────────

const LV = { low: 1, med: 2, high: 3 };

export function severity(r) {
  const s = LV[r.likelihood] * LV[r.impact];
  return s >= 6 ? 'high' : s >= 3 ? 'med' : 'low';
}

export function dataRiskProfile(a) {
  const risks = [];
  const has = (arr, v) => arr.includes(v);
  // push(icon, label, detail, likelihood, impact, controls[], cia[])
  const push = (icon, label, detail, likelihood, impact, controls, cia) => risks.push({ icon, label, detail, likelihood, impact, controls, cia });
  const hasPersonal = a.dataTypes.some((d) => ['pii', 'health', 'children', 'financial', 'employee'].includes(d));
  const covered = a.jurisdictions.some((j) => j !== 'other');
  const coveredCount = a.jurisdictions.filter((j) => j !== 'other').length;

  // ── Breach & security ──
  if (hasPersonal)
    push('🔓', 'Personal-data breach', 'Unauthorised access to, or exfiltration of, the personal data you hold — the classic breach.', 'med', 'high', ['encryption', 'access-control', 'logging', 'incident-response'], ['C']);
  if (hasPersonal && covered)
    push('⏱️', 'Missed breach-notification clock', 'A breach starts a statutory notification clock (e.g. 72 hours under the General Data Protection Regulation, GDPR / UK GDPR). Miss it and one incident becomes two failures.', 'med', 'high', ['incident-response', 'logging'], ['C']);
  push('🕵️', 'Insider threat & over-broad access', 'Staff, contractors or service accounts able to see far more data than their role needs.', 'med', 'med', ['access-control', 'mfa', 'logging', 'security-training'], ['C', 'I']);
  push('🛠️', 'Weak security controls', 'Missing encryption, patching, logging or access reviews that turn a minor incident into a major one.', 'med', 'high', ['encryption', 'vuln-mgmt', 'logging', 'mfa'], ['C', 'I', 'A']);

  // ── Cross-border transfer ──
  if (has(a.activities, 'transfer'))
    push('🌐', 'Unlawful cross-border transfer', 'Moving personal data across borders without a valid mechanism (adequacy, Standard Contractual Clauses/International Data Transfer Agreement) or breaching data-localisation rules.', 'high', 'high', ['transfer-mechanism', 'data-inventory'], ['C']);

  // ── Third parties / processors ──
  if (has(a.activities, 'thirdparty')) {
    push('🔗', 'Third-party / supply-chain breach', 'A processor or vendor mishandles or leaks data you remain accountable for.', 'med', 'high', ['vendor-mgmt', 'logging', 'incident-response'], ['C', 'A']);
    push('📄', 'Missing data-processing agreements', 'Sharing data without the contractual terms (DPAs / Business Associate Agreements) regulators require.', 'med', 'med', ['vendor-mgmt'], ['C']);
  }

  // ── Storage, retention & availability ──
  if (has(a.activities, 'store')) {
    push('🗄️', 'Over-retention', 'Keeping data longer than needed — a larger breach blast-radius and an erasure liability.', 'high', 'med', ['retention', 'data-minimization', 'data-inventory'], ['C']);
    push('👻', 'Shadow data & unknown copies', 'Ungoverned copies in exports, backups and analytics you cannot find or delete on request.', 'high', 'med', ['data-inventory', 'retention', 'access-control'], ['C']);
    push('💥', 'Data loss or service outage', 'Ransomware, accidental deletion or an outage makes data unavailable — no backups or recovery plan turns an incident into prolonged downtime.', 'med', 'high', ['backup', 'incident-response', 'logging'], ['A']);
  }

  // ── Data-type-specific ──
  if (has(a.dataTypes, 'health'))
    push('🩺', 'Special-category (health) mishandling', 'Health data needs an extra lawful condition and stronger safeguards; ordinary handling is non-compliant.', 'med', 'high', ['consent-mgmt', 'encryption', 'access-control', 'dpia'], ['C']);
  if (has(a.dataTypes, 'children'))
    push('🧒', "Children's-data / age-assurance failure", "Collecting children's data without verifiable parental consent or age-appropriate design.", 'med', 'high', ['age-verification', 'consent-mgmt', 'data-minimization'], ['C']);
  if (has(a.dataTypes, 'cardholder'))
    push('💳', 'Cardholder-data compromise', 'Card data in scope brings the Payment Card Industry Data Security Standard (PCI DSS); storing the PAN/CVV or weak controls invites fraud and fines.', 'med', 'high', ['pci-scope', 'encryption', 'access-control'], ['C', 'I']);
  if (has(a.dataTypes, 'financial'))
    push('🏦', 'Financial-data misuse / fraud', 'Account records are a high-value target and an anti-fraud / anti-money-laundering concern.', 'med', 'high', ['access-control', 'logging', 'incident-response'], ['C', 'I']);
  if (has(a.dataTypes, 'employee'))
    push('🧑‍💼', 'Employee-monitoring overreach', 'Processing employee data beyond proportionate, transparent limits.', 'low', 'med', ['consent-mgmt', 'dpia', 'data-minimization'], ['C']);

  // ── Automated decisions & AI ──
  if (has(a.activities, 'adm')) {
    push('⚖️', 'Unfair / unexplainable decisions', 'Solely automated decisions with significant effects trigger rights to explanation and human review.', 'med', 'high', ['human-review', 'dpia'], ['I']);
    push('📊', 'Bias & discrimination', 'Skewed data or proxy variables produce discriminatory outcomes — legal and reputational exposure.', 'med', 'high', ['bias-testing', 'human-review', 'data-quality'], ['I']);
  }
  if (has(a.activities, 'ai')) {
    push('🧠', 'Training-data provenance & consent', 'Using personal data to train models without a lawful basis or a compatible purpose.', 'high', 'med', ['model-governance', 'consent-mgmt', 'dpia'], ['C', 'I']);
    push('🫥', 'Model leakage / re-identification', 'Models memorising and re-emitting personal data, or enabling re-identification of individuals.', 'low', 'high', ['model-governance', 'data-minimization', 'encryption'], ['C']);
  }

  // ── Rights, consent, quality ──
  if (hasPersonal) {
    push('📨', 'Data-subject-rights failure', "Unable to find, export or provably delete a person's data across every system on request.", 'med', 'med', ['dsar-process', 'data-inventory'], ['A', 'I']);
    push('✅', 'Consent / lawful-basis gaps', 'Processing without a documented basis, or relying on consent that isn’t freely given or specific.', 'med', 'high', ['consent-mgmt', 'dpia'], ['C']);
  }
  push('🧩', 'Poor data quality', 'Wrong, stale or duplicated data driving wrong decisions and unreliable reporting.', 'high', 'low', ['data-quality'], ['I']);

  // ── Jurisdictional (governance — not a pure CIA risk) ──
  if (coveredCount >= 2)
    push('🗺️', 'Conflicting multi-jurisdiction rules', 'Overlapping regimes with different definitions, timelines and thresholds to reconcile.', 'high', 'med', ['data-inventory', 'dpia'], []);
  if (has(a.jurisdictions, 'other'))
    push('❓', 'Regulatory uncertainty', 'Operating where the regime is unclear or emerging — rules can arrive fast, sometimes retroactively.', 'med', 'med', ['dpia', 'data-inventory'], []);

  // ── Role ──
  if (a.role === 'processor' || a.role === 'both')
    push('📑', 'Processing beyond instructions', "As a processor, acting outside the controller's documented instructions, or an opaque sub-processor chain.", 'low', 'med', ['vendor-mgmt', 'logging'], ['C']);

  return risks.map((r, i) => ({ num: i + 1, ...r }));
}
