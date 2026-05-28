import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout/Layout'

function App() {
  return (
    <Router>
      <AppProvider>
        <Layout />
      </AppProvider>
    </Router>
  )
}

export default App
