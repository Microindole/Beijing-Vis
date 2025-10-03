<template>
  <div class="dynasty-timeline">
    <button
      v-for="dynasty in dataStore.dynasties"
      :key="dynasty"
      :class="{ active: dynasty === dataStore.activeDynasty }"
      @click="selectDynasty(dynasty)"
    >
      {{ dynasty }}
    </button>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/useDataStore';

const dataStore = useDataStore();

function selectDynasty(dynasty) {
  dataStore.setActiveDynasty(dynasty);
}
</script>

<style scoped>
.dynasty-timeline {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  padding: 0 1rem;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.dynasty-timeline::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}


button {
  padding: 0.6rem 1.2rem;
  margin: 0 0.5rem;
  border: 1px solid var(--border-color);
  background-color: #fff;
  color: var(--secondary-text-color);
  cursor: pointer;
  border-radius: 20px;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  flex-shrink: 0;
}

button:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

button.active {
  background-color: var(--header-bg-color);
  color: var(--header-text-color);
  border-color: var(--header-bg-color);
  font-weight: bold;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>

