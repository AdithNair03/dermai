import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ChevronRight, HelpCircle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const ANSWER_OPTIONS = [
  { value: 2, label: 'Yes',    color: 'green' },
  { value: 1, label: 'Unsure', color: 'amber' },
  { value: 0, label: 'No',     color: 'slate' },
]

const answerStyles = {
  green: { active: 'bg-green-500/20 border-green-400 text-green-300', inactive: 'border-slate-700 text-slate-400 hover:border-green-500/40' },
  amber: { active: 'bg-amber-500/20 border-amber-400 text-amber-300', inactive: 'border-slate-700 text-slate-400 hover:border-amber-500/40' },
  slate: { active: 'bg-slate-600/40 border-slate-400 text-slate-300', inactive: 'border-slate-700 text-slate-400 hover:border-slate-500' },
}

export default function QuestionModal({ questions, conditionName, onSubmit, onSkip }) {
  const [answers, setAnswers]       = useState({})
  const [currentIdx, setCurrentIdx] = useState(0)

  const current  = questions[currentIdx]
  const progress = (currentIdx / questions.length) * 100
  const isLast   = currentIdx === questions.length - 1

  const handleNext = () => {
    if (answers[current.id] === undefined) return
    if (isLast) onSubmit(answers)
    else setCurrentIdx(i => i + 1)
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
            <MessageSquare size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Symptom Questionnaire</p>
            <p className="text-xs text-slate-500">Focused on <span className="text-purple-400">{conditionName}</span></p>
          </div>
        </div>
        <span className="text-xs text-slate-500 shrink-0 mt-1">{currentIdx + 1} / {questions.length}</span>
      </div>

      <div className="h-1 bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          animate={{ width: `${progress + (100 / questions.length)}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {current.hint && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/8 border border-blue-500/15 mb-4">
                <HelpCircle size={13} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300/80 leading-relaxed">{current.hint}</p>
              </div>
            )}
            <p className="text-base text-slate-100 font-medium leading-relaxed mb-5">{current.text}</p>
            <div className="grid grid-cols-3 gap-3">
              {ANSWER_OPTIONS.map(({ value, label, color }) => {
                const isSelected = answers[current.id] === value
                const styles = answerStyles[color]
                return (
                  <button
                    key={value}
                    onClick={() => setAnswers(prev => ({ ...prev, [current.id]: value }))}
                    className={clsx(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all',
                      isSelected ? styles.active : styles.inactive
                    )}
                  >
                    {isSelected && <CheckCircle2 size={14} />}
                    {label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-6 flex items-center justify-between gap-3">
        <button onClick={onSkip} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
          Skip all questions
        </button>
        <div className="flex items-center gap-3">
          {currentIdx > 0 && (
            <button onClick={() => setCurrentIdx(i => i - 1)} className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={answers[current.id] === undefined}
            className={clsx(
              'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all',
              answers[current.id] !== undefined ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            )}
          >
            {isLast ? 'Submit & refine' : 'Next'}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="pb-4 flex justify-center gap-1.5">
        {questions.map((q, i) => (
          <div key={q.id} className={clsx('h-1.5 rounded-full transition-all',
            i < currentIdx ? 'w-3 bg-blue-500' : i === currentIdx ? 'w-5 bg-blue-400' : 'w-1.5 bg-slate-700'
          )} />
        ))}
      </div>
    </div>
  )
}
