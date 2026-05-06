import WebApp from '@twa-dev/sdk'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

function getInitData(): string {
  return WebApp.initData || ''
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/tma${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': getInitData(),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Ошибка запроса')
  }
  return res.json()
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Subscription {
  tariff_name: string
  expires_at: string
  is_active: boolean
  days_left: number
}

export interface Traffic {
  used_gb: number
  total_gb: number
  percent: number
}

export interface VPNKey {
  id: number
  vless_link: string
  device_name: string
  created_at: string
}

export interface Tariff {
  id: number
  name: string
  price: number
  traffic_gb: number
  max_devices: number
  duration_days: number
}

export interface ReferralInfo {
  link: string
  invited_count: number
  bonus_days: number
}

export interface Partner {
  accent_color: string
}

export interface InitData {
  user: {
    id: number
    username: string
    subscription: Subscription | null
    traffic: Traffic
    devices_count: number
    max_devices: number
  }
  keys: VPNKey[]
  tariffs: Tariff[]
  partner: Partner
  referral: ReferralInfo
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  /** Single call on app load — returns everything */
  init: () => req<InitData>('/init', { method: 'POST' }),

  keys: () => req<VPNKey[]>('/keys'),
  addKey: (deviceName: string) =>
    req<VPNKey>('/keys', {
      method: 'POST',
      body: JSON.stringify({ device_name: deviceName }),
    }),
  deleteKey: (id: number) => req<void>(`/keys/${id}`, { method: 'DELETE' }),

  tariffs: () => req<Tariff[]>('/tariffs'),
  purchase: (tariffId: number) =>
    req<{ payment_url: string }>('/purchase', {
      method: 'POST',
      body: JSON.stringify({ tariff_id: tariffId }),
    }),

  referral: () => req<ReferralInfo>('/referral'),
}
