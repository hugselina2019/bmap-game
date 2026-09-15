<template>
  <div class="container">
    <!-- 左侧地图区 -->
    <div class="map-wrap">
      <div id="bmap" class="map-box"></div>

      <!-- 定位按钮 -->
      <button class="locate-btn" :class="{ locating: locating }" @click="locateMe()" :title="locating ? '定位中...' : '我的位置'">
        <span class="locate-dot"></span>
      </button>

      <!-- 演示模式徽标 -->
      <div v-if="demoMode" class="demo-badge">DEMO 演示模式</div>

      <!-- 点位详情弹窗 -->
      <div v-if="showPopup" class="popup">
        <div class="popup-content">
          <div class="spot-img-wrap">
            <img :src="currentSpot.img" class="spot-img" />
            <span class="img-tip">图片仅为示意图</span>
          </div>
          <h3>{{ currentSpot.name }}</h3>
          <div class="tag">{{ currentSpot.category }}</div>
          <p>{{ currentSpot.desc }}</p>
          <p class="tip">💡小贴士：{{ currentSpot.tip }}</p>
          <!-- 距离信息 -->
          <div v-if="distToCurrent !== null" class="dist-info">
            <span class="dist-icon">📍</span>
            <span>距您 {{ formatDist(distToCurrent) }}，步行约 {{ walkMinutes(distToCurrent) }} 分钟</span>
            <span v-if="distToCurrent <= 50" class="dist-in-range">可打卡</span>
          </div>
          <div class="btn-row">
            <button v-if="!currentSpot.isCheck" @click="doCheck" class="btn-check">现场打卡</button>
            <button v-if="currentSpot.isCheck" disabled class="btn-checked">✅已打卡</button>
            <button @click="planRoute" class="btn-route">规划路线</button>
          </div>
          <span class="close-btn" title="关闭" @click="showPopup = false"></span>
        </div>
      </div>

      <!-- 图鉴详情卡片 -->
      <div v-if="collectionSpot" class="popup" @click.self="collectionSpot = null">
        <div class="popup-content">
          <template v-if="collectionSpot.isCheck">
            <div class="spot-img-wrap">
              <img :src="collectionSpot.img" class="spot-img" />
              <span class="img-tip">图片仅为示意图</span>
            </div>
            <h3>{{ collectionSpot.name }}</h3>
            <div class="book-cat" :class="catClass(collectionSpot.category)">{{ collectionSpot.category }}</div>
            <p>{{ collectionSpot.desc }}</p>
            <p class="tip">💡小贴士：{{ collectionSpot.tip }}</p>
            <div v-if="collectionSpot.checkTime" class="collect-time">
              🗓 {{ formatDate(collectionSpot.checkTime) }} 点亮
            </div>
          </template>
          <template v-else>
            <div class="collection-locked">
              <img :src="lockIcon" class="lock-big" />
              <h3>{{ collectionSpot.name }}</h3>
              <div class="book-cat" :class="catClass(collectionSpot.category)">{{ collectionSpot.category }}</div>
              <p class="locked-hint">抵达现场完成打卡，解锁人文故事与专属图鉴卡片</p>
            </div>
          </template>
          <div class="btn-row">
            <button class="btn-route" @click="locateFromCollection">定位到此点</button>
          </div>
          <span class="close-btn" title="关闭" @click="collectionSpot = null"></span>
        </div>
      </div>
    </div>

    <!-- 右侧面板 -->
    <aside class="book-panel">
      <!-- ===== 省份视图 ===== -->
      <template v-if="viewLevel === 'province'">
        <header class="book-header">
          <div class="header-row">
            <h2 class="book-title">城市打卡地图</h2>
            <button class="share-btn" @click="sharePoster">分享成就</button>
          </div>
          <p class="book-subtitle">已点亮 {{ totalCheckedCount }}/{{ totalSpotCount }} · 选择省份开始探索</p>
        </header>

        <div class="province-list">
          <div
            v-for="p in provinces"
            :key="p.id"
            class="province-item"
            @click="enterProvince(p)"
          >
            <svg class="province-ring" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(170,59,255,0.15)" stroke-width="4" />
              <circle
                cx="20" cy="20" r="15" fill="none" stroke="#c084fc" stroke-width="4"
                stroke-linecap="round"
                :stroke-dasharray="`${(getProvinceProgress(p.id).pct * C_RING).toFixed(1)} ${C_RING.toFixed(1)}`"
                transform="rotate(-90 20 20)"
              />
              <text x="20" y="24" text-anchor="middle" fill="currentColor" font-size="11" font-weight="600">
                {{ getProvinceProgress(p.id).checked }}
              </text>
            </svg>
            <div class="province-item-main">
              <div class="province-name">{{ p.name }}</div>
              <div class="province-count">{{ getProvinceCheckInfo(p.id) }}</div>
            </div>
            <div class="province-arrow">›</div>
          </div>
        </div>
      </template>

      <!-- ===== 点位视图 ===== -->
      <template v-if="viewLevel === 'spot'">
        <!-- 头部：标题 + 进度 + 返回 -->
        <header class="book-header">
          <div class="header-row">
            <button class="back-btn" @click="backToProvince">‹</button>
            <h2 class="book-title">{{ currentProvinceName }}</h2>
            <button class="clear-btn" @click="clearAllChecks">清除打卡</button>
          </div>
          <div class="book-stats">
            <span class="stats-num">{{ checkedCount }}<i>/{{ spotFiltered.length }}</i></span>
            <span class="stats-label">已点亮</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </header>

        <!-- 筛选工具栏 -->
        <div class="filter-bar">
          <button @click="filterSpot('all')" :class="{ active: filterKey === 'all' }">全部</button>
          <button v-for="c in categoryList" :key="c" @click="filterSpot(c)" :class="{ active: filterKey === c }">{{ c }}</button>
        </div>

        <!-- 演示模式操作条 -->
        <div class="sim-row" :class="{ 'demo-on': demoMode }">
          <div class="sim-row-text">
            <div class="sim-row-title">
              演示模式
              <button
                class="demo-switch"
                :class="{ on: demoMode }"
                :title="demoMode ? '关闭演示模式' : '开启演示模式'"
                @click="toggleDemoMode"
              >
                <span class="demo-switch-knob"></span>
              </button>
            </div>
            <div class="sim-row-desc">
              {{ selectedSpot ? `已选中：${selectedSpot.name}` : '请先在列表中选中点位' }}
            </div>
            <!-- 距离信息 -->
            <div v-if="distToSelected !== null" class="sim-dist">
              📍 距您 {{ formatDist(distToSelected) }}
              <span v-if="distToSelected <= 50" class="dist-in-range">可打卡</span>
            </div>
          </div>

          <!-- 定位状态（右侧） -->
          <div class="loc-inline">
            <span class="loc-dot" :class="{ active: myLocation, locating: locating }"></span>
            <span v-if="locating">定位中</span>
            <span v-else-if="myLocation">已定位</span>
            <span v-else>未定位</span>
            <button v-if="!myLocation && !locating" class="loc-try" @click="locateMe()">定位</button>
          </div>
        </div>

        <!-- 图鉴列表 -->
        <div class="book-list">
          <div
            v-for="s in spotFiltered"
            :key="s.id"
            class="book-item"
            :class="{ checked: s.isCheck, selected: selectedSpot && s.id === selectedSpot.id }"
            @click="openCollection(s)"
          >
            <div class="book-item-main">
              <div class="book-name">{{ s.name }}</div>
              <div class="book-cat" :class="catClass(s.category)">{{ s.category }}</div>
            </div>
            <img
              class="book-status"
              :src="s.isCheck ? unlockIcon : lockIcon"
              :alt="s.isCheck ? '已打卡' : '未解锁'"
            />
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { provinces } from '@/data/provinces'
import { spotsData } from '@/data/spots'
import { useToast } from '@/composables/useToast'
import { loadChecks, saveChecks, clearChecks } from '@/composables/useCheckStorage'
import BMapLoader from '@baidumap/jsapi-loader'
import locationIcon from '@/assets/icons/location2.png'
import lockIcon from '@/assets/icons/lock.png'
import unlockIcon from '@/assets/icons/unlock.png'

