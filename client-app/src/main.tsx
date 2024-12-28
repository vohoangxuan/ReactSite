import React from 'react'
import { createRoot } from 'react-dom/client'

import 'semantic-ui-css/semantic.min.css'
import './app/layout/style.css'
import App from './app/layout/App'


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
