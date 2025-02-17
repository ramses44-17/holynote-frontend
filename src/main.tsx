import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient,
  QueryClientProvider,} from "@tanstack/react-query"
  import { Toaster } from "@/components/ui/toaster"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
    <App />
    <Toaster />
    </QueryClientProvider>
  </StrictMode>,
)