let map = null
let markers = []
let routeLayer = []       // 模拟路线覆盖物集合
let routeAnimTimer = null // 路线流动动画定时器
let myLocOverlays = []    // 我的位置覆盖物（蓝色圆点 + 精度圈）

const { showToast } = useToast()

// ===== 视图状态 =====
const viewLevel = ref('province')       // 'province' | 'spot'
const currentProvince = ref(null)        // 当前省份对象
const filterKey = ref('all')
const showPopup = ref(false)
const currentSpot = ref(null)
const selectedSpot = ref(null)

// ===== 用户位置 =====
const myLocation = ref(null)             // { lng, lat } 或 null
const locating = ref(false)              // 正在定位中

// ===== 演示模式 =====
const DEMO_KEY = 'city-map:demo-mode'
const demoMode = ref(localStorage.getItem(DEMO_KEY) === '1')
function toggleDemoMode() {
  demoMode.value = !demoMode.value
  localStorage.setItem(DEMO_KEY, demoMode.value ? '1' : '0')
  showToast(
    demoMode.value ? '演示模式已开启：现场打卡免距离校验' : '演示模式已关闭',
    { type: 'info' }
  )
}

// 深拷贝所有省份数据
const allSpots = ref({})
function initSpotsData() {
  const stored = loadChecks()
  const copy = {}
  for (const [pid, list] of Object.entries(spotsData)) {
    copy[pid] = JSON.parse(JSON.stringify(list)).map(s => ({
      ...s,
      isCheck: Boolean(stored[s.id]),
      checkTime: stored[s.id]?.time ?? null
    }))
  }
  allSpots.value = copy
}
initSpotsData()

// 将所有打卡状态写入 localStorage（含打卡时间）
function persistChecks() {
  const map = {}
  for (const list of Object.values(allSpots.value)) {
    list.forEach(s => {
      if (s.isCheck) map[s.id] = { time: s.checkTime ?? Date.now() }
    })
  }
  saveChecks(map)
}

// 清除所有打卡记录
function clearAllChecks() {
  clearChecks()
  for (const list of Object.values(allSpots.value)) {
    list.forEach(s => {
      s.isCheck = false
      s.checkTime = null
    })
  }
  showToast('已清除所有打卡记录', { type: 'info' })
  if (viewLevel.value === 'spot') renderSpotMarkers()
}

// 全局打卡统计（省份视图使用）
const totalSpotCount = computed(() =>
  Object.values(allSpots.value).reduce((n, l) => n + l.length, 0)
)
const totalCheckedCount = computed(() =>
  Object.values(allSpots.value).reduce((n, l) => n + l.filter(s => s.isCheck).length, 0)
)

