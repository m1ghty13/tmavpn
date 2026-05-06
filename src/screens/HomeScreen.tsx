import { User, Smartphone, CreditCard, Users, Key } from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import type { InitData } from '../api'

type Props = {
  user: InitData['user']
  onTabChange: (tab: string) => void
}

export function HomeScreen({ user, onTabChange }: Props) {
  const firstName = WebApp.initDataUnsafe?.user?.first_name || user.username || 'Пользователь'
  const sub = user.subscription
  const traffic = user.traffic

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 pt-2">
        <div className="w-12 h-12 rounded-full bg-[#1c1c1c] flex items-center justify-center border border-[#2a2a2a]">
          <User className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-white">Привет, {firstName}!</h1>
      </div>

      {sub ? (
        <div className="bg-[#141414] rounded-2xl p-5 space-y-4 border border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <h2 className="text-lg font-semibold text-white">{sub.tariff_name}</h2>
            </div>
            <span className="px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-sm font-medium">
              Активна
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-[#888888]">Осталось {sub.days_left} дней</p>
            <p className="text-xs text-[#666666]">
              Истекает {new Date(sub.expires_at).toLocaleDateString('ru-RU')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#888888]">Использовано</span>
              <span className="text-white font-medium">
                {traffic.used_gb.toFixed(1)} GB / {traffic.total_gb >= 999 ? '∞' : traffic.total_gb + ' GB'}
              </span>
            </div>
            {traffic.total_gb < 999 && (
              <div className="h-2 bg-[#1c1c1c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#22C55E] rounded-full transition-all"
                  style={{ width: `${Math.min(100, traffic.percent)}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#2a2a2a]">
            <Smartphone className="w-4 h-4 text-[#888888]" />
            <span className="text-sm text-[#888888]">
              Устройства: <span className="text-white">{user.devices_count}/{user.max_devices}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl p-5 border border-[#2a2a2a] space-y-3">
          <p className="text-white font-semibold">Нет активной подписки</p>
          <p className="text-[#888888] text-sm">Выберите тариф для подключения VPN</p>
          <button
            onClick={() => onTabChange('tariffs')}
            className="w-full bg-[#22C55E] text-white rounded-xl py-3 font-semibold text-sm"
          >
            Выбрать тариф
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'keys', icon: Key, label: 'Ключи' },
          { id: 'keys', icon: Smartphone, label: 'Устройства' },
          { id: 'tariffs', icon: CreditCard, label: 'Тарифы' },
          { id: 'referral', icon: Users, label: 'Реферал' },
        ].map(({ id, icon: Icon, label }, i) => (
          <button
            key={i}
            onClick={() => onTabChange(id)}
            className="bg-[#141414] rounded-xl p-4 flex flex-col items-center gap-2 border border-[#2a2a2a] active:bg-[#1c1c1c]"
          >
            <Icon className="w-6 h-6 text-white" />
            <span className="text-sm text-white font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
