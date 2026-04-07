import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import ModelDetail from './pages/ModelDetail'
import Compare from './pages/Compare'
import Rankings from './pages/Rankings'
import Discover from './pages/Discover'
import Toast from './components/UI/Toast'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models/:id" element={<ModelDetail />} />
            <Route path="/models/:owner/:name" element={<ModelDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/discover" element={<Discover />} />
          </Routes>
        </AnimatePresence>
      </Layout>
      <Toast />
    </BrowserRouter>
  )
}
