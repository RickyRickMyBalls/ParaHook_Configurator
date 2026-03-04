import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppMain from './app/main.tsx'
import { bootstrapBuildWiring } from './app/bootstrapBuildWiring'

bootstrapBuildWiring()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppMain />
  </StrictMode>,
)
