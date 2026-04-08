<template>
  <router-link :to="routeName[id]">
    <li :class="currentRoute.fullPath === routeName[id] ? 'selected' : 'non-selected'">
      <img
        :src="currentRoute.fullPath === routeName[id] ? blackIcons[id] : icons[id]"
        width="20"
        height="20"
      />
      <span>{{ menuLabel[id] }}</span>
    </li>
  </router-link>
</template>

<script setup>
import MainIconBlack from '@/assets/icons/sidebar/sidebar-dashboard-black.png'
import MainIcon from '@/assets/icons/sidebar/sidebar-dashboard.png'
import TransIconBlack from '@/assets/icons/sidebar/sidebar-history-black.png'
import TransIcon from '@/assets/icons/sidebar/sidebar-history.png'
import SummaryIconBlack from '@/assets/icons/sidebar/sidebar-summary-black.png'
import SummaryIcon from '@/assets/icons/sidebar/sidebar-summary.png'
import GroupIconBlack from '@/assets/icons/sidebar/sidebar-race-black.png'
import GroupIcon from '@/assets/icons/sidebar/sidebar-race.png'
import { useRoute } from 'vue-router'

const menuLabel = ['메인 대시보드', '거래 내역 조회', '월별 재정 요약', '소비 레이스']
const blackIcons = [MainIconBlack, TransIconBlack, SummaryIconBlack, GroupIconBlack]
const icons = [MainIcon, TransIcon, SummaryIcon, GroupIcon]
const routeName = ['/', '/transactions', '/summary', '/groups']

const { id } = defineProps({
  id: Number,
})

const currentRoute = useRoute()
</script>

<style scoped>
li {
  width: 100%;
  height: 48px;
  display: flex;
  gap: 16px;
  align-items: center;
  padding-left: 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  cursor: pointer;
}

.selected {
  background-color: var(--yellow-1);
  box-shadow: 0 4px 8px #ffdab940;
}

.selected:hover {
  background-color: var(--yellow-2);
}

.non-selected {
  background-color: transparent;
}

.non-selected:hover {
  background-color: var(--black-3);
}

.selected span {
  color: var(--black-1);
  font-weight: 700;
}

.non-selected span {
  color: var(--black-2);
  font-weight: 500;
}
</style>
