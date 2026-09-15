<script setup>
import { useToast } from '@/composables/useToast'

const { state, dismissToast } = useToast()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in state.list"
        :key="t.id"
        class="toast"
        :class="`toast--${t.type}`"
        @click="dismissToast(t.id)"
      >
        <span class="toast__icon">
          {{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ⓘ' }}
        </span>
        <span class="toast__msg">{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  max-width: 80vw;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(8px);
  border: 1px solid;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 0 12px var(--accent-border);
}

.toast__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
}

.toast__msg {
  flex: 1;
}

/* 三种类型配色 */
.toast--success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.9));
  border-color: rgba(74, 222, 128, 0.5);
}

.toast--error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.9));
  border-color: rgba(248, 113, 113, 0.5);
}

.toast--info {
  background: linear-gradient(135deg, var(--accent), rgba(170, 59, 255, 0.85));
  border-color: var(--accent-border);
}

/* 进出动画 */
.toast-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
