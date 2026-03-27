import { motion } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts'
import {
  AlertTriangle, CheckCircle, ShieldAlert,
  Activity, Info, TrendingUp, ShieldCheck,
} from 'lucide-react'
import clsx from 'clsx'

// ── Preventive measures per condition ─────────────────────
const PREVENTIVE_MEASURES = {
  nv: [
    "Examine this mole monthly using the ABCDE rule — Asymmetry, Border, Color, Diameter, Evolution.",
    "Apply SPF 30+ broad-spectrum sunscreen every day, even on cloudy days.",
    "Avoid direct sun exposure between 10am and 4pm — peak UV hours.",
    "Wear protective clothing, UV-blocking sunglasses, and wide-brimmed hats outdoors.",
    "Visit a dermatologist annually for a professional full-body skin check.",
    "Never use tanning beds or sunlamps — UV radiation increases mole risk.",
  ],
  mel: [
    "See a dermatologist IMMEDIATELY — melanoma requires urgent professional evaluation.",
    "Avoid all sun exposure on the affected area until it has been examined.",
    "Do NOT scratch, pick, or try to treat the lesion yourself in any way.",
    "Apply broad-spectrum SPF 50+ sunscreen on all exposed skin every single day.",
    "Inform your doctor about any family history of melanoma or skin cancer.",
    "Schedule a full-body skin examination — melanoma can spread to other sites.",
  ],
  bkl: [
    "These lesions are generally harmless — monitor monthly for sudden changes in size or color.",
    "Avoid picking or scratching the lesion surface to prevent infection or scarring.",
    "Keep the area moisturized with a fragrance-free, gentle lotion daily.",
    "Apply SPF 30+ sunscreen daily — UV exposure worsens pigmentation over time.",
    "See a dermatologist promptly if the lesion bleeds, grows rapidly, or changes color.",
    "Annual dermatologist skin check is recommended, especially for people over 40.",
  ],
  bcc: [
    "Consult a dermatologist soon — basal cell carcinoma is highly treatable when caught early.",
    "Avoid all sun exposure on the affected area until evaluated by a doctor.",
    "Apply SPF 50+ sunscreen and reapply every 2 hours when outdoors.",
    "Wear UPF 50+ sun-protective clothing and a wide-brimmed hat every day outdoors.",
    "Never skip follow-up appointments after treatment — recurrence is common.",
    "Inspect all sun-exposed areas of your body monthly for any new growths or sores.",
  ],
  akiec: [
    "See a dermatologist promptly — actinic keratoses can progress to skin cancer if untreated.",
    "Apply SPF 50+ broad-spectrum sunscreen every single day without exception.",
    "Wear sun-protective UPF 50+ clothing when spending any time outdoors.",
    "Strictly avoid peak sun hours between 10am and 4pm.",
    "Do not pick or scratch the rough patch — it can become infected or worsen.",
    "Ask your dermatologist about prescription treatment creams such as imiquimod or fluorouracil.",
  ],
  vasc: [
    "Monitor the lesion every month — note any changes in size, color, or texture.",
    "Avoid trauma, pressure, or injury to the affected area in daily activities.",
    "Do NOT squeeze, puncture, or attempt to drain the lesion yourself.",
    "If the lesion bleeds spontaneously, apply gentle pressure and visit a doctor immediately.",
    "Inform your dermatologist if it grows rapidly, changes suddenly, or becomes painful.",
    "Routine annual skin check with a dermatologist is sufficient for stable vascular lesions.",
  ],
  df: [
    "Dermatofibromas are benign — no urgent treatment is needed in most cases.",
    "Avoid shaving directly over the lesion to prevent irritation or accidental cutting.",
    "If it becomes painful, tender, or grows rapidly, consult a dermatologist promptly.",
    "Keep the surrounding skin clean and moisturized to prevent dryness and irritation.",
    "Do not try to remove it yourself — home removal causes scarring and infection risk.",
    "Annual monitoring with a dermatologist is recommended to track any changes over time.",
  ],
}

// ── Risk config ────────────────────────────────────────────
const RISK_CONFIG = {
  high:   { icon: ShieldAlert,   color: 'red',   label: 'High Risk' },
  medium: { icon: AlertTriangle, color: 'amber',  label: 'Medium Risk' },
  low:    { icon: CheckCircle,   color: 'green',  label: 'Low Risk' },
}

const riskBadge = {
  high:   'bg-red-500/15 border-red-500/30 text-red-400',
  medium: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  low:    'bg-green-500/15 border-green-500/30 text-green-400',
}

const riskBar = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

const CONDITION_RISK = {
  nv: 'low', mel: 'high', bkl: 'low',
  bcc: 'high', akiec: 'medium', vasc: 'low', df: 'low',
}

