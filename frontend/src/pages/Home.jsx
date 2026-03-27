import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Brain, MessageSquare, ShieldCheck, Activity, AlertTriangle, Database, Zap } from 'lucide-react'

const features = [
  { icon: Upload,       color: 'blue',   title: 'Image Upload',        desc: 'Drag and drop any skin image. Supports JPEG, PNG, and WebP.' },
  { icon: Brain,        color: 'purple', title: 'EfficientNet Analysis',desc: 'EfficientNetB0 trained on HAM10000 classifies 7 skin conditions.' },
  { icon: MessageSquare,color: 'cyan',   title: 'Adaptive Q&A',        desc: 'When confidence is low, targeted symptom questions refine the result.' },
  { icon: ShieldCheck,  color: 'green',  title: 'Rule-Based Refinement',desc: 'Weighted clinical logic adjusts probability scores from your answers.' },
]

const conditions = [
  { code: 'MEL',   name: 'Melanoma',            risk: 'high' },
  { code: 'BCC',   name: 'Basal Cell Carcinoma', risk: 'high' },
  { code: 'AKIEC', name: 'Actinic Keratoses',    risk: 'medium' },
  { code: 'NV',    name: 'Melanocytic Nevi',      risk: 'low' },
  { code: 'BKL',   name: 'Benign Keratosis',     risk: 'low' },
  { code: 'DF',    name: 'Dermatofibroma',        risk: 'low' },
  { code: 'VASC',  name: 'Vascular Lesions',      risk: 'low' },
]

const riskBadge = {
  high:   'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low:    'text-green-400 bg-green-500/10 border-green-500/20',
}

const featureColor = {
  blue:   'bg-blue-500/15 border-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/15 border-purple-500/20 text-purple-400',
  cyan:   'bg-cyan-500/15 border-cyan-500/20 text-cyan-400',
  green:  'bg-green-500/15 border-green-500/20 text-green-400',
}

export default function Home() {
  return (
    <main className="pt-16">
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <Activity size={12} />
            HAM10000 · EfficientNetB0 · FastAPI + React
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-5 tracking-tight">
            AI-Powered <span className="text-gradient">Skin Symptom</span><br />Analysis System
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Upload a skin image. Our model analyzes it against 7 dermatological conditions from the HAM10000 dataset.
            When confidence is low, adaptive questioning refines the prediction using rule-based clinical logic.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/analysis" className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all glow-blue hover:scale-105">
              Start Analysis
            </Link>
            <a href="#how-it-works" className="px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-medium transition-all">
              How it works
            </a>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-slate-800/60 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Training Images',       value: '10,000+',       icon: Database },
            { label: 'Skin Conditions',        value: '7 Classes',     icon: Activity },
            { label: 'Confidence Threshold',   value: '65%',           icon: Zap },
            { label: 'Model Architecture',     value: 'EfficientNet B0',icon: Brain },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={20} className="text-blue-400 mb-1" />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-slate-400">Four-step pipeline from image to insight</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${featureColor[color]}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">7 Detectable Conditions</h2>
          <p className="text-slate-400">Trained on HAM10000 dermoscopy dataset</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {conditions.map(({ code, name, risk }) => (
            <div key={code} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="text-xs font-mono text-slate-500 mb-1">{code}</div>
              <div className="text-sm font-medium text-slate-200 mb-2">{name}</div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${riskBadge[risk]}`}>
                {risk} risk
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex gap-3 p-5 rounded-2xl bg-amber-500/8 border border-amber-500/20">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300/80 leading-relaxed">
            <strong className="text-amber-300">Medical Disclaimer:</strong> DermAI is an educational awareness tool only.
            It is NOT a substitute for professional medical diagnosis. Always consult a qualified dermatologist for skin concerns.
          </p>
        </div>
      </section>
    </main>
  )
}
