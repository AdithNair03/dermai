import { useState } from 'react'
import axios from 'axios'

const BASE = 'https://dermai-backend-jrje.onrender.com/api'

export function useSkinAnalysis() {
  const [state, setState] = useState({
    step:      'upload',
    result:    null,
    questions: [],
    error:     null,
  })

  const analyzeImage = async (file) => {
    setState(s => ({ ...s, step: 'loading', error: null }))
    const form = new FormData()
    form.append('file', file)
    try {
      const { data } = await axios.post(`${BASE}/predict`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (data.needs_questions) {
        const { data: qData } = await axios.get(`${BASE}/questions/${data.top_condition}`)
        setState(s => ({ ...s, step: 'questions', result: data, questions: qData.questions }))
      } else {
        setState(s => ({ ...s, step: 'result', result: data }))
      }
    } catch (err) {
      const msg = err.response?.data?.detail ?? 'Could not connect to the backend. Is the FastAPI server running?'
      setState(s => ({ ...s, step: 'upload', error: msg }))
    }
  }

  const submitAnswers = async (answers) => {
    setState(s => ({ ...s, step: 'refining' }))
    const { result } = state
    const initial_predictions = Object.fromEntries(
      Object.entries(result.predictions).map(([code, d]) => [code, d.probability])
    )
    try {
      const { data } = await axios.post(`${BASE}/refine`, {
        initial_predictions,
        top_condition: result.top_condition,
        answers,
      })
      setState(s => ({
        ...s,
        step:   'result',
        result: { ...s.result, ...data, predictions: data.refined_predictions, isRefined: true },
      }))
    } catch (err) {
      setState(s => ({ ...s, step: 'result', result: { ...s.result, isRefined: false } }))
    }
  }

  const reset = () => setState({ step: 'upload', result: null, questions: [], error: null })

  return { ...state, analyzeImage, submitAnswers, reset }
}
