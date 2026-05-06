import { useState } from 'react'
import { Copy, Trash2, Plus, Smartphone } from 'lucide-react'
import WebApp from '@twa-dev/sdk'
import { api, VPNKey } from '../api'

type Props = {
  initialKeys: VPNKey[]
  maxDevices: number
  onRefresh: () => void
}

export function KeysScreen({ initialKeys, maxDevices, onRefresh }: Props) {
  const [keys, setKeys] = useState<VPNKey[]>(initialKeys)
  const [addingDevice, setAddingDevice] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [busy, setBusy] = useState(false)

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link)
    WebApp.showAlert('Ключ скопирован!')
  }

  const handleDelete = (id: number) => {
    WebApp.showConfirm('Удалить этот ключ?', async (ok) => {
      if (!ok) return
      await api.deleteKey(id)
      setKeys((prev) => prev.filter((k) => k.id !== id))
      onRefresh()
    })
  }

  const handleAddDevice = async () => {
    if (!deviceName.trim() || busy) return
    setBusy(true)
    try {
      const newKey = await api.addKey(deviceName.trim())
      setKeys((prev) => [...prev, newKey])
      setDeviceName('')
      setAddingDevice(false)
      onRefresh()
    } catch (e: any) {
      WebApp.showAlert(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-4 space-y-6 pb-28">
      <div>
        <h1 className="text-2xl font-semibold text-white">Мои ключи</h1>
        <p className="text-sm text-[#888888] mt-1">{keys.length} активных устройств</p>
      </div>

      {keys.length === 0 ? (
        <div className="bg-[#141414] rounded-2xl p-6 border border-[#2a2a2a] text-center space-y-2">
          <p className="text-white">Ключей нет</p>
          <p className="text-[#888888] text-sm">Купите тариф, чтобы получить VLESS-ключ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map((item) => (
            <div key={item.id} className="bg-[#141414] rounded-2xl p-4 border border-[#2a2a2a] relative">
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 text-red-500 active:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] flex items-center justify-center border border-[#2a2a2a]">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{item.device_name}</h3>
                  <p className="text-xs text-[#666666]">
                    {new Date(item.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a]">
                <p className="text-xs font-mono text-[#888888] truncate">{item.vless_link}</p>
              </div>

              <button
                onClick={() => handleCopy(item.vless_link)}
                className="w-full px-4 py-2 bg-transparent border border-[#2a2a2a] text-white rounded-xl text-sm font-medium active:bg-[#1c1c1c] flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Копировать
              </button>
            </div>
          ))}
        </div>
      )}

      {addingDevice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setAddingDevice(false)}>
          <div className="bg-[#1c1c1c] w-full rounded-t-3xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[#2a2a2a] rounded-full mx-auto" />
            <h2 className="text-lg font-semibold text-white">Добавить устройство</h2>
            <input
              autoFocus
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Название (iPhone, MacBook...)"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-[#22C55E]"
            />
            <button
              onClick={handleAddDevice}
              disabled={busy}
              className="w-full bg-[#22C55E] text-white rounded-xl py-4 font-semibold disabled:opacity-60"
            >
              {busy ? 'Добавляем...' : 'Добавить'}
            </button>
          </div>
        </div>
      )}

      {keys.length < maxDevices && (
        <button
          onClick={() => setAddingDevice(true)}
          className="fixed bottom-20 left-4 right-4 bg-[#22C55E] text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить устройство
        </button>
      )}
    </div>
  )
}
