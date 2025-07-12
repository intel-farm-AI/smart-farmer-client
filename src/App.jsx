import './index.css'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages'
import { Contact } from './pages/Contact'
import { ChatWithAI } from './pages/chatwithai'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/try-ai" element={<ChatWithAI />} />
      </Routes>
    </>
  )
}

export default App
