import { useEffect, useMemo, useState } from 'react';
import { catalog, lessonSlugFor } from '../data/drc-catalog.js';
import {
  buildItems,
  caseStudies,
  jurisdictionOptions,
  sectorOptions,
  dataOptions,
  activityOptions,
  roleOptions,
  traitLabels,
} from '../data/advisor.js';

// ── The Navigator: five questions → the DRC laws, standards and next actions
// that apply to your product. Client-side matcher over the instrument catalog.
// Educational guidance, not legal advice.

const items = buildItems(catalog);

const phrases = {
  jurisdictions: Object.fromEntries(jurisdictionOptions.map((o) => [o.value, o.phrase])),
  sectors: Object.fromEntries(sectorOptions.map((o) => [o.value, o.phrase])),
  dataTypes: Object.fromEntries(dataOptions.map((o) => [o.value, o.phrase])),
  activities: Object.fromEntries(activityOptions.map((o) => [o.value, o.phrase])),
  roles: Object.fromEntries(roleOptions.map((o) => [o.value, o.phrase])),
};

const SAVE_KEY = 'drcdrivers:navigator';
const EMPTY = { jurisdictions: [], sectors: [], dataTypes: [], activities: [], role: 'controller' };

// ── matcher helpers ────────────────────────────────────────────────────────
function inter(metaTags, selected) {
  if (metaTags === 'any') return { any: true, hits: [] };
  return { any: false, hits: metaTags.filter((t) => selected.includes(t)) };
}

function matchItem(item, a) {
  const userRoles = a.role === 'both' ? ['controller', 'processor'] : [a.role];
  const j = inter(item.applicability.jurisdictions, a.jurisdictions);
  const s = inter(item.applicability.sectors, a.sectors);
  const d = inter(item.applicability.dataTypes, a.dataTypes);
  const u = inter(item.applicability.activities, a.activities);
  const r = inter(item.applicability.roles, userRoles);
  const ok =
    (j.any || j.hits.length) &&
    (s.any || s.hits.length) &&
    (d.any || d.hits.length) &&
    (u.any || u.hits.length) &&
    (r.any || r.hits.length);
  return { ok, hits: { j, s, d, u } };
}

function listPhrase(arr) {
  if (arr.length <= 1) return arr.join('');
  return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
}

function reasonFor(item, hits) {
  if (item.bindingness === 'recommended') {
    return 'A widely-adopted standard — recommended as good practice wherever you operate.';
  }
  if (item.bindingness === 'watch') {
    return 'Proposed or phasing in — not yet fully binding, but worth preparing for now.';
  }
  const clauses = [];
  if (!hits.j.any && hits.j.hits.length) clauses.push(listPhrase(hits.j.hits.map((t) => phrases.jurisdictions[t])));
  if (!hits.d.any && hits.d.hits.length) clauses.push(listPhrase(hits.d.hits.map((t) => phrases.dataTypes[t])));
  if (!hits.s.any && hits.s.hits.length) clauses.push(listPhrase(hits.s.hits.map((t) => phrases.sectors[t])));
  return clauses.length ? 'This applies because you ' + listPhrase(clauses) + '.' : 'This applies to your product or organisation.';
}

// ── data-risk profile (the DRC analog of a risk-tier classifier) ────────────
// Likelihood / impact are rated low|med|high; severity is their product on a
// 3×3 matrix (green ≤2, amber 3–4, red ≥6).
const LV = { low: 1, med: 2, high: 3 };
export function severity(r) {
  const s = LV[r.likelihood] * LV[r.impact];
  return s >= 6 ? 'high' : s >= 3 ? 'med' : 'low';
}

