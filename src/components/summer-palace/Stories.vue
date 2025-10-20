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
    id: 'seventeen-arch-sunset-gold',
    title: '十七孔桥的金光签',
    era: '清中期—今',
    tags: ['十七孔桥', '夕照', '节令'],
    excerpt: '冬至前后，夕阳斜入桥洞，光束一孔连一孔，被称作“金光签”。求者默许，愿事有度。',
    content: [
      '昆明湖面收了风，夕照沿湖一线斜过来。十七孔桥的洞口先后被点亮，像一串签名，老船工称之“金光签”。',
      '旧例：游人若立在桥心第三拱，默许一愿，不言其大，愿成在有度。管桥的守看笑道：光走到哪儿，心就量到哪儿。',
      '有人问何以有此景，舟子挠头：天有角度，桥有节奏。人若守住节奏，四季都有光。'
    ]
  },
  {
    id: 'kunming-lake-ice-qin',
    title: '昆明湖的冰琴',
    era: '清末—民国',
    tags: ['昆明湖', '冰裂', '音声'],
    excerpt: '严冬夜里，湖冰如琴，远处裂响绵延，被称为“冰琴”。',
    content: [
      '腊月的湖面封得极实，夜半忽闻远处“嗡”“咔”的长声，像有人拂过一张大琴。',
      '园丁说：这叫“冰走”，湖水与寒气拉扯，冰缝在移动。听得懂的人，能分出高低轻重，辨寒与暖。',
      '自此守夜的兵把“冰琴”的第一声记在册上，次日按此安排扫桥与防滑，笑称“听琴做事”。'
    ]
  },
  {
    id: 'long-corridor-color-talk',
    title: '长廊彩画会说话',
    era: '清中期',
    tags: ['长廊', '彩画', '露华'],
    excerpt: '清晨露重，彩画近看更鲜，仿佛“开口”。老匠说：那是露华在讲色。',
    content: [
      '长廊彩画层层罩染，晨露微凝，色泽被唤醒。近看人物眼角生光，远看山水生气。',
      '漆师教徒弟：露来时只拂，不可擦；让它自己“讲色”。拂得好，色暖；擦得急，色滞。',
      '游人问何以如此灵动，漆师答：画在木上，意在露里，心在手里。三者合，便会“说话”。'
    ]
  },
  {
    id: 'foxiangge-wind-bell',
    title: '佛香阁的风占',
    era: '清代',
    tags: ['佛香阁', '风铃', '占候'],
    excerpt: '阁檐铃声有节，僧人与园丁据其声辨风，春修夏护皆循其“风占”。',
    content: [
      '佛香阁高处风急，檐铃三十六，遇不同风向各鸣一侧。僧人记其起落，园丁据此安排修枝与护花。',
      '铃声若重而不急，多半将雨；若急而不浊，多半转晴。于是园中活计先铃后人。', 
      '老头儿说：听铃不是算天，是敬天；敬过了，自然不误事。'
    ]
  },
  {
    id: 'marble-boat-light-sail',
    title: '石舫无帆行',
    era: '晚清—今',
    tags: ['清晏舫', '光影', '湖面'],
    excerpt: '暮色将合，石舫如浮，灯影在水，似无帆而行。',
    content: [
      '清晏舫本是石作，然晚风一起，水波映灯，影子轻轻向前，人误以为舫自行。',
      '看船的笑言：不是船走，是光走；不是石轻，是心轻。', 
      '自此夜游有俗：不喧不唱，只看一盏灯在水上走完一个湾。'
    ]
  },
  {
    id: 'xiequ-garden-echo-laugh',
    title: '谐趣园的回笑',
    era: '清—当代',
    tags: ['谐趣园', '回声', '小景'],
    excerpt: '小桥曲廊相向，轻笑能回三转，称“回笑”。',
    content: [
      '谐趣园廊桥多转折，廊檐与水面作回声道。两人隔桥低笑一声，回音在水与木间走了三步才散。',
      '园中立规：廊间轻声，不可高歌；回笑可有，不可放声。', 
      '后来小孩儿玩耍，守园人只说一句：让笑声细一点，园就更长一点。'
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
