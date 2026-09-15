<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<template>
  <section class="not-found">
    <div class="bg-glow"></div>

    <div class="content">
      <h1 class="code">404</h1>
      <p class="subtitle">页面走丢了</p>
      <p class="desc">你访问的路径不存在，或已被移往他处。</p>
      <button class="btn-back" @click="goHome">返回首页</button>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 60vh;
  background:
    radial-gradient(circle at 20% 20%, var(--accent-bg), transparent 40%),
    radial-gradient(circle at 80% 80%, var(--accent-bg), transparent 40%);
}

/* 背景柔光斑 */
.bg-glow {
  position: absolute;
  width: 60vmin;
  height: 60vmin;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-border), transparent 60%);
  filter: blur(60px);
  opacity: 0.5;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translate(-10%, -10%); }
  50% { transform: translate(10%, 10%); }
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 32px 20px;
}

/* 发光数字 404 */
.code {
  font-size: clamp(96px, 18vw, 200px);
  line-height: 1;
  margin: 0;
  font-weight: 700;
  letter-spacing: -4px;
  color: var(--accent);
  text-shadow:
    0 0 20px var(--accent-border),
    0 0 40px var(--accent-border),
    0 0 80px var(--accent-border);
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}

.subtitle {
  margin-top: 12px;
  font-size: 22px;
  color: var(--text-h);
  font-weight: 500;
}

.desc {
  margin-top: 8px;
  color: var(--text);
  font-size: 15px;
}

.btn-back {
  margin-top: 24px;
  padding: 10px 28px;
  border: 1px solid var(--accent-border);
  border-radius: 8px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 15px;
  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.15s ease;
}

.btn-back:hover {
  box-shadow: 0 0 16px var(--accent-border);
  transform: translateY(-1px);
}

.btn-back:active {
  transform: translateY(0);
}
</style>