// 时间戳 → "2026年9月11日"
function formatDate(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const currentProvinceName = computed(() => currentProvince.value?.name ?? '')

// 当前省份的点位
const currentSpots = computed(() => {
  if (!currentProvince.value) return []
  return allSpots.value[currentProvince.value.id] ?? []
})

// 当前省份的分类列表
const categoryList = computed(() => {
  const cats = new Set(currentSpots.value.map(s => s.category))
  return [...cats]
})

// 过滤后的点位（已打卡的排前面，其余保持原顺序）
const spotFiltered = computed(() => {
  const list = filterKey.value === 'all'
    ? currentSpots.value
    : currentSpots.value.filter(s => s.category === filterKey.value)
  return [...list].sort((a, b) => Number(b.isCheck) - Number(a.isCheck))
})

// 打卡统计
const checkedCount = computed(() => currentSpots.value.filter(s => s.isCheck).length)
const progressPercent = computed(() => {
  if (currentSpots.value.length === 0) return 0
  return Math.round((checkedCount.value / currentSpots.value.length) * 100)
})

// 分类 → 标签配色
const catColorMap = {
  '古建筑': 'cat-arch',
  '古迹': 'cat-relic',
  '城市公园': 'cat-park',
  '非遗': 'cat-heritage',
  '特色老店': 'cat-shop'
}
function catClass(category) {
  return catColorMap[category] ?? 'cat-default'
}

// 省份打卡信息文本
function getProvinceCheckInfo(pid) {
  const list = allSpots.value[pid] ?? []
  const checked = list.filter(s => s.isCheck).length
  return `${checked}/${list.length} 已点亮`
}

// 省份打卡进度（右侧列表进度环使用）
const C_RING = 2 * Math.PI * 15  // 半径 15 的圆周长
function getProvinceProgress(pid) {
  const list = allSpots.value[pid] ?? []
  const checked = list.filter(s => s.isCheck).length
  const total = list.length
  return { checked, total, pct: total ? checked / total : 0 }
}

// ===== 地图初始化 =====
onMounted(() => { initMap() })

function initMap() {
  BMapLoader.load({
    ak: 'oCMiL8R0MA6ldtIynOCrHfhok9XDf8xO',
    version: '4.0'
  }).then((BMap) => {
    map = new BMap.Map('bmap')
    map.centerAndZoom(new BMap.Point(108.55, 34.32), 5.5)  // 中国中心
    map.enableScrollWheelZoom(true)
    renderProvinceMarkers()
    // 自动获取一次用户位置（静默，不弹提示）
    locateMe(true)
  }).catch((e) => {
    console.error(e)
  })
}

// ===== 用户定位 =====
function locateMe(silent = false) {
  if (!map || locating.value) return
  locating.value = true
  const geoloc = new BMapGL.Geolocation()
  geoloc.getCurrentPosition((res) => {
    locating.value = false
    if (geoloc.getStatus() === 0 && res.point) {
      myLocation.value = { lng: res.point.lng, lat: res.point.lat }
      renderMyLocation()
      if (!silent) {
        showToast('📍 定位成功', { type: 'success' })
      }
    } else {
      if (!silent) {
        showToast('定位失败，请检查浏览器定位权限', { type: 'error' })
      }
    }
  })
}

// 在地图上渲染"我的位置"蓝色圆点 + 精度圈
function renderMyLocation() {
  // 清除旧的
  myLocOverlays.forEach(o => map.removeOverlay(o))
  myLocOverlays = []

  if (!myLocation.value) return
  const center = new BMapGL.Point(myLocation.value.lng, myLocation.value.lat)

  // 精度圈（浅蓝半透明）
  const accCircle = new BMapGL.Circle(center, 50, {
    strokeColor: '#3b82f6',
    strokeWeight: 1,
    strokeOpacity: 0.4,
    fillColor: '#3b82f6',
    fillOpacity: 0.08
  })
  map.addOverlay(accCircle)
  myLocOverlays.push(accCircle)

  // 蓝色实心圆点
  const dot = new BMapGL.Circle(center, 8, {
    strokeColor: '#fff',
    strokeWeight: 2,
    fillColor: '#3b82f6',
    fillOpacity: 1
  })
  map.addOverlay(dot)
  myLocOverlays.push(dot)

  // 脉冲光圈动画（3 层依次扩散）
  const pulse1 = new BMapGL.Circle(center, 16, {
    strokeColor: '#3b82f6',
    strokeWeight: 2,
    strokeOpacity: 0.6,
    fillColor: 'transparent',
    fillOpacity: 0
  })
  const pulse2 = new BMapGL.Circle(center, 24, {
    strokeColor: '#3b82f6',
    strokeWeight: 1.5,
    strokeOpacity: 0.3,
    fillColor: 'transparent',
    fillOpacity: 0
  })
  ;[pulse1, pulse2].forEach(p => {
    map.addOverlay(p)
    myLocOverlays.push(p)
  })
  let tick = 0
  const pulseTimer = setInterval(() => {
    tick = (tick + 1) % 60
    const s1 = 16 + tick * 0.5
    const s2 = 24 + tick * 0.4
    const o1 = Math.max(0, 0.6 - tick * 0.01)
    const o2 = Math.max(0, 0.3 - tick * 0.005)
    pulse1.setRadius(s1)
    pulse1.setStrokeOpacity(o1)
    pulse2.setRadius(s2)
    pulse2.setStrokeOpacity(o2)
    if (tick === 0) {
      pulse1.setRadius(16)
      pulse2.setRadius(24)
    }
  }, 50)
  // 存储 timer 以便清理
  myLocOverlays._pulseTimer = pulseTimer
}

// 计算两点间距离（米），优先用地图 API，回退用 Haversine
function calcDistance(lng1, lat1, lng2, lat2) {
  if (map) {
    try {
      return map.getDistance(new BMapGL.Point(lng1, lat1), new BMapGL.Point(lng2, lat2))
    } catch (_) { /* fallthrough */ }
  }
  // Haversine
  const R = 6371000
  const toRad = v => v * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// 格式化距离文字
function formatDist(meters) {
  if (meters < 1000) return `${Math.round(meters)} 米`
  return `${(meters / 1000).toFixed(1)} 公里`
}

// 到选中点位的实时距离
const distToSelected = computed(() => {
  if (!myLocation.value || !selectedSpot.value) return null
  return calcDistance(myLocation.value.lng, myLocation.value.lat, selectedSpot.value.lng, selectedSpot.value.lat)
})

// 到弹窗点位的实时距离
const distToCurrent = computed(() => {
  if (!myLocation.value || !currentSpot.value) return null
  return calcDistance(myLocation.value.lng, myLocation.value.lat, currentSpot.value.lng, currentSpot.value.lat)
})

// 步行时间估算（米 → 分钟，按 80m/min）
function walkMinutes(meters) {
  return Math.max(1, Math.round(meters / 80))
}

// ===== 省份级 marker（SVG 进度环 + 省份名）=====
function renderProvinceMarkers() {
  if (!map) return
  clearMarkers()

  provinces.forEach(p => {
    const list = allSpots.value[p.id] ?? []
    const checked = list.filter(s => s.isCheck).length
    const point = new BMapGL.Point(p.center.lng, p.center.lat)

    // HTML 标签：单行胶囊 = 省份名（已打卡数）
    // 注意：Label 内容渲染在组件作用域之外，样式需全部内联
    const html = `
      <div style="display:flex;align-items:center;padding:6px 16px;border-radius:99px;background:rgba(22,23,29,0.85);border:1px solid rgba(170,59,255,0.5);backdrop-filter:blur(6px);cursor:pointer;font-family:sans-serif;filter:drop-shadow(0 0 8px rgba(170,59,255,0.4))">
        <div style="color:#fff;font-size:13px;font-weight:600;white-space:nowrap">${p.name}（${checked}）</div>
      </div>`

    const label = new BMapGL.Label(html, {
      position: point,
      offset: new BMapGL.Size(-24, -16)
    })
    label.setStyle({
      padding: '0',
      border: 'none',
      background: 'transparent',
      whiteSpace: 'nowrap'
    })
    map.addOverlay(label)
    markers.push(label)
    label.addEventListener('click', () => enterProvince(p))
  })
}

// ===== 点位级 marker =====
function renderSpotMarkers() {
  if (!map) return
  clearMarkers()

  spotFiltered.value.forEach(spot => {
    const point = new BMapGL.Point(spot.lng, spot.lat)
    const size = new BMapGL.Size(32, 32)
    const icon = new BMapGL.Icon(
      new URL(locationIcon, window.location.origin).href,
      size,
      { imageSize: size }
    )
    const marker = new BMapGL.Marker(point, { icon })
    map.addOverlay(marker)
    markers.push(marker)

    // 名称标签
    const label = new BMapGL.Label(spot.name, {
      offset: new BMapGL.Size(-40, -48)
    })
    label.setStyle({
      padding: '2px 8px',
      borderRadius: '6px',
      background: 'rgba(22, 23, 29, 0.75)',
      color: '#fff',
      fontSize: '12px',
      whiteSpace: 'nowrap',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(170, 59, 255, 0.4)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    })
    marker.setLabel(label)

    marker.addEventListener('click', () => {
      currentSpot.value = spot
      selectedSpot.value = spot
      showPopup.value = true
      clearRoute()
    })
  })
}

function clearMarkers() {
  markers.forEach(m => map.removeOverlay(m))
  markers = []
}

// ===== 下钻 / 返回 =====
function enterProvince(p) {
  currentProvince.value = p
  viewLevel.value = 'spot'
  filterKey.value = 'all'
  selectedSpot.value = null

  if (!map) return
  clearRoute()
  const center = new BMapGL.Point(p.center.lng, p.center.lat)
  map.centerAndZoom(center, p.zoom)
  renderSpotMarkers()
}

function backToProvince() {
  viewLevel.value = 'province'
  currentProvince.value = null
  selectedSpot.value = null
  filterKey.value = 'all'
  showPopup.value = false
  if (!map) return
  clearRoute()
  map.centerAndZoom(new BMapGL.Point(108.55, 34.32), 5)
  renderProvinceMarkers()
}

// ===== 筛选变化时重新渲染 marker =====
watch(filterKey, () => {
  if (viewLevel.value === 'spot') renderSpotMarkers()
})

// ===== 点位操作 =====
function selectSpot(spot) {
  selectedSpot.value = spot
  if (!map) return
  const p = new BMapGL.Point(spot.lng, spot.lat)
  map.panTo(p)
}

// ===== 图鉴详情卡片 =====
const collectionSpot = ref(null)
function openCollection(spot) {
  collectionSpot.value = spot
  selectedSpot.value = spot
}
function locateFromCollection() {
  const s = collectionSpot.value
  if (!s) return
  collectionSpot.value = null
  selectSpot(s)
}

// 打卡成功：记录时间 + 粒子动效
function checkInSuccess(spot, msg = '🎉 打卡成功！已点亮该点位') {
  spot.isCheck = true
  spot.checkTime = Date.now()
  persistChecks()
  showToast(msg, { type: 'success' })
  renderSpotMarkers()
  playCheckBurst(spot)
}

function mockCheckIn() {
  if (!selectedSpot.value) return
  checkInSuccess(selectedSpot.value)
}

function doCheck() {
  // 演示模式：跳过距离校验，直接打卡成功
  if (demoMode.value) {
    checkInSuccess(currentSpot.value, '🎉 打卡成功！（演示模式已跳过距离校验）')
    return
  }
  const geoloc = new BMapGL.Geolocation()
  geoloc.getCurrentPosition((res) => {
    const userPoint = res.point
    const targetPoint = new BMapGL.Point(currentSpot.value.lng, currentSpot.value.lat)
    const dist = map.getDistance(userPoint, targetPoint)
    if (dist <= 50) {
      checkInSuccess(currentSpot.value)
    } else {
      showToast(`距离打卡点还有${Math.round(dist)}米，需要抵达现场才能打卡`, { type: 'error' })
    }
  })
}

// ===== 打卡成功粒子动效：点位处紫色光环爆开 =====
function playCheckBurst(spot) {
  if (!map) return
  const point = new BMapGL.Point(spot.lng, spot.lat)
  const rings = [0, 1, 2].map(() => {
    const ring = new BMapGL.Circle(point, 10, {
      strokeColor: '#c084fc',
      strokeWeight: 3,
      strokeOpacity: 0.9,
      fillColor: '#aa3bff',
      fillOpacity: 0.25
    })
    map.addOverlay(ring)
    return ring
  })
  let tick = 0
  const timer = setInterval(() => {
    tick++
    rings.forEach((ring, i) => {
      const t = tick - i * 8   // 三圈依次错开
      if (t < 0) return
      ring.setRadius(10 + t * 6)
      ring.setStrokeOpacity(Math.max(0, 0.9 - t * 0.05))
      ring.setFillOpacity(Math.max(0, 0.25 - t * 0.015))
    })
    if (tick > 26) {
      clearInterval(timer)
      rings.forEach(r => map.removeOverlay(r))
    }
  }, 40)
}

// ===== 路线规划 =====
// 调用百度地图真实步行路线规划，规划失败时回退为弧形模拟路线（大赛演示兜底）
function planRoute() {
  if (!map || !currentSpot.value) return
  clearRoute()

  const spot = currentSpot.value
  const end = new BMapGL.Point(spot.lng, spot.lat)

  // 起点：优先用真实定位，否则地图中心；若距离过近则退回省份中心
  let start
  if (myLocation.value) {
    start = new BMapGL.Point(myLocation.value.lng, myLocation.value.lat)
  } else {
    start = map.getCenter()
  }
  if (map.getDistance(start, end) < 800) {
    const pc = provinces.find(p => p.id === spot.province)
    if (pc) start = new BMapGL.Point(pc.center.lng, pc.center.lat)
  }

  showPopup.value = false
  showToast('🚶 正在规划步行路线...', { type: 'info', duration: 2000 })

  const walking = new BMapGL.WalkingRoute(map, {
    onSearchComplete: (res) => {
      let path = null
      try {
        const plan = res.getPlan(0)
        const route = plan.getRoute(0)
        path = route.getPath()
      } catch (_) {
        path = null
      }
      if (path && path.length >= 2) {
        drawRoute(path, true)
      } else {
        drawRoute(buildMockPath(start, end), false)
      }
    }
  })
  walking.search(start, end)
}

// 绘制霓虹路线（真实路径与模拟路径通用）
function drawRoute(path, isReal) {
  // 底层光晕线 + 上层主线，营造霓虹路线效果
  const glowLine = new BMapGL.Polyline(path, {
    strokeColor: '#aa3bff',
    strokeWeight: 12,
    strokeOpacity: 0.2,
    strokeStyle: 'solid'
  })
  const routeLine = new BMapGL.Polyline(path, {
    strokeColor: '#c084fc',
    strokeWeight: 5,
    strokeOpacity: 0.95,
    strokeStyle: isReal ? 'solid' : 'dashed'
  })

  // 起终点徽标
  const startBadge = makeRouteBadge('起', path[0], '#34d399')
  const endBadge = makeRouteBadge('终', path[path.length - 1], '#f43f5e')

  ;[glowLine, routeLine, startBadge, endBadge].forEach(o => {
    map.addOverlay(o)
    routeLayer.push(o)
  })

  // 流动光点动画
  animateRouteDot(path)

  // 里程与耗时估算（步行约 80m/min）
  let dist = 0
  for (let i = 1; i < path.length; i++) dist += map.getDistance(path[i - 1], path[i])
  const mins = Math.max(1, Math.round(dist / 80))
  const label = isReal ? '真实步行路线' : '模拟路线（真实规划失败兜底）'
  showToast(`🚶 ${label}已生成：全程约 ${(dist / 1000).toFixed(1)} km，步行约 ${mins} 分钟`, { type: 'info', duration: 4000 })
}

// 生成弧形模拟路径（正弦弯曲，模拟街道绕行感）
function buildMockPath(start, end) {
  const SEG = 32
  const path = []
  const dx = end.lng - start.lng
  const dy = end.lat - start.lat
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG
    const bend = Math.sin(t * Math.PI) * 0.35 // 中段弯出弧度
    path.push(new BMapGL.Point(
      start.lng + dx * t + dy * bend * 0.3,
      start.lat + dy * t - dx * bend * 0.3
    ))
  }
  return path
}

// 起/终点圆形徽标
function makeRouteBadge(text, point, color) {
  const label = new BMapGL.Label(text, { position: point, offset: new BMapGL.Size(-12, -12) })
  label.setStyle({
    width: '24px',
    height: '24px',
    lineHeight: '24px',
    textAlign: 'center',
    padding: '0',
    borderRadius: '50%',
    background: color,
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.85)',
    boxShadow: `0 0 10px ${color}`,
    fontFamily: 'sans-serif'
  })
  return label
}

