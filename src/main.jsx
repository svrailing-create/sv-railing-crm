import React from 'react'
import ReactDOM from 'react-dom/client'
import Layout from './components/layout/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import './index.css'

// Direct connection rendering our interface onto the page
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout>
      <Dashboard />
    </Layout>
  </React.StrictMode>,
)