function dataRiskProfile(a) {
  const risks = [];
  const has = (arr, v) => arr.includes(v);
  // push(icon, label, detail, likelihood, impact, controls[])
  const push = (icon, label, detail, likelihood, impact, controls) => risks.push({ icon, label, detail, likelihood, impact, controls });
  const hasPersonal = a.dataTypes.some((d) => ['pii', 'health', 'children', 'financial', 'employee'].includes(d));
  const covered = a.jurisdictions.some((j) => j !== 'other');
  const coveredCount = a.jurisdictions.filter((j) => j !== 'other').length;

  // ── Breach & security ──
  if (hasPersonal)
    push('🔓', 'Personal-data breach', 'Unauthorised access to, or exfiltration of, the personal data you hold — the classic breach.', 'med', 'high', ['encryption', 'access-control', 'logging', 'incident-response']);
  if (hasPersonal && covered)
    push('⏱️', 'Missed breach-notification clock', 'A breach starts a statutory notification clock (e.g. 72 hours under the General Data Protection Regulation, GDPR / UK GDPR). Miss it and one incident becomes two failures.', 'med', 'high', ['incident-response', 'logging']);
  push('🕵️', 'Insider threat & over-broad access', 'Staff, contractors or service accounts able to see far more data than their role needs.', 'med', 'med', ['access-control', 'mfa', 'logging', 'security-training']);
  push('🛠️', 'Weak security controls', 'Missing encryption, patching, logging or access reviews that turn a minor incident into a major one.', 'med', 'high', ['encryption', 'vuln-mgmt', 'logging', 'mfa']);

  // ── Cross-border transfer ──
  if (has(a.activities, 'transfer'))
    push('🌐', 'Unlawful cross-border transfer', 'Moving personal data across borders without a valid mechanism (adequacy, Standard Contractual Clauses/International Data Transfer Agreement) or breaching data-localisation rules.', 'high', 'high', ['transfer-mechanism', 'data-inventory']);

  // ── Third parties / processors ──
  if (has(a.activities, 'thirdparty')) {
    push('🔗', 'Third-party / supply-chain breach', 'A processor or vendor mishandles or leaks data you remain accountable for.', 'med', 'high', ['vendor-mgmt', 'logging', 'incident-response']);
    push('📄', 'Missing data-processing agreements', 'Sharing data without the contractual terms (DPAs / Business Associate Agreements) regulators require.', 'med', 'med', ['vendor-mgmt']);
  }

  // ── Storage & retention ──
  if (has(a.activities, 'store')) {
    push('🗄️', 'Over-retention', 'Keeping data longer than needed — a larger breach blast-radius and an erasure liability.', 'high', 'med', ['retention', 'data-minimization', 'data-inventory']);
    push('👻', 'Shadow data & unknown copies', 'Ungoverned copies in exports, backups and analytics you cannot find or delete on request.', 'high', 'med', ['data-inventory', 'retention', 'access-control']);
  }

  // ── Data-type-specific ──
  if (has(a.dataTypes, 'health'))
    push('🩺', 'Special-category (health) mishandling', 'Health data needs an extra lawful condition and stronger safeguards; ordinary handling is non-compliant.', 'med', 'high', ['consent-mgmt', 'encryption', 'access-control', 'dpia']);
  if (has(a.dataTypes, 'children'))
    push('🧒', "Children's-data / age-assurance failure", "Collecting children's data without verifiable parental consent or age-appropriate design.", 'med', 'high', ['age-verification', 'consent-mgmt', 'data-minimization']);
  if (has(a.dataTypes, 'cardholder'))
    push('💳', 'Cardholder-data compromise', 'Card data in scope brings the Payment Card Industry Data Security Standard (PCI DSS); storing the PAN/CVV or weak controls invites fraud and fines.', 'med', 'high', ['pci-scope', 'encryption', 'access-control']);
  if (has(a.dataTypes, 'financial'))
    push('🏦', 'Financial-data misuse / fraud', 'Account records are a high-value target and an anti-fraud / anti-money-laundering concern.', 'med', 'high', ['access-control', 'logging', 'incident-response']);
  if (has(a.dataTypes, 'employee'))
    push('🧑‍💼', 'Employee-monitoring overreach', 'Processing employee data beyond proportionate, transparent limits.', 'low', 'med', ['consent-mgmt', 'dpia', 'data-minimization']);

  // ── Automated decisions & AI ──
  if (has(a.activities, 'adm')) {
    push('⚖️', 'Unfair / unexplainable decisions', 'Solely automated decisions with significant effects trigger rights to explanation and human review.', 'med', 'high', ['human-review', 'dpia']);
    push('📊', 'Bias & discrimination', 'Skewed data or proxy variables produce discriminatory outcomes — legal and reputational exposure.', 'med', 'high', ['bias-testing', 'human-review', 'data-quality']);
  }
  if (has(a.activities, 'ai')) {
    push('🧠', 'Training-data provenance & consent', 'Using personal data to train models without a lawful basis or a compatible purpose.', 'high', 'med', ['model-governance', 'consent-mgmt', 'dpia']);
    push('🫥', 'Model leakage / re-identification', 'Models memorising and re-emitting personal data, or enabling re-identification of individuals.', 'low', 'high', ['model-governance', 'data-minimization', 'encryption']);
  }

  // ── Rights, consent, quality ──
  if (hasPersonal) {
    push('📨', 'Data-subject-rights failure', "Unable to find, export or provably delete a person's data across every system on request.", 'med', 'med', ['dsar-process', 'data-inventory']);
    push('✅', 'Consent / lawful-basis gaps', 'Processing without a documented basis, or relying on consent that isn’t freely given or specific.', 'med', 'high', ['consent-mgmt', 'dpia']);
  }
  push('🧩', 'Poor data quality', 'Wrong, stale or duplicated data driving wrong decisions and unreliable reporting.', 'high', 'low', ['data-quality']);

  // ── Jurisdictional ──
  if (coveredCount >= 2)
    push('🗺️', 'Conflicting multi-jurisdiction rules', 'Overlapping regimes with different definitions, timelines and thresholds to reconcile.', 'high', 'med', ['data-inventory', 'dpia']);
  if (has(a.jurisdictions, 'other'))
    push('❓', 'Regulatory uncertainty', 'Operating where the regime is unclear or emerging — rules can arrive fast, sometimes retroactively.', 'med', 'med', ['dpia', 'data-inventory']);

  // ── Role ──
  if (a.role === 'processor' || a.role === 'both')
    push('📑', 'Processing beyond instructions', "As a processor, acting outside the controller's documented instructions, or an opaque sub-processor chain.", 'low', 'med', ['vendor-mgmt', 'logging']);

  return risks.map((r, i) => ({ num: i + 1, ...r }));
}