// 沿路线流动的发光点
function animateRouteDot(path) {
  const dot = new BMapGL.Circle(path[0], 50, {
    strokeColor: '#fff',
    strokeWeight: 2,
    fillColor: '#aa3bff',
    fillOpacity: 0.95
  })
  map.addOverlay(dot)
  routeLayer.push(dot)
  let i = 0
  routeAnimTimer = setInterval(() => {
    i = (i + 1) % path.length
    dot.setCenter(path[i])
  }, 50)
}

function clearRoute() {
  if (routeAnimTimer) {
    clearInterval(routeAnimTimer)
    routeAnimTimer = null
  }
  routeLayer.forEach(o => map && map.removeOverlay(o))
  routeLayer = []
}

function filterSpot(key) {
  filterKey.value = key
}

// ===== 分享成就海报（canvas 合成后下载 PNG）=====
async function sharePoster() {
  const total = totalSpotCount.value
  const checked = totalCheckedCount.value
  const rate = total ? Math.round((checked / total) * 100) : 0
  const W = 800
  const H = 1200
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // ---- 深色渐变背景 ----
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#16171d')
  bg.addColorStop(0.5, '#1d1230')
  bg.addColorStop(1, '#16171d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // ---- 背景装饰：紫色光晕 + 星点 ----
  const glow = ctx.createRadialGradient(W / 2, 150, 40, W / 2, 150, 420)
  glow.addColorStop(0, 'rgba(170, 59, 255, 0.35)')
  glow.addColorStop(1, 'rgba(170, 59, 255, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, 520)

  const glow2 = ctx.createRadialGradient(80, H - 100, 20, 80, H - 100, 260)
  glow2.addColorStop(0, 'rgba(192, 132, 252, 0.12)')
  glow2.addColorStop(1, 'rgba(192, 132, 252, 0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, H - 500, W, 500)

  // 散落星点
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  const stars = [
    [120, 220, 10], [660, 180, 14], [700, 320, 9], [90, 420, 8],
    [730, 480, 11], [60, 640, 9], [745, 660, 8], [110, 780, 10], [700, 860, 9]
  ]
  stars.forEach(([x, y, s]) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.font = `${s}px sans-serif`
    ctx.fillText('✦', -s / 2, s / 2)
    ctx.restore()
  })

  // ---- 发光边框 + 四角装饰 ----
  ctx.strokeStyle = 'rgba(170, 59, 255, 0.45)'
  ctx.lineWidth = 2
  roundRectPath(ctx, 26, 26, W - 52, H - 52, 26)
  ctx.stroke()
  // 四角高亮短框
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.9)'
  ctx.lineWidth = 4
  const corners = [
    [26, 26, 1, 1], [W - 26, 26, -1, 1], [26, H - 26, 1, -1], [W - 26, H - 26, -1, -1]
  ]
  corners.forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath()
    ctx.moveTo(cx + sx * 34, cy)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx, cy + sy * 34)
    ctx.stroke()
  })

  ctx.textAlign = 'center'

  // ---- 顶部徽章 ----
  ctx.fillStyle = 'rgba(170, 59, 255, 0.18)'
  roundRectPath(ctx, W / 2 - 90, 62, 180, 40, 20)
  ctx.fill()
  ctx.strokeStyle = 'rgba(170, 59, 255, 0.6)'
  ctx.lineWidth = 1.5
  roundRectPath(ctx, W / 2 - 90, 62, 180, 40, 20)
  ctx.stroke()
  ctx.fillStyle = '#c084fc'
  ctx.font = '600 18px sans-serif'
  ctx.fillText('🏆 成 就 海 报', W / 2, 88)

  // ---- 标题 ----
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 46px sans-serif'
  ctx.fillText('城市打卡寻宝地图', W / 2, 155)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '19px sans-serif'
  ctx.fillText('基于百度地图开放平台 · 城市人文微旅行', W / 2, 196)

  // ---- 发光大数字 ----
  ctx.fillStyle = '#c084fc'
  ctx.shadowColor = '#aa3bff'
  ctx.shadowBlur = 34
  ctx.font = 'bold 120px sans-serif'
  ctx.fillText(String(checked), W / 2, 320)
  ctx.shadowBlur = 0
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '23px sans-serif'
  ctx.fillText(`/ ${total} 处人文点位已点亮`, W / 2, 362)

  // ---- 三枚统计卡片 ----
  const cards = [
    { label: '点位总数', value: String(total) },
    { label: '完成度', value: `${rate}%` },
    { label: '覆盖省份', value: '5 个' }
  ]
  const cardW = 200
  const cardH = 86
  const cardY = 405
  const gap = (W - 60 * 2 - cardW * 3) / 2
  cards.forEach((c, i) => {
    const x = 60 + i * (cardW + gap)
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    roundRectPath(ctx, x, cardY, cardW, cardH, 16)
    ctx.fill()
    ctx.strokeStyle = 'rgba(170,59,255,0.3)'
    ctx.lineWidth = 1
    roundRectPath(ctx, x, cardY, cardW, cardH, 16)
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText(c.value, x + cardW / 2, cardY + 40)
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '15px sans-serif'
    ctx.fillText(c.label, x + cardW / 2, cardY + 66)
  })

  // ---- 分节标题：我的寻宝足迹 ----
  drawSectionTitle(ctx, W, 556, '我的寻宝足迹')

  // ---- 已打卡点位缩略图（最多 4 张）----
  const checkedSpots = []
  for (const list of Object.values(allSpots.value)) {
    list.forEach(s => { if (s.isCheck) checkedSpots.push(s) })
  }
  const picked = checkedSpots.slice(0, 4)
  const imgs = await Promise.all(picked.map(s => loadImage(s.img)))
  const TH_W = 152
  const TH_H = 108
  const thGap = 16
  const thTotal = picked.length * TH_W + (picked.length - 1) * thGap
  const thStartX = (W - thTotal) / 2
  const thY = 580
  if (picked.length === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '17px sans-serif'
    ctx.fillText('还没有点亮任何点位，快去探索吧！', W / 2, thY + TH_H / 2)
  } else {
    imgs.forEach((img, i) => {
      const x = thStartX + i * (TH_W + thGap)
      ctx.save()
      roundRectPath(ctx, x, thY, TH_W, TH_H, 14)
      ctx.clip()
      if (img) {
        // cover 模式绘制
        const scale = Math.max(TH_W / img.width, TH_H / img.height)
        const dw = img.width * scale
        const dh = img.height * scale
        ctx.drawImage(img, x + (TH_W - dw) / 2, thY + (TH_H - dh) / 2, dw, dh)
      } else {
        ctx.fillStyle = 'rgba(170,59,255,0.15)'
        ctx.fillRect(x, thY, TH_W, TH_H)
      }
      // 底部渐变遮罩 + 名称
      const mask = ctx.createLinearGradient(0, thY + TH_H - 46, 0, thY + TH_H)
      mask.addColorStop(0, 'rgba(22,23,29,0)')
      mask.addColorStop(1, 'rgba(22,23,29,0.9)')
      ctx.fillStyle = mask
      ctx.fillRect(x, thY + TH_H - 46, TH_W, 46)
      ctx.fillStyle = '#fff'
      ctx.font = '600 13px sans-serif'
      ctx.textAlign = 'left'
      const name = picked[i].name.length > 7 ? picked[i].name.slice(0, 7) + '…' : picked[i].name
      ctx.fillText(name, x + 10, thY + TH_H - 14)
      ctx.textAlign = 'center'
      ctx.restore()
      // 缩略图描边
      ctx.strokeStyle = 'rgba(170,59,255,0.45)'
      ctx.lineWidth = 1.5
      roundRectPath(ctx, x, thY, TH_W, TH_H, 14)
      ctx.stroke()
    })
  }

  // ---- 分节标题：省份收集进度 ----
  drawSectionTitle(ctx, W, 762, '省份收集进度')

  // ---- 五省进度条 ----
  const startY = 796
  provinces.forEach((p, i) => {
    const list = allSpots.value[p.id] ?? []
    const c = list.filter(s => s.isCheck).length
    const pct = list.length ? c / list.length : 0
    const y = startY + i * 52

    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = '600 19px sans-serif'
    ctx.fillText(p.name, 90, y)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '16px sans-serif'
    ctx.fillText(`${c}/${list.length}`, W - 90, y)

    // 进度条底槽
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    roundRectPath(ctx, 90, y + 12, W - 180, 9, 4.5)
    ctx.fill()
    // 进度条填充
    if (pct > 0) {
      ctx.shadowColor = 'rgba(170,59,255,0.6)'
      ctx.shadowBlur = 8
      const grad = ctx.createLinearGradient(90, 0, W - 90, 0)
      grad.addColorStop(0, '#aa3bff')
      grad.addColorStop(1, '#c084fc')
      ctx.fillStyle = grad
      roundRectPath(ctx, 90, y + 12, Math.max(9, (W - 180) * pct), 9, 4.5)
      ctx.fill()
      ctx.shadowBlur = 0
    }
  })

  // ---- 底部口号 + 日期 ----
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(192,132,252,0.75)'
  ctx.font = '600 20px sans-serif'
  ctx.fillText('✨ 发现身边城市的文化魅力 ✨', W / 2, H - 82)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '16px sans-serif'
  ctx.fillText(formatDate(Date.now()), W / 2, H - 50)

  // 触发下载
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = `城市打卡成就-${checked}处.png`
  a.click()
  showToast('成就海报已生成并下载', { type: 'success' })
}

