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
    id: 'beacons-silent-treaty',
    title: '烽火台的无字盟',
    era: '战国—明',
    tags: ['烽燧', '边塞', '军令'],
    excerpt: '风紧云低的夜里，三座烽台只亮两座，留下一格黑影，叫“无字盟”。',
    content: [
      '边军约定，若遇小股试探，两座台连点，一座留暗，示意“稳守不出”。此法既避虚实，又省薪炭，兵中称“无字盟”。',
      '一次风雪夜，黑影正落在峡口上，敌骑误以为有伏，绕行数十里，晨起只见雪痕回转如迷宫。',
      '老卒说：烽火会说话，不用字。懂的人听得见，不懂的人只看得到风。'
    ]
  },
  {
    id: 'jade-mortar-in-the-wall',
    title: '墙里那一盏玉灰',
    era: '明代',
    tags: ['夯筑', '工匠', '传说'],
    excerpt: '传说有一段墙缝里加了“玉灰”，雨过不渗，敲之微响如磬。',
    content: [
      '匠头从河谷捡来玉屑，和入糯米灰与石灰，抹在迎风缝里，坚实如石。雨后日光照上去，缝口微微发青。',
      '巡墙武弁以刀背叩之，声清脆，像磬。匠头笑道：不是玉贵，是用心贵；不是灰硬，是人心硬。',
      '此后城段遇险皆先补缝，兵与匠同做一事，名“合心补”。'
    ]
  },
  {
    id: 'moon-gate-echo',
    title: '月门回语',
    era: '清初',
    tags: ['城门', '声学', '驿传'],
    excerpt: '斜月下城门洞里轻唤一声，回音能往城上两转，恰好传到更夫耳中。',
    content: [
      '城门拱洞与女儿墙形成回音道，更夫夜巡以此传话：两字为令，三字为警，四字不可言。',
      '某夜雾大，鼓点听不真，回语却分毫不差，恰救下迷路的递送兵，驿丞在门枋刻“小语不小”。',
      '从此夜巡立新规：能轻不重，能近不远，能小不大。'
    ]
  },
  {
    id: 'dragon-vein-spring',
    title: '龙脉泉的三次醒',
    era: '明中期',
    tags: ['水脉', '隘口', '民生'],
    excerpt: '墙下石缝出一脉清泉，逢春、逢暴雨、逢大旱各醒一次，护兵亦护民。',
    content: [
      '春融时泉水初醒，供军马饮；暴雨时泉口分流泄涝，保墙足不塌；大旱时夜里微涌，村人挑去救苗。',
      '老军把泉口圈以青石，立牌“军民共用”，并立三规：先伤者、后弱者、再军用。',
      '有人问泉何以知时，老军指墙脚：石知雨，土知旱，人知心。三者合，则泉自来。'
    ]
  },
  {
    id: 'shadow-of-the-watchman',
    title: '更夫的影子',
    era: '明末',
    tags: ['守城', '灯影', '人心'],
    excerpt: '炬火将熄时，更夫让影子先上城，城下的心就定了一半。',
    content: [
      '更夫夜巡至险处，先举火照墙，让影子在敌坡显出人形。远望如有人持戈而立，实则更夫方才上梯。',
      '一次突袭，敌骑见影先止，不敢逼近，城上争取到整整一盏茶的时间布防。',
      '更夫说：不是影子守住了城，是影子先守住了怕。'
    ]
  },
  {
    id: 'snow-lines-of-the-wall',
    title: '雪上线',
    era: '近代',
    tags: ['雪霁', '边墙', '足迹'],
    excerpt: '大雪初霁，城上只剩三行细线——巡更、驮粮与修缮，各不相乱。',
    content: [
      '雪后巡墙，脚印细直，驮粮的蹄痕宽重，修缮的担子在墙角留下半圆印。三线并行，远远像写在城脊上的三句诗。',
      '老兵教新兵认线：看稳与重，看去与回，看人与物，看的是一条墙的呼吸。',
      '多年后墙段整修，修路人仍沿着那三线铺板，称“老路不移”。'
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
