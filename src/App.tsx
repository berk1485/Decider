import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import EntryScreen from './components/EntryScreen'
import LocationPrompt from './components/LocationPrompt'
import BottomNav from './components/BottomNav'
import DecidePage from './pages/DecidePage'
import LuckPage from './pages/LuckPage'
import FineDiningPage from './pages/FineDiningPage'
import PlayPage from './pages/PlayPage'
import OrderPage from './pages/OrderPage'

function AppContent() {
  const { state } = useApp()

  return (
    <>
      <AnimatePresence>
        {state.showEntry && <EntryScreen />}
        {state.showLocationPrompt && !state.showEntry && <LocationPrompt />}
      </AnimatePresence>

      {!state.showEntry && !state.showLocationPrompt && (
        <>
          <main className="flex-1 overflow-hidden flex flex-col">
            {state.tab === 'decide' && <DecidePage />}
            {state.tab === 'luck' && <LuckPage />}
            {state.tab === 'fine-dining' && <FineDiningPage />}
            {state.tab === 'play' && <PlayPage />}
            {state.tab === 'order' && <OrderPage />}
          </main>
          <BottomNav />
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