// 海报分节标题：两侧渐隐横线 + 中间文字
function drawSectionTitle(ctx, W, y, text) {
  ctx.font = '600 20px sans-serif'
  const tw = ctx.measureText(text).width
  const lineY = y - 7
  const grad1 = ctx.createLinearGradient(90, 0, W / 2 - tw / 2 - 16, 0)
  grad1.addColorStop(0, 'rgba(170,59,255,0)')
  grad1.addColorStop(1, 'rgba(170,59,255,0.55)')
  ctx.strokeStyle = grad1
  ctx.beginPath()
  ctx.moveTo(90, lineY)
  ctx.lineTo(W / 2 - tw / 2 - 16, lineY)
  ctx.stroke()
  const grad2 = ctx.createLinearGradient(W / 2 + tw / 2 + 16, 0, W - 90, 0)
  grad2.addColorStop(0, 'rgba(170,59,255,0.55)')
  grad2.addColorStop(1, 'rgba(170,59,255,0)')
  ctx.strokeStyle = grad2
  ctx.beginPath()
  ctx.moveTo(W / 2 + tw / 2 + 16, lineY)
  ctx.lineTo(W - 90, lineY)
  ctx.stroke()
  ctx.fillStyle = '#c084fc'
  ctx.fillText(text, W / 2, y)
}

