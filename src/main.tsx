import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './views/App'
import { AppProviders } from './providers/AppProviders'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
) 