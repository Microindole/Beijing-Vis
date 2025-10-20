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
    id: 'golden-water-bridge-echo',
    title: '金水桥上的回声签',
    era: '明清',
    tags: ['金水河', '宫阙礼制', '声学'],
    excerpt: '传说立在中和门外金水桥心石上轻声一许，回声若叠三下，所求当岁可成。',
    content: [
      '御道前的金水桥拱影交错。老内侍教新人：若在桥心石上低声一许，桥拱与水面会把回声叠成三道，叫“回声签”。',
      '太监们多求平安差事，宫女多求乡信早至。有人只听到两声，就把愿望改小半分，笑言：做人要与桥讲和。',
      '后来工程局修桥缝，仍留那块心石原位。导游说是文物，守门的老兵则说：留的是一份“说小话、做实事”的规矩。'
    ]
  },
  {
    id: 'imperial-garden-osmanthus-snow',
    title: '御花园的桂雪夜',
    era: '清中期',
    tags: ['御花园', '四时', '植物传说'],
    excerpt: '秋夜桂花开，微风拂过，花瓣如雪。宫人称这场“桂雪”能把烦恼压下一尺。',
    content: [
      '御花园的桂树老而香。每至仲秋，花瓣骤落，碎金一般铺在御路两旁，月色里像小雪。',
      '传言那一夜若绕游三圈，不言不语，第二天起心事会轻一尺。问其所以，园匠说：桂香压尘，人心不那么起灰。',
      '后来有人把落瓣扫拢，晒成香囊，出宫时送与看门兵。兵笑纳，说：这囊里装的不是香，是规矩与体面。'
    ]
  },
  {
    id: 'nine-dragon-wall-breath',
    title: '九龙壁的温气',
    era: '清初',
    tags: ['九龙壁', '匠作', '御寒'],
    excerpt: '冬日北风急，壁后竟有一股回暖的“龙息”，据说是匠人暗藏的御寒心思。',
    content: [
      '乾清门侧九龙壁色釉斑斓。寒风最烈的时节，靠壁背风处竟不觉刺骨。',
      '老工匠解释：壁后砌有空腔，日暖藏热，夜里缓缓吐出，像龙在呼吸。此法原为护釉与排潮，意外也“护人”。',
      '自此，换岗的兵喜欢靠壁片刻取暖。管事的并不责怪，只叮嘱：暖身可以，莫暖散心。'
    ]
  },
  {
    id: 'meridian-gate-shadow-drum',
    title: '午门影鼓',
    era: '明代',
    tags: ['午门', '仪典', '时刻'],
    excerpt: '午门楼影每至正午压过一线石缝，鼓声随之而起。影与鼓一道，成了“午门影鼓”。',
    content: [
      '传说午门台阶中有一线石缝，日影正午时分恰压过其上，执事据此击鼓，作为“正午”的隐秘标记。',
      '逢大典，鼓声沉稳，影线如刀。老礼部官说：影不差分，礼不差分，国之大事亦不差分。',
      '后来阴雨天看不见影，鼓仍按时而作。有人问凭何，答曰：凭心中的那条线。'
    ]
  },
  {
    id: 'palace-lantern-moth',
    title: '宫灯与流萤',
    era: '清末',
    tags: ['宫灯', '夜色', '微光'],
    excerpt: '夏夜宫灯微晃，流萤自来绕。宫人说：灯心若稳，萤也不散。',
    content: [
      '太庙甬道旁的宫灯，老匠用榆木骨、绢面纸。夏夜风起，灯不烈只稳，远处流萤聚来绕灯飞。',
      '宫女闲时数萤，见成环便说“今夜有喜”，其实只是因为灯罩温度恰好、亮度不伤。',
      '此后宫灯修补都照此标准，守夜的兵把这套做法写在灯框背后，称“稳心式”。'
    ]
  },
  {
    id: 'hidden-corridor-whisper',
    title: '游廊里的回语',
    era: '明清',
    tags: ['游廊', '建筑声学', '宫廷轶事'],
    excerpt: '交角游廊对语，微声可至数十步外，御前传呼因此“轻声亦达”。',
    content: [
      '内廷游廊转角多，瓦当与梁柱构成的回音路径奇巧。传言在角口对着柱根轻语，可在数十步外被同伴清晰听见。',
      '太监用此传呼不扰寝殿，称“回语”。规矩是：只传两字，不许多言。',
      '后有匠作修缮，把角口的木节与地面石缝调齐，声音更准。总管说：技艺是“少走一步路”，也是“少说一句话”。'
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