// 图片加载（失败/超时返回 null，不阻塞海报生成）
function loadImage(src) {
  if (!src) return Promise.resolve(null)
  return new Promise(resolve => {
    const img = new Image()
    const timer = setTimeout(() => resolve(null), 3000)
    img.onload = () => { clearTimeout(timer); resolve(img) }
    img.onerror = () => { clearTimeout(timer); resolve(null) }
    img.src = src
  })
}

// canvas 圆角矩形路径
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.map-wrap {
  width: 80%;
  height: 100%;
  position: relative;
  flex-shrink: 0;
}

.map-box {
  width: 100%;
  height: 100%;
}

/* ===== 定位按钮 ===== */
.locate-btn {
  position: absolute;
  bottom: 24px;
  right: 12px;
  z-index: 100;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.locate-btn:hover {
  box-shadow: 0 2px 14px rgba(59, 130, 246, 0.4);
}

.locate-btn.locating .locate-dot {
  animation: pulse-loc 1s ease-in-out infinite;
}

.locate-dot {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2.5px solid #fff;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
}

@keyframes pulse-loc {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

/* ===== 弹窗距离信息 ===== */
.dist-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 8px 12px;
  background: #f0f7ff;
  border-radius: 8px;
  font-size: 13px;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.dist-icon {
  font-size: 16px;
}

.dist-in-range {
  margin-left: auto;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #22c55e;
  border-radius: 99px;
  flex-shrink: 0;
}

/* ===== 弹窗 ===== */
.popup {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.popup-content {
  width: 85%;
  max-width: 420px;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  position: relative;
}

.spot-img-wrap {
  position: relative;
}

.spot-img {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.img-tip {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 3px 8px;
  font-size: 11px;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(22, 23, 29, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  backdrop-filter: blur(4px);
  letter-spacing: 1px;
}

.tag {
  display: inline-block;
  padding: 3px 8px;
  background: #e8f0ff;
  color: #3377ff;
  font-size: 12px;
  border-radius: 4px;
  margin: 6px 0;
}

.tip {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn-check {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #2589fe;
  color: #fff;
}

.btn-checked {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #999;
  color: #fff;
}

.btn-route {
  flex: 1;
  padding: 10px;
  border: 1px solid #2589fe;
  border-radius: 8px;
  color: #2589fe;
  background: #fff;
}

/* 关闭按钮：毛玻璃圆钮，纯 CSS 绘制 × */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 5;
  background: rgba(22, 23, 29, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 13px;
    height: 2px;
    border-radius: 2px;
    background: #fff;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  &:hover {
    background: var(--accent);
    border-color: transparent;
    box-shadow: 0 0 14px var(--accent-border);
    transform: rotate(90deg) scale(1.08);
  }
}

/* ===== 右侧面板 ===== */
.book-panel {
  width: 20%;
  min-width: 280px;
  height: 100%;
  background: var(--bg);
  padding: 0 16px 16px;
  overflow-y: auto;
  box-sizing: border-box;
  border-left: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

/* ===== 头部 ===== */
.book-header {
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--border);
}

.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn {
  margin-left: auto;
  flex-shrink: 0;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: transparent;
  color: var(--text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-border);
    color: var(--accent);
    box-shadow: 0 0 6px var(--accent-border);
  }
}

.back-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: transparent;
  color: var(--text-h);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 8px var(--accent-border);
  }
}

.book-title {
  margin: 0;
  font-size: 18px;
  color: var(--text-h);
}

.book-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text);
}

