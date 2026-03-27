import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Sparkles, ChevronRight, AlertCircle } from 'lucide-react'

import { useSkinAnalysis }  from '../hooks/useSkinAnalysis'
import ImageUpload          from '../components/ImageUpload'
import QuestionModal        from '../components/QuestionModal'
import ResultsDashboard     from '../components/ResultsDashboard'
import LoadingState         from '../components/LoadingState'

// ── Step indicator ─────────────────────────────────────────
const STEPS = ['Upload', 'Analyze', 'Refine', 'Results']

function StepBar({ current }) {
  const idx = { upload: 0, loading: 1, questions: 2, refining: 2, result: 3 }[current] ?? 0
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={[
              'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300',
              i < idx  ? 'bg-blue-500 border-blue-500 text-white' :
              i === idx ? 'bg-blue-500/20 border-blue-400 text-blue-300' :
                          'bg-slate-900 border-slate-700 text-slate-600',
            ].join(' ')}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={[
              'text-xs font-medium transition-colors',
              i === idx ? 'text-blue-400' : i < idx ? 'text-slate-400' : 'text-slate-600',
            ].join(' ')}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={[
              'flex-1 h-0.5 mb-5 mx-1 rounded-full transition-all duration-500',
              i < idx ? 'bg-blue-500' : 'bg-slate-800',
            ].join(' ')} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Analysis page ──────────────────────────────────────────
export default function Analysis() {
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [uploadErr, setUploadErr] = useState(null)

  const {
    step, result, questions, error,
    analyzeImage, submitAnswers, reset,
  } = useSkinAnalysis()

  const handleImageSelect = useCallback((f) => {
    setFile(f)
    setUploadErr(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }, [])

  const handleAnalyze = () => {
    if (!file) { setUploadErr('Please select an image first.'); return }
    analyzeImage(file)
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setUploadErr(null)
    reset()
  }

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Skin Symptom Analysis</h1>
          <p className="text-slate-400 text-sm">
            Upload a dermoscopic or standard skin image for AI-powered analysis
          </p>
        </div>

        {/* Step bar */}
        <StepBar current={step} />

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 mb-5"
            >
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Layout: left panel + right result ───────────── */}
        <div className={[
          'grid gap-6 transition-all duration-500',
          step === 'result' ? 'md:grid-cols-[360px_1fr]' : 'md:grid-cols-1 max-w-xl mx-auto w-full',
        ].join(' ')}>

          {/* LEFT: Upload panel (always visible except pure loading) */}
          {step !== 'loading' && step !== 'refining' && (
            <div className="space-y-5">
              {/* Image upload card */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-200">Skin Image</p>
                  {step === 'result' && (
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <RotateCcw size={12} />
                      New analysis
                    </button>
                  )}
                </div>

                <ImageUpload
                  onImageSelect={handleImageSelect}
                  imagePreview={preview}
                  error={uploadErr}
                />

                {/* Analyze button — only show when not in result/question steps */}
                {(step === 'upload') && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={!file}
                    className={[
                      'mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all',
                      file
                        ? 'bg-blue-500 hover:bg-blue-400 text-white glow-blue'
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed',
                    ].join(' ')}
                  >
                    <Sparkles size={16} />
                    Analyze Image
                    <ChevronRight size={15} />
                  </motion.button>
                )}
              </div>

              {/* Info cards */}
              {step === 'upload' && (
                <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 space-y-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Analysis pipeline
                  </p>
                  {[
                    ['1', 'Upload', 'Any clear skin image works best'],
                    ['2', 'AI Inference', 'EfficientNet scores 7 conditions'],
                    ['3', 'Adaptive Q&A', 'Only triggered on low confidence'],
                    ['4', 'Refined Result', 'Rule-adjusted final prediction'],
                  ].map(([num, title, sub]) => (
                    <div key={num} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {num}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-300">{title}</p>
                        <p className="text-xs text-slate-500">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Re-analyze button while showing results */}
              {step === 'result' && file && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-blue-500/40 hover:text-blue-300 transition-all"
                >
                  <RotateCcw size={14} />
                  Re-analyze this image
                </motion.button>
              )}
            </div>
          )}

          {/* RIGHT / CENTER: Dynamic content panel */}
          <div>
            <AnimatePresence mode="wait">
              {/* Loading */}
              {(step === 'loading' || step === 'refining') && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6"
                >
                  <LoadingState
                    message={step === 'refining' ? 'Refining prediction…' : 'Analyzing image…'}
                  />
                </motion.div>
              )}

              {/* Adaptive Q&A */}
              {step === 'questions' && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Low confidence notice */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                    <AlertCircle size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-300">
                        Low confidence — additional information needed
                      </p>
                      <p className="text-xs text-amber-400/70 mt-0.5">
                        Initial: <strong>{result?.top_condition_name}</strong> at{' '}
                        <strong>{Math.round((result?.confidence ?? 0) * 100)}%</strong>.
                        Answer a few questions to refine this result.
                      </p>
                    </div>
                  </div>

                  <QuestionModal
                    questions={questions}
                    conditionName={result?.top_condition_name}
                    onSubmit={submitAnswers}
                    onSkip={() => {
                      // Show initial result without refinement
                      reset()
                      // Manually push to result step using the stored result
                      analyzeImage(file)
                    }}
                  />
                </motion.div>
              )}

              {/* Results dashboard */}
              {step === 'result' && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ResultsDashboard
                    result={result}
                    isRefined={!!result.isRefined}
                  />
                </motion.div>
              )}

              {/* Empty state */}
              {step === 'upload' && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden md:flex flex-col items-center justify-center h-full min-h-[300px] rounded-2xl border border-dashed border-slate-800 text-center p-10"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mb-4">
                    <Sparkles size={22} className="text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm">
                    Your analysis results will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}
