<template>
  <section class="legend-stories">
    <!-- 标题区域：与 Sayings/CharacterHub 风格一致 -->
    <div class="section-header">
      <h1 class="section-title">传奇故事</h1>
      <p class="section-subtitle">情胜史笔的细碎光影，复现千年风云流转</p>
    </div>

    <!-- 卡片网格 -->
    <div class="stories-grid">
      <article
        v-for="s in storiesToUse"
        :key="s.id || s.title"
        class="story-card card"
        @click="openStory(s)"
        tabindex="0"
        role="button"
        @keydown.enter.space.prevent="openStory(s)"
        :aria-label="`阅读故事：${s.title}`"
      >
        <div class="story-meta">
          <span class="chip era-chip">{{ s.era }}</span>
          <span v-for="t in s.tags" :key="t" class="chip tag-chip">{{ t }}</span>
        </div>

        <h4 class="story-title">{{ s.title }}</h4>
        <p class="story-excerpt">{{ s.excerpt }}</p>

        <button class="btn btn-primary read-btn" @click.stop="openStory(s)">阅读故事</button>
      </article>
    </div>

    <!-- 弹窗（沿用全局 .modal-* 的命名；若有全局样式会自动适配） -->
     <teleport to="body">
        <transition name="fade">
          <div
            v-if="isStoryModalVisible"
            class="modal-overlay"
            @click.self="closeStory"
            aria-modal="true"
            role="dialog"
          >
            <div class="modal-content card" ref="modalRef">
              <button class="modal-close" @click="closeStory" aria-label="关闭">×</button>

              <div class="modal-title">
                <div class="modal-title-bar"></div>
                <h3>{{ selectedStory?.title }}</h3>
                <div class="modal-subtitle">
                  <span class="chip era-chip">{{ selectedStory?.era }}</span>
                  <span
                    v-for="t in selectedStory?.tags || []"
                    :key="t"
                    class="chip tag-chip"
                  >{{ t }}</span>
                </div>
              </div>

              <div class="modal-story-content">
                <p v-for="(p, idx) in (selectedStory?.content || [])" :key="idx">{{ p }}</p>
              </div>
            </div>
          </div>
        </transition>
     </teleport>
    
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'

type Story = {
  id?: string
  title: string
  era: string
  tags: string[]
  excerpt: string
  content: string[]
}

const props = defineProps<{
  stories?: Story[]        // 可选：外部传入故事
  columns?: number | string // 可选：自定义列数（默认 3）
}>()

// 故宫 · 传奇故事（6 则）
const defaultStories: Story[] = [
  {
    id: 'echo-wall-three-whispers',
    title: '回音壁的三道悄语',
    era: '明清—今',
    tags: ['回音壁', '声学', '礼制'],
    excerpt: '圜丘南侧，墙根相对轻语，三转即至。礼官定规：只传两字，不可多言。',
    content: [
      '回音壁以青砖严缝连缀，声波贴壁而行。旧时礼官在祭日试“悄语”：两人隔壁相对，各退三步，轻声二字，三转即至耳畔。',
      '有新人贪多，连说五六字，语尾散失。礼官记于册：礼贵简，语亦贵简。',
      '自此守制：回音壁传呼，只得两字。人们说：墙替我们把多余的话收走了。'
    ]
  },
  {
    id: 'heavenly-heart-stone-breath',
    title: '天心石上的一口气',
    era: '明代',
    tags: ['圜丘坛', '天心石', '仪典'],
    excerpt: '圜丘正中立足片刻，胸中气息自稳。太常寺称之为“纳清气”。',
    content: [
      '圜丘坛面以九重圆石铺砌，中心为“天心石”。礼前主祭者立于其上，先不言不拜，只调一息。',
      '旧籍云：纳清气一息，心不乱，步不差，言不滞。于是列入仪程首项。',
      '后来百姓来游，亦喜立石上默息，笑称“借天心，理人心”。'
    ]
  },
  {
    id: 'seven-star-stone-shadow',
    title: '七星石的影子规矩',
    era: '清初',
    tags: ['祈年殿', '七星石', '影测'],
    excerpt: '七星石间的影线，每到夏至便齐，工匠以此校准殿前台阶的中缝。',
    content: [
      '祈年殿前七星石布局有意。工部匠作夏至日观其影，影线齐时，量殿前中缝与栏板距离，校正微差。',
      '一次修缮后影线偏半寸，匠首复量至夜，次日微移一砖，影复归齐。',
      '匠首记曰：天授影，人守线。线若正，殿自正。'
    ]
  },
  {
    id: 'long-corridor-wind-chime',
    title: '丹陛长廊的风签',
    era: '清中期',
    tags: ['长廊', '风向', '园务'],
    excerpt: '丹陛廊下悬细签，风起有声。太监据其响，定扫尘与护彩的时序。',
    content: [
      '丹陛长廊易积尘，廊檐下悬细竹签数枚，遇东南风为轻响，遇西北风为重响。',
      '总管据此排活：轻响先扫廊，重响先护彩。因重风多夹沙，须先护色后扫尘。',
      '从此值日牌上添一条：先听风，再动手。'
    ]
  },
  {
    id: 'imperial-celestial-music',
    title: '祈年礼的隐乐',
    era: '明末清初',
    tags: ['礼乐', '雅乐', '节奏'],
    excerpt: '礼成散班后，雅乐尚存一息尾音，称“隐乐”。执礼官以此验队列不乱。',
    content: [
      '大祀礼毕，乐班收音，不骤停而留一息微音。队列在这尾音里静退三步，转向而散。',
      '老执礼官说：有尾音，心有余地；无尾音，人多生躁。',
      '后来“隐乐一息”被写进乐谱注脚，传为天坛小规矩。'
    ]
  },
  {
    id: 'grain-storage-echo-of-harvest',
    title: '皇乾殿外的丰年回声',
    era: '近代',
    tags: ['祈谷', '民俗', '回声',
    ],
    excerpt: '秋后百姓立于祈年殿外台阶，轻踏一脚，回声沉稳，老人说：声厚年丰。',
    content: [
      '收成佳年，殿前石阶缝里干爽，足音沉而不空；雨涝之年，缝内潮重，回声发闷。',
      '于是老街坊来此“听年声”，当然只是图个吉利。守殿人笑道：好年在地里，不在石里；但愿你们心里的回声也厚实些。',
      '自此重阳前后，来“听年”的人多了起来，台阶被踏得更亮。'
    ]
  }
]