.book-stats {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 8px;
}

.stats-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent);
  text-shadow: 0 0 12px var(--accent-border);
}

.stats-num i {
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  color: var(--text);
  text-shadow: none;
}

.stats-label {
  font-size: 13px;
  color: var(--text);
}

.progress-bar {
  margin-top: 10px;
  height: 6px;
  border-radius: 99px;
  background: var(--code-bg);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--accent), #c084fc);
  box-shadow: 0 0 8px var(--accent-border);
  transition: width 0.4s ease;
}

/* ===== 省份列表 ===== */
.province-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.province-item {
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-border);
    box-shadow: var(--shadow);
    transform: translateY(-1px);
  }
}

.province-ring {
  flex-shrink: 0;
  color: var(--text-h);
}

.province-item-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.province-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-h);
}

.province-count {
  font-size: 12px;
  color: var(--text);
}

.province-arrow {
  font-size: 22px;
  color: var(--text);
  transition: all 0.2s ease;
}

.province-item:hover .province-arrow {
  color: var(--accent);
  transform: translateX(4px);
}

/* ===== 筛选栏 ===== */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.filter-bar button {
  padding: 5px 12px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-bar button:hover {
  border-color: var(--accent-border);
  color: var(--accent);
}

.filter-bar button.active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 8px var(--accent-border);
}

