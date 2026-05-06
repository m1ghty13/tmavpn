import { useState, useEffect } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { KeysScreen } from './screens/KeysScreen'
import { TariffsScreen } from './screens/TariffsScreen'
import { ReferralScreen } from './screens/ReferralScreen'
import { BottomNav } from './components/BottomNav'
import { api, InitData } from './api'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [data, setData] = useState<InitData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    api.init()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-white text-lg font-semibold">Не удалось загрузить</p>
          <p className="text-[#888888] text-sm">{error || 'Попробуйте позже'}</p>
          <button
            onClick={load}
            className="px-6 py-2 bg-[#22C55E] text-white rounded-xl text-sm font-medium"
          >
            Повторить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="h-[100dvh] overflow-y-auto pb-16">
        {activeTab === 'home' && (
          <HomeScreen user={data.user} onTabChange={setActiveTab} />
        )}
        {activeTab === 'keys' && (
          <KeysScreen initialKeys={data.keys} maxDevices={data.user.max_devices} onRefresh={load} />
        )}
        {activeTab === 'tariffs' && (
          <TariffsScreen tariffs={data.tariffs} onRefresh={load} />
        )}
        {activeTab === 'referral' && (
          <ReferralScreen referral={data.referral} />
        )}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
