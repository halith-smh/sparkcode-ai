import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from '@heroui/react'
import { AppProvider } from './context/AppContext'

createRoot(document.getElementById('root')).render(
    <HeroUIProvider>
        <main className="dark text-foreground bg-background">
            <AppProvider>
                <App />
            </AppProvider>
        </main>
    </HeroUIProvider>
)
