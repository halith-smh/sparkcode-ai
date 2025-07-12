import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from '@heroui/react'
import { AppProvider } from './context/AppContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <HeroUIProvider>
        <main className="dark text-foreground bg-background">
            <Toaster/>
            <AppProvider>
                <App />
            </AppProvider>
        </main>
    </HeroUIProvider>
)