/* ===== 图鉴列表 ===== */
.book-list {
  flex: 1;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.book-item {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.book-item:hover {
  border-color: var(--accent-border);
  box-shadow: var(--shadow);
}

.book-item.checked {
  background: var(--accent-bg);
  border-color: var(--accent-border);
}

.book-item.selected {
  border-color: var(--accent);
  border-width: 2px;
  box-shadow: 0 0 12px var(--accent-border);
  padding: 9px 11px;
}

.book-item-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.book-name {
  font-size: 14px;
  color: var(--text-h);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-cat {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  padding: 2px 8px;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  border-radius: 99px;
  border: 1px solid var(--border);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;
}

/* 古建筑 - 霓虹紫 */
.cat-arch {
  color: #c084fc;
  background: rgba(192, 132, 252, 0.12);
  border-color: rgba(192, 132, 252, 0.45);
  box-shadow: 0 0 6px rgba(192, 132, 252, 0.25), inset 0 0 4px rgba(192, 132, 252, 0.1);
  text-shadow: 0 0 8px rgba(192, 132, 252, 0.6);
}

/* 古迹 - 琥珀金 */
.cat-relic {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
  border-color: rgba(251, 191, 36, 0.45);
  box-shadow: 0 0 6px rgba(251, 191, 36, 0.25), inset 0 0 4px rgba(251, 191, 36, 0.1);
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.6);
}

/* 城市公园 - 荧光青 */
.cat-park {
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
  border-color: rgba(52, 211, 153, 0.45);
  box-shadow: 0 0 6px rgba(52, 211, 153, 0.25), inset 0 0 4px rgba(52, 211, 153, 0.1);
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
}

/* 非遗 - 赤金红 */
.cat-heritage {
  color: #f87171;
  background: rgba(248, 113, 113, 0.12);
  border-color: rgba(248, 113, 113, 0.45);
  box-shadow: 0 0 6px rgba(248, 113, 113, 0.25), inset 0 0 4px rgba(248, 113, 113, 0.1);
  text-shadow: 0 0 8px rgba(248, 113, 113, 0.6);
}

/* 特色老店 - 暖橙金 */
.cat-shop {
  color: #fb923c;
  background: rgba(251, 146, 60, 0.12);
  border-color: rgba(251, 146, 60, 0.45);
  box-shadow: 0 0 6px rgba(251, 146, 60, 0.25), inset 0 0 4px rgba(251, 146, 60, 0.1);
  text-shadow: 0 0 8px rgba(251, 146, 60, 0.6);
}

/* 未知分类 - 中性灰 */
.cat-default {
  color: var(--text);
  background: var(--code-bg);
  border-color: var(--border);
}

.book-status {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}

/* ===== 演示模式-操作条 ===== */
.sim-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px dashed var(--accent-border);
  border-radius: 10px;
  background: var(--accent-bg);
}

.sim-row-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sim-row-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.sim-row-desc {
  font-size: 11px;
  color: var(--text);
}

.sim-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid var(--accent);
  border-radius: 99px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 0 10px var(--accent-border);
  transition: all 0.2s ease;
}

.sim-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0 16px var(--accent);
}

.sim-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

/* 选中点位距离信息 */
.sim-dist {
  margin-top: 2px;
  font-size: 11px;
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 定位状态（演示模式行右侧，内联展示） */
.loc-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 99px;
  background: var(--code-bg);
  font-size: 11px;
  color: var(--text);
}

.loc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.loc-dot.active {
  background: #3b82f6;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
}

.loc-dot.locating {
  background: #fbbf24;
  animation: pulse-loc 1s ease-in-out infinite;
}

.loc-try {
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: transparent;
  font-size: 11px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.loc-try:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* ===== 演示模式徽标 ===== */
.demo-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 100;
  padding: 5px 14px;
  border-radius: 99px;
  background: rgba(170, 59, 255, 0.15);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  backdrop-filter: blur(6px);
  box-shadow: 0 0 12px var(--accent-border);
  pointer-events: none;
}

/* ===== 演示模式开关 ===== */
.demo-switch {
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 16px;
  margin-left: 8px;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: 99px;
  background: var(--code-bg);
  cursor: pointer;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.demo-switch.on {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 8px var(--accent-border);
}

.demo-switch-knob {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s ease;
}

.demo-switch.on .demo-switch-knob {
  transform: translateX(14px);
}

/* 演示模式开启时操作条高亮 */
.sim-row.demo-on {
  border-style: solid;
  box-shadow: 0 0 14px var(--accent-border);
}

/* ===== 分享成就按钮 ===== */
.share-btn {
  margin-left: auto;
  padding: 4px 12px;
  border: 1px solid var(--accent-border);
  border-radius: 99px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-btn:hover {
  border-color: var(--accent);
  box-shadow: 0 0 10px var(--accent-border);
}

/* ===== 图鉴详情卡片 ===== */
.collect-time {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 13px;
  text-align: center;
}

.popup-content .book-cat {
  margin: 6px 0;
}

.collection-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0 8px;
  text-align: center;
}

.lock-big {
  width: 56px;
  height: 56px;
  object-fit: contain;
  opacity: 0.85;
  filter: drop-shadow(0 0 12px var(--accent-border));
}

.locked-hint {
  color: var(--text);
  font-size: 13px;
  line-height: 1.6;
  max-width: 260px;
  margin: 6px 0 0;
}

/* ===== 移动端适配（主流手机 ≤ 768px）===== */
@media (max-width: 768px) {
  /* 布局：上下结构，地图在上、面板在下 */
  .container {
    flex-direction: column;
    height: 100vh;
    height: 100dvh; /* 移动端浏览器地址栏收缩时保持满屏 */
  }

  .map-wrap {
    width: 100%;
    height: 42%;
    flex-shrink: 0;
  }

  .book-panel {
    width: 100%;
    min-width: 0;
    height: 58%;
    padding: 0 12px 12px;
    border-left: none;
    border-top: 1px solid var(--border);
  }

  /* 头部 */
  .book-header {
    padding: 10px 0 8px;
  }

  .book-title {
    font-size: 16px;
  }

  .book-subtitle {
    font-size: 12px;
  }

  .stats-num {
    font-size: 22px;
  }

  /* 省份列表：触控友好 */
  .province-item {
    padding: 11px 12px;
  }

  .province-name {
    font-size: 15px;
  }

  /* 筛选栏：加大触控面积 */
  .filter-bar {
    padding: 10px 0;
    gap: 6px;
  }

  .filter-bar button {
    padding: 7px 14px;
    font-size: 13px;
  }

  /* 演示模式行：允许换行，避免溢出 */
  .sim-row {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px;
  }

  .sim-row-text {
    flex: 1;
    min-width: 0;
  }

  .loc-inline {
    padding: 5px 10px;
  }

  /* 图鉴列表 */
  .book-item {
    padding: 11px 12px;
  }

  /* 弹窗：全屏覆盖 + 内容可滚动（弹窗 DOM 在 map-wrap 内，
     移动端地图只占 42% 高度，需 fixed 才能覆盖全屏）*/
  .popup {
    position: fixed;
    z-index: 300;
  }

  .popup-content {
    width: 92%;
    max-width: none;
    max-height: 80%;
    overflow-y: auto;
    padding: 14px;
  }

  .spot-img {
    height: 140px;
  }

  .tip {
    font-size: 13px;
  }

  /* 按钮加大触控目标（≥44px）*/
  .btn-row {
    gap: 8px;
    margin-top: 14px;
  }

  .btn-check,
  .btn-checked,
  .btn-route {
    padding: 12px 8px;
    font-size: 15px;
  }

  .close-btn {
    width: 34px;
    height: 34px;
  }

  /* 定位按钮避开 iOS 底部安全区 */
  .locate-btn {
    bottom: calc(24px + env(safe-area-inset-bottom));
    width: 44px;
    height: 44px;
  }
}

</style>