// ── Control catalog: id → human name. Shared by risks and policies. ─────────
const CONTROLS = {
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

// ── Policy catalog: each policy establishes a set of controls. ──────────────
const POLICIES = [
  { id: 'infosec', name: 'Information Security Policy', desc: 'Baseline technical & organisational security measures.', controls: ['encryption', 'access-control', 'mfa', 'logging', 'vuln-mgmt', 'backup'] },
  { id: 'access', name: 'Access Control Policy', desc: 'Who may access what, and how access is granted & reviewed.', controls: ['access-control', 'mfa', 'logging'] },
  { id: 'retention', name: 'Data Retention & Disposal Policy', desc: 'How long data is kept and how it is securely deleted.', controls: ['retention', 'data-minimization', 'data-inventory'] },
  { id: 'classification', name: 'Data Classification & Handling Policy', desc: 'Labelling data by sensitivity, with handling rules per label.', controls: ['data-inventory', 'encryption', 'access-control'] },
  { id: 'privacy', name: 'Privacy Policy & Notice', desc: 'How personal data is collected, used and shared, and on what basis.', controls: ['consent-mgmt', 'dsar-process', 'data-minimization'] },
  { id: 'dsar', name: 'Data-Subject Rights Policy', desc: 'The process to fulfil access, correction and erasure requests.', controls: ['dsar-process', 'data-inventory'] },
  { id: 'consent', name: 'Consent Management Policy', desc: 'Capturing, recording and withdrawing consent (incl. children).', controls: ['consent-mgmt', 'age-verification'] },
  { id: 'vendor', name: 'Third-Party / Vendor Management Policy', desc: 'Due diligence and contracts for processors & suppliers.', controls: ['vendor-mgmt', 'logging'] },
  { id: 'transfer', name: 'International Data Transfer Policy', desc: 'Lawful mechanisms for moving data across borders.', controls: ['transfer-mechanism', 'data-inventory'] },
  { id: 'incident', name: 'Incident Response & Breach Notification Policy', desc: 'Detect, assess, contain and notify within statutory clocks.', controls: ['incident-response', 'logging'] },
  { id: 'dpia', name: 'DPIA / Risk Assessment Policy', desc: 'When and how to assess high-risk processing before launch.', controls: ['dpia'] },
  { id: 'awareness', name: 'Acceptable Use & Security Awareness Policy', desc: 'Staff responsibilities and recurring training.', controls: ['security-training', 'access-control'] },
  { id: 'ai', name: 'Responsible AI & Automated-Decision Policy', desc: 'Oversight, fairness and data provenance for AI / automated decisions.', controls: ['human-review', 'bias-testing', 'model-governance'] },
  { id: 'quality', name: 'Data Quality & Governance Policy', desc: 'Accuracy, validation and ownership of data.', controls: ['data-quality', 'data-inventory'] },
  { id: 'pci', name: 'Payment Card (PCI DSS) Policy', desc: 'Protecting cardholder data and reducing PCI scope.', controls: ['pci-scope', 'encryption', 'access-control'] },
];

// Recommend the policies whose controls address the active risks; annotate each
// with the controls it establishes (that are relevant) and the risks it mitigates.
function policyPlan(risks) {
  const needed = new Set();
  risks.forEach((r) => (r.controls || []).forEach((c) => needed.add(c)));
  return POLICIES.map((p) => {
    const covered = p.controls.filter((c) => needed.has(c));
    if (!covered.length) return null;
    const mitigates = risks.filter((r) => (r.controls || []).some((c) => p.controls.includes(c)));
    return { ...p, covered, mitigates };
  })
    .filter(Boolean)
    .sort((x, y) => y.mitigates.length - x.mitigates.length);
}

// ── baseline traits (catch-all) ─────────────────────────────────────────────
function baselineTraits(pool) {
  const counts = {};
  const examples = {};
  pool.forEach((item) =>
    (item.traits || []).forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
      (examples[t] = examples[t] || []).push(item.name);
    })
  );
  return Object.keys(counts)
    .sort((x, y) => counts[y] - counts[x])
    .slice(0, 6)
    .map((t) => ({ label: traitLabels[t], eg: [...new Set(examples[t])].slice(0, 3).join(', ') }));
}