const storiesToUse = computed<Story[]>(() => props.stories?.length ? props.stories : defaultStories)

const isStoryModalVisible = ref(false)
const selectedStory = shallowRef<Story | null>(null)
const modalRef = ref<HTMLElement | null>(null)

const emit = defineEmits<{
  (e: 'open', story: Story): void
  (e: 'close'): void
}>()

function openStory(s: Story) {
  selectedStory.value = s
  isStoryModalVisible.value = true
  emit('open', s)
  requestAnimationFrame(() => modalRef.value?.focus?.())
}
function closeStory() {
  isStoryModalVisible.value = false
  selectedStory.value = null
  emit('close')
}

// ESC 关闭
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isStoryModalVisible.value) {
    e.preventDefault()
    closeStory()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
:root {
  --bh-primary: #3a6c4f;
  --bh-primary-600: #2d5a40;
  --bh-surface: #ffffff;
  --bh-surface-2: #f6fbf8;
  --bh-border: rgba(58, 108, 79, 0.14);
  --bh-muted: #4a5b52;
  --bh-title: #2b3d33;
  --bh-radius: 14px;
  --bh-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  --bh-shadow-lg: 0 10px 24px rgba(0, 0, 0, 0.08);
}

/* 容器与标题 */
.legend-stories {  
  --section-surface: rgba(255, 255, 255, 0.82);
  --section-border: rgba(58, 108, 79, 0.12);
  --section-radius: 16px;

  position: static !important; overflow: visible;
  background: var(--section-surface);
  max-width: var(--bh-content-max, 1200px);
  margin: 0 auto;
  border: 1px solid var(--section-border);
  border-radius: var(--section-radius);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  padding: 18px 16px 22px;
  backdrop-filter: saturate(120%) blur(2px);  }

.section-header {
  text-align: center;
  margin: 1.2rem auto 0.5rem;
  max-width: 900px;
}
.section-title {
  font-size: var(--bh-title-lg, 3rem);
  color: var(--bh-primary, #3a6c4f);
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 0.4rem;
  letter-spacing: 0.5px;
  margin: 0 0 .4rem;
}
.section-subtitle {
  color: var(--bh-muted, #4a5b52);
  font-size: var(--bh-subtitle, 1.04rem);
  opacity: 0.9;
}

/* 卡片网格 */
.stories-grid {
  margin-top: 1rem;
  margin: 0.8rem auto 0;
  display: grid;
  grid-template-columns: repeat(var(--grid-cols, 3), 1fr);
  gap: 16px;
  max-width: 1200px;
  padding: 0 12px;
}
.card {
  background: var(--bh-surface);
  border: 1px solid var(--bh-border);
  border-radius: var(--bh-radius);
  box-shadow: var(--bh-shadow);
}

/* 单卡片 */
.story-card {
  padding: 18px;
  transition: transform .2s ease, box-shadow .2s ease;
  cursor: pointer;
  outline: none;
  border: 1px solid var(--bh-card-border, rgba(58,108,79,0.18));
  border-radius: var(--bh-radius, 14px);
  background: var(--bh-card-surface, #fff);
  box-shadow: var(--bh-card-shadow, 0 6px 18px rgba(0,0,0,0.06));
}
.story-card:hover { box-shadow: var(--bh-card-shadow-lg, 0 10px 24px rgba(0,0,0,0.08)); }
.story-card:focus-visible { box-shadow: 0 0 0 3px rgba(58,108,79,.35); }

.story-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.chip {
  display: inline-block;
  line-height: 1;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .82rem;
}
.era-chip { background: rgba(58,108,79,.12); color: var(--bh-primary-600); }
.tag-chip { background: var(--bh-surface-2); color: var(--bh-primary); border: 1px solid var(--bh-border); }

.story-title {
  font-size: 1.12rem;
  color: var(--bh-title);
  margin: 6px 0 8px;
  font-weight: 700;
}
.story-excerpt {
  color: var(--bh-muted);
  line-height: 1.7;
  font-size: .96rem;
  min-height: 3.2em;
}
.story-title {
  color: var(--bh-title, #2b3d33);
}

/* 按钮：若你有全局 .btn/.btn-primary 将覆盖此处 */
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 12px; border-radius: 10px; border: none; cursor: pointer;
  font-weight: 600;
}
.btn-primary {
  background: linear-gradient(135deg, var(--bh-primary), #579873);
  color: #fff;
}
.read-btn { margin-top: 12px; transition: box-shadow .2s ease, transform .15s ease; }
.read-btn:hover { box-shadow: 0 6px 16px rgba(58,108,79,.25); transform: translateY(-1px); }

/* 弹窗：如果你已有全局 .modal-*，它们会优先生效 */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


.modal-overlay {
  position: fixed !important;
  inset: 0 !important;            /* 等价于 left:0; top:0; right:0; bottom:0 */
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0,0,0,.56) !important;  /* 全屏黑色半透明 */
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  z-index: 2147483647;            /* 极大层级，压过页面上的所有卡片/阴影 */
}

.modal-content{
  position: relative;
  width: min(860px, 90vw);
  max-height: 85vh;
  overflow: auto;
  background: #fff;
  color: #2b3d33;
  border: 1px solid rgba(58,108,79,0.14);
  border-radius: 18px;
  box-shadow: 0 18px 38px rgba(0,0,0,.18), 0 6px 16px rgba(0,0,0,.10);
  padding: 28px 28px 24px;
  z-index: 2147483648;            /* 高于遮罩 */
}
@keyframes legendDialogIn {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-close,
.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(58,108,79,.18);
  background: #fff;
  color: #3a6c4f;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.10);
}
.modal-close:hover,
.close-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0,0,0,.14);
  background: #ffffff;
}

.modal-title { text-align: center; margin: 2px 0 14px; }
.modal-title h1 {
  font-size: 2rem;                 /* 与 Sayings 的主标题层级一致 */
  line-height: 1.3;
  color: #214a36;
  font-weight: 800;
  letter-spacing: .3px;
  margin: 6px 0 8px;
}
.modal-title-bar {
  width: 120px;
  height: 2px;
  border-radius: 1px;
  margin: 10px auto 0;
  background:
    linear-gradient(90deg, transparent, rgba(58,108,79,.35) 18%, rgba(58,108,79,.55) 50%, rgba(58,108,79,.35) 82%, transparent);
}
.modal-subtitle {
  margin-top: 8px;
  color: #3a6c4f;
  font-size: .95rem;
  opacity: .9;
}

.modal-story-content { 
  text-align: center;
  margin-top: 16px;
  padding: 18px 18px;
  background: linear-gradient(180deg, #f7fbf8, #f3f8f5);
  border: 1px solid rgba(58,108,79,.10);
  border-radius: 14px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
  line-height: 1.95;
  font-size: 1.02rem;
  color: #2b3d33; }
.modal-story-content p + p { margin-top: .85em; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* 响应式与列数控制（参考 CharacterHub 卡片密度） */
@media (max-width: 1200px) {
  .stories-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1024px) {
  .stories-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .legend-stories .modal-content { width: 94vw; padding: 22px 18px; border-radius: 16px; }
}
</style>
