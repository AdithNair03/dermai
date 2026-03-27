import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analysis from './pages/Analysis'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