// ── Custom tooltip ─────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-300 font-medium">{d.payload.fullName}</p>
      <p className="text-sm font-bold text-white">{(d.value * 100).toFixed(1)}%</p>
    </div>
  )
}

// ── Confidence ring ────────────────────────────────────────
function ConfidenceRing({ value, risk }) {
  const pct    = Math.round(value * 100)
  const radius = 44
  const circ   = 2 * Math.PI * radius
  const offset = circ * (1 - value)
  const color  = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }[risk] ?? '#60a5fa'

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="10" />
      <motion.circle
        cx="60" cy="60" r={radius}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
      />
      <text x="60" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Inter">
        {pct}%
      </text>
      <text x="60" y="72" textAnchor="middle" fill="rgb(148,163,184)" fontSize="10" fontFamily="Inter">
        confidence
      </text>
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────
export default function ResultsDashboard({ result, isRefined = false }) {
  const {
    top_condition, top_condition_name, confidence,
    risk_level, description, predictions, top3,
  } = result

  const riskCfg = RISK_CONFIG[risk_level] ?? RISK_CONFIG.low
  const RiskIcon = riskCfg.icon

  const barData = Object.entries(predictions || {})
    .map(([code, d]) => ({
      code:     code.toUpperCase(),
      fullName: d.name ?? code,
      value:    d.probability,
      risk:     d.risk ?? CONDITION_RISK[code] ?? 'low',
    }))
    .sort((a, b) => b.value - a.value)

  const radarData = barData.slice(0, 5).map(d => ({
    condition: d.code,
    value:     +(d.value * 100).toFixed(1),
  }))

  const measures = PREVENTIVE_MEASURES[top_condition] || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Refined badge */}
      {isRefined && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <TrendingUp size={14} className="text-purple-400" />
          <p className="text-sm text-purple-300 font-medium">
            Prediction refined using your symptom answers
          </p>
        </div>
      )}

      {/* Primary result card */}
      <div className={clsx(
        'rounded-2xl border p-6',
        risk_level === 'high'   ? 'bg-red-950/20 border-red-500/25 glow-red' :
        risk_level === 'medium' ? 'bg-amber-950/20 border-amber-500/25' :
        'bg-green-950/15 border-green-500/20 glow-green'
      )}>
        <div className="flex items-start gap-5 flex-wrap">
          <ConfidenceRing value={confidence} risk={risk_level} />
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                riskBadge[risk_level]
              )}>
                <RiskIcon size={12} />
                {riskCfg.label}
              </span>
              {isRefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Activity size={10} />
                  Refined
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1 leading-tight">
              {top_condition_name}
            </h2>
            <p className="text-xs font-mono text-slate-500 mb-3">
              Condition code: <span className="text-slate-400">{top_condition?.toUpperCase()}</span>
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Top 3 cards */}
      {top3?.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">
            Top predictions
          </p>
          <div className="grid grid-cols-3 gap-3">
            {top3.map((item, i) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={clsx(
                  'p-4 rounded-xl border transition-all',
                  i === 0 ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-900/60 border-slate-800'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-500">#{i + 1}</span>
                  <span className={clsx('text-xs px-1.5 py-0.5 rounded border', riskBadge[item.risk ?? 'low'])}>
                    {item.risk}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 mb-1 leading-tight">{item.name}</p>
                <p className="text-lg font-bold text-white">{(item.probability * 100).toFixed(1)}%</p>
                <div className="h-1 rounded-full bg-slate-700 mt-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: riskBar[item.risk ?? 'low'] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.probability * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Bar chart */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">
          Probability distribution — all conditions
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" domain={[0, 1]}
              tickFormatter={v => `${Math.round(v * 100)}%`}
              tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="code"
              tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
              {barData.map((entry) => (
                <Cell key={entry.code} fill={riskBar[entry.risk]}
                  opacity={entry.code === top_condition?.toUpperCase() ? 1 : 0.45} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar chart */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
          Top-5 radar view
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(148,163,184,0.1)" />
            <PolarAngleAxis dataKey="condition" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }} tickCount={4} />
            <Radar dataKey="value" stroke="#60a5fa" fill="#60a5fa"
              fillOpacity={0.2} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Preventive Measures ── */}
      {measures.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
              <ShieldCheck size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Preventive measures
              </p>
              <p className="text-xs text-slate-500">
                Specific to {top_condition_name}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {measures.map((measure, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{measure}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex gap-2.5 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
        <Info size={15} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/80 leading-relaxed">
          <strong className="text-amber-300">Awareness only.</strong>{' '}
          This prediction is generated by an AI model and is not a medical diagnosis.
          The preventive measures listed are general guidance only.
          Please consult a qualified dermatologist for any skin concerns.
        </p>
      </div>
    </motion.div>
  )
}
