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

const defaultStories: Story[] = [
  {
    id: 'guangde-stage-night-arts',
    title: '百戏夜走广德楼',
    era: '清末民初',
    tags: ['天桥技艺', '戏园', '市井'],
    excerpt: '天桥艺人夜里“走大栅栏”，在广德楼外以一盏青灯试艺，成败全看灯影之下的一招一式。',
    content: [
      '传说每逢市景最盛之夜，天桥艺人要“走大栅栏”，到广德楼边以一盏青灯试艺。灯低影长，最能见手上真功：变脸须在影里换，抖空竹得叫声“穿巷”。',
      '若赢得茶客齐声叫好，楼里票友便请其登台“压轴一折”；若技不成，艺人便在门楣下贴一张小红纸，自嘲“再练三月”。',
      '久而久之，广德楼外留下许多红纸印痕。老街坊说：那是艺人的“许愿簿”，愿技成、愿口碑成、愿来年再走这一盏灯。'
    ]
  },
  {
    id: 'tongrentang-herb-fragrance',
    title: '药香穿胡同的指路星',
    era: '清中期',
    tags: ['同仁堂', '中药', '商号传奇'],
    excerpt: '夜半打更过后，胡同尽头仍有药香不散，像一颗“指路星”，把赶夜的人领到铺门前。',
    content: [
      '同仁堂夜里炮制蜜丸，铜锅轻沸，药香沿着屋脊与风走。更夫打过四更，香气仍在，像在胡同口挂了一颗“指路星”。',
      '跑夜活的脚行闻味辩方：辛温是桂枝，甜润是阿胶，带一点凉意的该是薄荷。循香而至，恰到铺门前，匾额上“炮制虽繁”四字在灯下微亮。',
      '老人说：那星不是天上来的，是匠心蒸出来的。故此药可医身，也能安一条夜路的人心。'
    ]
  },
  {
    id: 'ruifuxiang-silk-wish',
    title: '瑞蚨祥的锦样许愿',
    era: '清末',
    tags: ['布庄', '民俗', '老字号'],
    excerpt: '新娘取一小片锦样缝入嫁衣内襟，谓之“添彩”，愿日子像锦纹一样层层相生。',
    content: [
      '瑞蚨祥柜台上摆锦样册，花名繁复：起凤、缠枝、海水江崖。传说挑中哪一页，便会应哪一愿。',
      '姑娘们悄悄撕下一角细布，缝在嫁衣内襟，叫“添彩”。若选的是缠枝，愿子孙连绵；若选的是起凤，愿夫君起家。',
      '柜上伙计不阻拦，只在账本上记一笔“喜”。老掌柜说：锦样小，心意大，铺子也借了这一点好彩头。'
    ]
  },
  {
    id: 'neiliansheng-hundred-layer-sole',
    title: '百层底不湿的雨巷',
    era: '民国',
    tags: ['内联升', '工艺', '鞋履'],
    excerpt: '据说下雨的巷子里，穿百层底的人能“踏雨不湿脚”，留下的是一串细密干爽的鞋纹。',
    content: [
      '大栅栏的雨来得急，巷口泥滑。传说穿内联升百层底的人，步子稳，脚面干，鞋印一串细密，像算盘珠子。',
      '匠人说，底里藏着层层棉纸与码线，走路时吸一口潮，起脚便把潮吐在泥里，所以不湿脚面。',
      '后来有人试验，将鞋印拓在宣纸上，竟能看清每一针的纹路。街坊笑道：这鞋，是拿工夫在脚下“写字”。'
    ]
  },
  {
    id: 'huoshen-lantern-patrol',
    title: '火神庙的红灯夜巡',
    era: '清末',
    tags: ['防火', '行会', '庙会'],
    excerpt: '大火之后，商户立约：每到三伏换季，门口挂红灯，夜巡不息，灯影就是守护的誓言。',
    content: [
      '大栅栏旧时最怕火，胡同里有火神庙。一次夜里起了风，街上灯笼连成一片红，像把火系在门口不让它跑。',
      '自此每到换季，铺户门楣挂红灯，掌灯的伙计腰系铜铃，巡更时轻轻一晃，铃声与灯影同行，叫“安火”。',
      '有人说红灯能辟灾，也有人说是提醒人心：人守着灯，灯也守着人。于是多年未有大火，街坊称“红灯护市”。'
    ]
  },
  {
    id: 'meilang-fan-butterfly',
    title: '梅郎扇影成蝶',
    era: '民国初',
    tags: ['京剧', '名伶', '戏园'],
    excerpt: '一折《贵妃醉酒》，扇影映在幕绉上，像一只蝶飞进观众心里，此后“梅派”名动南北。',
    content: [
      '广和楼里台口不大，梅郎初登时，台边挂了新幕绉。唱到“玉环起步”，扇子一折一合，影子落在幕上，竟像蝶要振翅。',
      '票友惊为天人，第二日门口就多了几把细骨团扇，据说拿扇进场，能“借得一缕扇风”，唱腔更入耳。',
      '后来梅派名动南北，老街坊仍念那一夜：扇影成蝶，不只在幕上，也在大栅栏这条街的心上。'
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
