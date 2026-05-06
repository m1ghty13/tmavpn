import { Home, Key, CreditCard, Users } from 'lucide-react'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'keys', label: 'Ключи', icon: Key },
  { id: 'tariffs', label: 'Тарифы', icon: CreditCard },
  { id: 'referral', label: 'Реферал', icon: Users },
]

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#2a2a2a]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-4 h-16">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center justify-center gap-1"
            >
              <Icon className={`w-5 h-5 ${active ? 'text-[#22C55E]' : 'text-[#888888]'}`} />
              <span className={`text-[10px] ${active ? 'text-[#22C55E]' : 'text-[#888888]'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
