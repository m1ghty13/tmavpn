import { useState } from 'react'
import { Check, Star } from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import { api, Tariff } from '../api'

type Props = {
  tariffs: Tariff[]
  onRefresh: () => void
}

export function TariffsScreen({ tariffs, onRefresh }: Props) {
  const [selected, setSelected] = useState<Tariff | null>(null)
  const [paying, setPaying] = useState(false)

  const highlighted = tariffs.find((t) => t.name === 'Стандарт')?.id

  const handlePay = async () => {
    if (!selected) return
    setPaying(true)
    try {
      const { payment_url } = await api.purchase(selected.id)
      WebApp.openLink(payment_url)
      setSelected(null)
      // Refresh after payment confirmation delay
      setTimeout(onRefresh, 12000)
    } catch (e: any) {
      WebApp.showAlert(e.message)
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-semibold text-white">Тарифы</h1>
        <p className="text-sm text-[#888888] mt-1">Выберите подходящий план</p>
      </div>

      <div className="space-y-3">
        {tariffs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            className={`w-full bg-[#141414] rounded-2xl p-5 border ${
              t.id === highlighted ? 'border-[#22C55E]' : 'border-[#2a2a2a]'
            } text-left active:bg-[#1c1c1c]`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {t.name}
                {t.id === highlighted && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{t.price}₽</div>
                <div className="text-xs text-[#888888]">в месяц</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#888888]">
              <span>{t.traffic_gb >= 999 ? 'Unlim' : t.traffic_gb + ' GB'}</span>
              <span>•</span>
              <span>{t.max_devices} уст.</span>
              <span>•</span>
              <span>{t.duration_days} дней</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div className="bg-[#1c1c1c] w-full rounded-t-3xl p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#2a2a2a] rounded-full mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{selected.name}</h2>
              <p className="text-sm text-[#888888]">
                {selected.traffic_gb >= 999 ? 'Безлимитный трафик' : selected.traffic_gb + ' GB'}
              </p>
            </div>
            <div className="space-y-3">
              {[
                `${selected.traffic_gb >= 999 ? 'Безлимитный' : selected.traffic_gb + ' GB'} трафик`,
                `До ${selected.max_devices} устройств`,
                'Высокая скорость',
                'Техподдержка 24/7',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#22C55E] shrink-0" />
                  <span className="text-white">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-[#22C55E] text-white rounded-xl py-4 font-semibold text-lg disabled:opacity-60"
            >
              {paying ? 'Создаём платёж...' : `Оплатить ${selected.price}₽`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
