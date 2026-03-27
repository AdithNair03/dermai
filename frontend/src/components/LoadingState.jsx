import { motion } from 'framer-motion'
import { Brain, Cpu, Layers } from 'lucide-react'

const steps = [
  { icon: Cpu,    label: 'Preprocessing image',  sub: 'Resize → 224×224, normalize pixels' },
  { icon: Brain,  label: 'Running EfficientNet', sub: 'Extracting feature maps' },
  { icon: Layers, label: 'Computing softmax',    sub: 'Generating probability scores' },
]

export default function LoadingState({ message = 'Analyzing…' }) {
  return (
    <div className="py-10 flex flex-col items-center gap-8">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl"
        />
        <div className="relative w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Brain size={32} className="text-blue-400" />
          </motion.div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-white mb-1">{message}</p>
        <p className="text-sm text-slate-500">This may take a few seconds</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {steps.map(({ icon: Icon, label, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.5 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Icon size={14} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{label}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.5 }}
              className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
            />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-sm h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '40%' }}
        />
      </div>
    </div>
  )
}
