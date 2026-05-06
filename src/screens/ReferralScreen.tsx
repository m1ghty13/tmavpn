import { Copy, Share2 } from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import type { ReferralInfo } from '../api'

type Props = {
  referral: ReferralInfo
}

export function ReferralScreen({ referral }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(referral.link)
    WebApp.showAlert('Ссылка скопирована!')
  }

  const handleShare = () => {
    const text = `Подключи VPN и получи бонусные дни!\n${referral.link}`
    WebApp.openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(referral.link)}&text=${encodeURIComponent(text)}`
    )
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-semibold text-white">Реферальная программа</h1>
        <p className="text-sm text-[#888888] mt-1">Приглашайте друзей и получайте бонусы</p>
      </div>

      <div className="bg-[#141414] rounded-2xl p-4 border border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-[#888888] truncate flex-1">{referral.link}</p>
          <button onClick={handleCopy} className="ml-2 p-2 active:bg-[#1c1c1c] rounded-lg">
            <Copy className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] rounded-xl p-4 border border-[#2a2a2a]">
          <div className="text-2xl font-bold text-white mb-1">{referral.invited_count}</div>
          <div className="text-sm text-[#888888]">друзей приглашено</div>
        </div>
        <div className="bg-[#141414] rounded-xl p-4 border border-[#2a2a2a]">
          <div className="text-2xl font-bold text-[#22C55E] mb-1">+{referral.bonus_days}</div>
          <div className="text-sm text-[#888888]">дней бонус</div>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="w-full bg-[#3B82F6] text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2"
      >
        <Share2 className="w-5 h-5" />
        Поделиться в Telegram
      </button>

      <div className="bg-[#141414] rounded-2xl p-5 border border-[#2a2a2a] space-y-3">
        <h3 className="font-semibold text-white">Как это работает?</h3>
        <div className="space-y-2 text-sm text-[#888888]">
          <p>1. Поделитесь своей ссылкой с друзьями</p>
          <p>2. Когда друг купит подписку, вы оба получите бонусные дни</p>
          <p>3. Бонусные дни суммируются</p>
        </div>
      </div>
    </div>
  )
}
