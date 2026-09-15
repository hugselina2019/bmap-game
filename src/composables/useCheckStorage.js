const STORAGE_KEY = 'city-map:checkins'

/**
 * 打卡状态本地存储
 * 存储结构：{ [spotId]: { time: 时间戳 } }
 * 兼容旧版本 { [spotId]: true } 格式
 */
export function loadChecks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function saveChecks(checkMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkMap))
}

export function clearChecks() {
  localStorage.removeItem(STORAGE_KEY)
}