const TIER_CLASS = {
  binding: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  recommended: 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  watch: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

// Severity colours for the risk matrix + list, and short axis labels.
const SEV = {
  low: { label: 'Low', chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300', cell: 'bg-emerald-100 dark:bg-emerald-900/25', swatch: 'bg-emerald-200 dark:bg-emerald-900/50' },
  med: { label: 'Medium', chip: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300', cell: 'bg-amber-100 dark:bg-amber-900/25', swatch: 'bg-amber-200 dark:bg-amber-900/50' },
  high: { label: 'High', chip: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300', cell: 'bg-rose-100 dark:bg-rose-900/25', swatch: 'bg-rose-200 dark:bg-rose-900/50' },
};
const DL = { low: 'Low', med: 'Med', high: 'High' };

export default function Navigator() {
  const [answers, setAnswers] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(null); // the answers snapshot that produced results
  const [checked, setChecked] = useState({}); // { "inst:act": true }
  const [showEmptyHint, setShowEmptyHint] = useState(false);

  // restore last session
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (saved && hasAny(saved)) {
        setAnswers(saved);
        setSubmitted(saved);
      }
      const c = JSON.parse(localStorage.getItem(SAVE_KEY + ':actions') || '{}');
      setChecked(c);
    } catch {}
  }, []);

  const model = useMemo(() => (submitted ? computeModel(submitted) : null), [submitted]);

  function toggle(name, value) {
    setAnswers((a) => {
      const set = new Set(a[name]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...a, [name]: [...set] };
    });
  }

  function submit(e) {
    e?.preventDefault();
    if (!hasAny(answers)) {
      setSubmitted(null);
      setShowEmptyHint(true);
      return;
    }
    setShowEmptyHint(false);
    localStorage.setItem(SAVE_KEY, JSON.stringify(answers));
    setSubmitted(answers);
  }

  function clear() {
    setAnswers(EMPTY);
    setSubmitted(null);
    setShowEmptyHint(false);
    localStorage.removeItem(SAVE_KEY);
  }

  function applyPreset(cs) {
    const a = { ...EMPTY, ...cs.inputs };
    setAnswers(a);
    localStorage.setItem(SAVE_KEY, JSON.stringify(a));
    setSubmitted(a);
    setShowEmptyHint(false);
  }

  function toggleAction(inst, act) {
    const key = `${inst}:${act}`;
    setChecked((c) => {
      const next = { ...c, [key]: !c[key] };
      if (!next[key]) delete next[key];
      localStorage.setItem(SAVE_KEY + ':actions', JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mx-auto max-w-2xl">
      <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm print:hidden">
        <a href="/atlas" className="text-slate-500 hover:text-amber-600 dark:text-slate-400">🌍 Atlas</a>
        <a href="/road" className="text-slate-500 hover:text-amber-600 dark:text-slate-400">🛣️ The DRC road (lessons)</a>
      </nav>
      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 print:hidden">🧭 The Navigator</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100 print:hidden">What applies to my product or organisation?</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300 print:hidden">
        Answer five short questions about your product or organisation and we'll map the Data Risk &amp;
        Compliance (DRC) laws, standards and obligations most likely to apply — with concrete next steps.
      </p>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-slate-700 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-slate-200 print:hidden">
        <strong>⚠️ Educational guidance, not legal advice.</strong> This is a learning aid built on the{' '}
        <a href="/atlas" className="font-medium text-amber-700 underline dark:text-amber-400">Data Risk &amp; Compliance (DRC) Atlas</a>. It isn't
        exhaustive. Verify everything against the official source and qualified counsel.
      </div>

      {/* presets */}
      <section className="mt-6 print:hidden">
        <p className="text-sm text-slate-500 dark:text-slate-400">Not sure where to start? Try a hypothetical product:</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {caseStudies.map((cs) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => applyPreset(cs)}
              className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="block font-semibold text-slate-800 dark:text-slate-100">{cs.name}</span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{cs.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      {/* questionnaire */}
      <form onSubmit={submit} className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 print:hidden">
        <CheckGroup n={1} legend="Where do you operate or have users?" hint="select all" name="jurisdictions" options={jurisdictionOptions} answers={answers} onToggle={toggle} />
        <CheckGroup n={2} legend="What sector are you in?" hint="select all" name="sectors" options={sectorOptions} answers={answers} onToggle={toggle} />
        <CheckGroup n={3} legend="What data do you handle?" hint="select all" name="dataTypes" options={dataOptions} answers={answers} onToggle={toggle} />
        <CheckGroup n={4} legend="What do you do with it?" hint="select all" name="activities" options={activityOptions} answers={answers} onToggle={toggle} />

        <fieldset>
          <legend className="font-semibold text-slate-800 dark:text-slate-200">
            <span className="mr-1 text-amber-600 dark:text-amber-400">5 ·</span> What is your role?
          </legend>
          <div className="mt-3 space-y-2">
            {roleOptions.map((o) => (
              <label key={o.value} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="radio" name="role" value={o.value} checked={answers.role === o.value} onChange={() => setAnswers((a) => ({ ...a, role: o.value }))} className="mt-0.5 accent-amber-500" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="rounded-lg bg-amber-500 px-5 py-2.5 font-medium text-white hover:bg-amber-600">Show what applies →</button>
          <button type="button" onClick={clear} className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300">Clear</button>
        </div>
      </form>

      {showEmptyHint && (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Select at least one option above (or pick an example), then choose <em>Show what applies</em>.</p>
      )}
      </div>

      {/* results */}
      {model && <Results model={model} answers={submitted} checked={checked} onToggleAction={toggleAction} />}
    </div>
  );
}

// ── subcomponents ────────────────────────────────────────────────────────────
function CheckGroup({ n, legend, hint, name, options, answers, onToggle }) {
  return (
    <fieldset>
      <legend className="font-semibold text-slate-800 dark:text-slate-200">
        <span className="mr-1 text-amber-600 dark:text-amber-400">{n} ·</span> {legend}
        {hint && <span className="ml-1 text-xs font-normal text-slate-400">({hint})</span>}
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={answers[name].includes(o.value)} onChange={() => onToggle(name, o.value)} className="mt-0.5 accent-amber-500" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Results({ model, answers, checked, onToggleAction }) {
  // The visible container sections, in scroll order. Each is a TOC entry.
  const sections = [];
  if (model.risk.length) {
    sections.push({ id: 'sec-risk', title: '🧭 Your data-risk profile', tocLabel: 'Data-risk profile', body: <RiskProfile risks={model.risk} /> });
    const policies = policyPlan(model.risk);
    if (policies.length) {
      sections.push({ id: 'sec-policies', title: '🛡️ Policies to implement', tocLabel: 'Policies', body: <PolicyPlan policies={policies} /> });
    }
  }
  if (model.binding.length) {
    sections.push({ id: 'sec-applies', title: '✅ Applies to you', tocLabel: 'Applies to you', body: <CardList sub="Binding rules matched to your answers — treat these as obligations. Click any to expand." list={model.binding} checked={checked} onToggleAction={onToggleAction} /> });
  }
  if (model.recommended.length) {
    sections.push({ id: 'sec-recommended', title: '📋 Recommended good practice', tocLabel: 'Recommended', body: <CardList sub="Voluntary frameworks and standards that strengthen your posture. Click any to expand." list={model.recommended} checked={checked} onToggleAction={onToggleAction} /> });
  }
  if (model.watch.length) {
    sections.push({ id: 'sec-watch', title: '👀 Worth watching', tocLabel: 'Worth watching', body: <CardList sub="Proposed or phasing-in rules not yet fully in force. Click any to expand." list={model.watch} checked={checked} onToggleAction={onToggleAction} /> });
  }
  if (model.showBaseline) {
    sections.push({ id: 'sec-baseline', title: '🌐 Baseline expectations', tocLabel: 'Baseline', body: <BaselineList baseline={model.baseline} /> });
  }

  const sectionIds = sections.map((s) => s.id).join(',');
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [active, setActive] = useState(null);

  // Scroll-spy: highlight the section nearest the top of the viewport.
  useEffect(() => {
    const ids = sectionIds.split(',').filter(Boolean);
    setActive((prev) => (prev && ids.includes(prev) ? prev : ids[0] || null));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds]);

  const allOpen = sections.every((s) => !collapsed.has(s.id));
  const toggleAll = () => setCollapsed(allOpen ? new Set(sections.map((s) => s.id)) : new Set());
  const toggleOne = (id) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section id="nav-report" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your applicability report</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{describeAnswers(answers)}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={toggleAll} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300">{allOpen ? '⊟ Collapse all' : '⊞ Expand all'}</button>
          <button type="button" onClick={printReport} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300">🖨 Print / PDF</button>
          <button type="button" onClick={() => downloadMarkdown(model, answers, checked)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300">⬇ Markdown</button>
        </div>
      </div>
      <div className="mt-3 hidden rounded-lg border border-slate-300 px-4 py-2 text-xs text-slate-500 print:block">
        Educational guidance, not legal advice — verify every item against its official source and qualified counsel.
      </div>

      <div className="mt-6 lg:flex lg:justify-center lg:gap-8">
        {/* Table of contents */}
        <nav className="mb-6 shrink-0 lg:sticky lg:top-6 lg:mb-0 lg:h-max lg:w-52 print:hidden" aria-label="On this page">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">On this page</p>
          <ul className="border-l border-slate-200 dark:border-slate-700">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm transition ${
                    active === s.id
                      ? 'border-amber-500 font-medium text-amber-600 dark:text-amber-400'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {s.tocLabel}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Report body */}
        <div className="min-w-0 flex-1 space-y-6 lg:max-w-2xl">
          {sections.map((s) => (
            <Section key={s.id} id={s.id} title={s.title} active={active === s.id} open={!collapsed.has(s.id)} onToggle={() => toggleOne(s.id)}>
              {s.body}
            </Section>
          ))}
        </div>
      </div>
    </section>
  );
}

// A collapsible container section. Body stays in the DOM when collapsed
// (hidden on screen, shown on print) so Print/PDF captures everything.
function Section({ id, title, active, open, onToggle, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div
        className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors dark:bg-slate-800 ${
          active ? 'border-amber-400 dark:border-amber-500' : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left" aria-expanded={open}>
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</span>
          <span className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
        </button>
        <div className={open ? 'px-5 pb-5' : 'hidden px-5 pb-5 print:block'}>{children}</div>
      </div>
    </section>
  );
}

function RiskProfile({ risks }) {
  const [likF, setLikF] = useState('all');
  const [impF, setImpF] = useState('all');
  const filtered = risks.filter((r) => (likF === 'all' || r.likelihood === likF) && (impF === 'all' || r.impact === impF));

  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The data risks your answers imply, plotted by likelihood × impact. Each number maps to the table below.
      </p>
      <RiskMatrix risks={risks} />

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 print:hidden">
        <FilterGroup label="Likelihood" value={likF} onChange={setLikF} />
        <FilterGroup label="Impact" value={impF} onChange={setImpF} />
        <span className="text-xs text-slate-400">Showing {filtered.length} of {risks.length}</span>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
              <th className="w-8 py-2 pr-2 font-semibold">#</th>
              <th className="py-2 pr-3 font-semibold">Risk</th>
              <th className="py-2 pr-2 font-semibold">Likelihood</th>
              <th className="py-2 pr-2 font-semibold">Impact</th>
              <th className="py-2 font-semibold">Severity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const sev = SEV[severity(r)];
              return (
                <tr key={r.num} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="py-2.5 pr-2 text-slate-400">{r.num}</td>
                  <td className="py-2.5 pr-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{r.icon} {r.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{r.detail}</span>
                    {r.controls?.length > 0 && (
                      <span className="mt-1.5 block">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Suggested controls</span>
                        <span className="mt-1 flex flex-wrap gap-1">
                          {r.controls.map((c) => (
                            <span key={c} className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{CONTROLS[c]}</span>
                          ))}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-2"><Pill className={SEV[r.likelihood].chip}>{DL[r.likelihood]}</Pill></td>
                  <td className="py-2.5 pr-2"><Pill className={SEV[r.impact].chip}>{DL[r.impact]}</Pill></td>
                  <td className="py-2.5"><Pill className={sev.chip}>{sev.label}</Pill></td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-5 text-center text-sm text-slate-400">No risks match this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Pill({ className, children }) {
  return <span className={`inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function FilterGroup({ label, value, onChange }) {
  const opts = [['all', 'All'], ['low', 'Low'], ['med', 'Med'], ['high', 'High']];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        {opts.map(([v, l], i) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`px-2.5 py-1 text-xs font-medium transition ${i > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''} ${
              value === v
                ? 'bg-amber-500 text-white'
                : 'bg-white text-slate-600 hover:bg-amber-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

// Risk → Control → Policy rollup: each policy, the controls it establishes, and
// the risks (by #, matching the risk table) it mitigates.
function PolicyPlan({ policies }) {
  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Policies mandate the controls that mitigate your risks. Prioritise these — most-impactful first. Each row shows the
        controls the policy establishes and the risks it reduces (numbers match the risk table above).
      </p>
      <div className="mt-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
              <th className="w-1/3 py-2 pr-3 font-semibold">Policy</th>
              <th className="py-2 pr-3 font-semibold">Controls it establishes</th>
              <th className="py-2 font-semibold">Risks mitigated</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 align-top dark:border-slate-800">
                <td className="py-2.5 pr-3">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{p.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{p.desc}</span>
                </td>
                <td className="py-2.5 pr-3">
                  <span className="flex flex-wrap gap-1">
                    {p.covered.map((c) => (
                      <span key={c} className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{CONTROLS[c]}</span>
                    ))}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="flex flex-wrap items-center gap-1">
                    <span className="mr-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{p.mitigates.length}</span>
                    {p.mitigates.map((r) => (
                      <span key={r.num} title={r.label} className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">{r.num}</span>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// A 3×3 likelihood × impact matrix. Cells are coloured by severity and hold the
// numbered markers of the risks that fall in that cell.
function RiskMatrix({ risks }) {
  const IMPACTS = ['high', 'med', 'low']; // top → bottom
  const LIKS = ['low', 'med', 'high']; // left → right
  const at = (imp, lik) => risks.filter((r) => r.impact === imp && r.likelihood === lik);
  const sevOf = (lik, imp) => severity({ likelihood: lik, impact: imp });
  return (
    <div className="mt-4">
      <div className="flex gap-1">
        <div className="flex w-5 items-center justify-center">
          <span className="rotate-180 text-[10px] font-semibold uppercase tracking-wide text-slate-400 [writing-mode:vertical-rl]">Impact →</span>
        </div>
        <div className="min-w-0 flex-1">
          {IMPACTS.map((imp) => (
            <div key={imp} className="flex items-stretch gap-1">
              <div className="flex w-11 items-center justify-end pr-1 text-[10px] font-medium text-slate-400">{DL[imp]}</div>
              {LIKS.map((lik) => {
                const cs = SEV[sevOf(lik, imp)];
                const items = at(imp, lik);
                return (
                  <div key={lik} className={`mb-1 flex min-h-[3.25rem] flex-1 flex-wrap content-start gap-1 rounded p-1 ${cs.cell}`}>
                    {items.map((r) => (
                      <span key={r.num} title={r.label} className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] font-bold text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-100">
                        {r.num}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="flex gap-1">
            <div className="w-11" />
            {LIKS.map((lik) => (
              <div key={lik} className="flex-1 text-center text-[10px] font-medium text-slate-400">{DL[lik]}</div>
            ))}
          </div>
          <p className="mt-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">Likelihood →</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        {['low', 'med', 'high'].map((s) => (
          <span key={s} className="flex items-center gap-1"><span className={`h-3 w-3 rounded-sm ${SEV[s].swatch}`} /> {SEV[s].label}</span>
        ))}
      </div>
    </div>
  );
}

function CardList({ sub, list, checked, onToggleAction }) {
  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">{sub}</p>
      <div className="mt-4 space-y-4">
        {list.map(({ item, reason }) => (
          <ResultCard key={item.instrumentId} item={item} reason={reason} checked={checked} onToggleAction={onToggleAction} collapsible />
        ))}
      </div>
    </>
  );
}

function BaselineList({ baseline }) {
  return (
    <>
      <p className="text-sm text-slate-500 dark:text-slate-400">Your jurisdiction may not have a dedicated law yet — but most regimes converge on these. Meeting them is the safest starting point.</p>
      <ul className="mt-3 space-y-2">
        {baseline.map((b, i) => (
          <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-slate-100">{b.label}</strong>
            {b.eg && <span className="text-slate-400"> — e.g. {b.eg}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}

function ResultCard({ item, reason, checked, onToggleAction, collapsible }) {
  const lessonSlug = lessonSlugFor(item);
  const badge = (
    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${TIER_CLASS[item.bindingness]}`}>{item.status}</span>
  );
  const body = <ResultCardBody item={item} reason={reason} checked={checked} onToggleAction={onToggleAction} lessonSlug={lessonSlug} />;

  if (collapsible) {
    return (
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
            <span className="flex items-start gap-2">
              <span className="mt-0.5 text-slate-400 transition-transform group-open:rotate-90">▶</span>
              <span>
                <span className="block font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                <span className="block text-xs text-slate-400">{item.full}</span>
              </span>
            </span>
            {badge}
          </summary>
          <div className="px-5 pb-5">{body}</div>
        </details>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
        {badge}
      </div>
      <p className="mt-0.5 text-xs text-slate-400">{item.full}</p>
      {body}
    </article>
  );
}

function ResultCardBody({ item, reason, checked, onToggleAction, lessonSlug }) {
  return (
    <>
      <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">{reason}</p>

      <details open className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">What it requires of you</summary>
        <ul className="mt-2 space-y-1.5 pl-4">
          {item.obligations.map((o, i) => (
            <li key={i} className="list-disc text-sm text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">{o.title}.</strong> {o.detail}
              {o.appliesWhen && <span className="text-slate-400 italic"> ({o.appliesWhen})</span>}
            </li>
          ))}
        </ul>
      </details>

      <details open className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300">Your next best actions</summary>
        <ul className="mt-2 space-y-2">
          {item.nextActions.map((n) => {
            const on = Boolean(checked[`${item.instrumentId}:${n.id}`]);
            return (
              <li key={n.id}>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={on} onChange={() => onToggleAction(item.instrumentId, n.id)} className="mt-0.5 accent-emerald-500" />
                  <span className={on ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}>
                    <strong className="font-medium text-slate-900 dark:text-slate-100">{n.action}</strong>{' '}
                    <span className="rounded-full border border-slate-300 px-1.5 text-[11px] text-slate-500 dark:border-slate-600 dark:text-slate-400">{n.owner}</span>
                    <br />
                    <span className="text-xs italic text-slate-400">{n.placeholder}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </details>

      {item.keyDates && item.keyDates.length > 0 && (
        <ul className="mt-3 space-y-0.5">
          {item.keyDates.map((k, i) => (
            <li key={i} className="text-xs text-slate-400"><strong className="text-slate-500 dark:text-slate-400">{k.date}</strong> — {k.label}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <a href={item.url} target="_blank" rel="noopener" className="font-medium text-sky-600 hover:underline dark:text-sky-400">Official source ↗</a>
        <a href={`/lesson/${lessonSlug}`} className="font-medium text-amber-600 hover:underline dark:text-amber-400">↳ Learn the concept</a>
      </div>
    </>
  );
}

// ── pure helpers ─────────────────────────────────────────────────────────────
function hasAny(a) {
  return Boolean(a.jurisdictions.length || a.sectors.length || a.dataTypes.length || a.activities.length);
}

function computeModel(a) {
  const binding = [];
  const recommended = [];
  const watch = [];
  items.forEach((item) => {
    const m = matchItem(item, a);
    if (!m.ok) return;
    const entry = { item, reason: reasonFor(item, m.hits) };
    if (item.bindingness === 'binding') binding.push(entry);
    else if (item.bindingness === 'recommended') recommended.push(entry);
    else watch.push(entry);
  });
  const showBaseline = a.jurisdictions.includes('other') || binding.length === 0;
  const baseline = baselineTraits([
    ...binding.map((e) => e.item),
    ...recommended.map((e) => e.item),
    ...items.filter((i) => i.bindingness === 'recommended'),
  ]);
  return { binding, recommended, watch, showBaseline, baseline, risk: dataRiskProfile(a) };
}

function describeAnswers(a) {
  const seg = (arr, map) => arr.map((v) => map[v]).filter(Boolean).join(', ');
  const parts = [];
  if (a.jurisdictions.length) parts.push(seg(a.jurisdictions, phrases.jurisdictions));
  if (a.sectors.length) parts.push(seg(a.sectors, phrases.sectors));
  if (a.dataTypes.length) parts.push(seg(a.dataTypes, phrases.dataTypes));
  if (a.activities.length) parts.push(seg(a.activities, phrases.activities));
  parts.push(phrases.roles[a.role]);
  return parts.filter(Boolean).join(' · ');
}

// ── Markdown export ──────────────────────────────────────────────────────────
function buildMarkdown(model, a, checked) {
  const L = [];
  L.push('# DRC applicability report');
  L.push(`_Generated ${new Date().toISOString().slice(0, 10)} · educational guidance, not legal advice_`, '');
  L.push('## Your product', ...describeAnswers(a).split(' · ').map((p) => `- ${p}`), '');

  if (model.risk.length) {
    L.push('## Your data-risk profile');
    L.push('_Rated by likelihood × impact (L / I)._', '');
    model.risk.forEach((f) => {
      L.push(`- **${f.num}. ${f.label}** — _${severity(f)} risk · L:${f.likelihood} I:${f.impact}_. ${f.detail}`);
      if (f.controls?.length) L.push(`  - Controls: ${f.controls.map((c) => CONTROLS[c]).join('; ')}`);
    });
    L.push('');

    const policies = policyPlan(model.risk);
    if (policies.length) {
      L.push('## Policies to implement', '_Policies mandate the controls that mitigate your risks (most-impactful first)._', '');
      policies.forEach((p) => {
        L.push(`### ${p.name}`, p.desc, '');
        L.push(`- Controls established: ${p.covered.map((c) => CONTROLS[c]).join('; ')}`);
        L.push(`- Risks mitigated: ${p.mitigates.map((r) => `#${r.num} ${r.label}`).join('; ')}`, '');
      });
    }
  }

  const section = (title, list) => {
    if (!list.length) return;
    L.push(`## ${title}`);
    list.forEach(({ item, reason }) => {
      L.push(`### ${item.name} — ${item.status}`, reason, '', '**Requires:**');
      item.obligations.forEach((o) => L.push(`- **${o.title}.** ${o.detail}${o.appliesWhen ? ` _(${o.appliesWhen})_` : ''}`));
      L.push('', '**Next best actions:**');
      item.nextActions.forEach((n) => L.push(`- [${checked[`${item.instrumentId}:${n.id}`] ? 'x' : ' '}] ${n.action} — _${n.placeholder}_ (${n.owner})`));
      if (item.keyDates?.length) { L.push('', '**Key dates:**'); item.keyDates.forEach((k) => L.push(`- ${k.date} — ${k.label}`)); }
      L.push('', `Source: ${item.url}`, '');
    });
  };
  section('✅ Applies to you', model.binding);
  section('📋 Recommended good practice', model.recommended);
  section('👀 Worth watching', model.watch);

  if (model.showBaseline && model.baseline.length) {
    L.push('## 🌐 Baseline expectations for any jurisdiction');
    model.baseline.forEach((b) => L.push(`- **${b.label}**${b.eg ? ` — e.g. ${b.eg}` : ''}`));
    L.push('');
  }
  L.push('---', '_Built with the DRCDrivers Navigator. Verify every item against its official source and qualified counsel._');
  return L.join('\n');
}

// Expand every collapsed <details> in the report so nothing is hidden on paper.
function printReport() {
  document.querySelectorAll('#nav-report details').forEach((d) => { d.open = true; });
  window.print();
}

function downloadMarkdown(model, a, checked) {
  const blob = new Blob([buildMarkdown(model, a, checked)], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'drc-applicability-report.md';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
