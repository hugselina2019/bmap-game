import { reactive } from 'vue'

// 全局共享的 toast 状态
const state = reactive({
  list: []
})

let seed = 0

/**
 * 显示 toast 提示
 * @param {string} message - 提示文案
 * @param {object} options - { type?: 'success'|'error'|'info', duration?: number }
 */
function showToast(message, options = {}) {
  const { type = 'info', duration = 2500 } = options
  const id = ++seed
  state.list.push({ id, message, type })
  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration)
  }
  return id
}

function dismissToast(id) {
  const idx = state.list.findIndex(t => t.id === id)
  if (idx > -1) state.list.splice(idx, 1)
}

export function useToast() {
  return { state, showToast, dismissToast }
}
