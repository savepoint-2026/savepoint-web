<template>
  <!-- <GroupManager></GroupManager> -->
  <!-- <GroupManager v-if="!groupStore.isGroup" /> -->
  <!-- <div v-else> -->
  <RaceTrack />
  <RankingBoard />
  <!-- </div> -->
</template>

<script setup>
import GroupManager from '@/components/group/GroupManager.vue'
import RaceTrack from '@/components/group/RaceTrack.vue'
import RankingBoard from '@/components/group/RankingBoard.vue'

import { useGroupStore } from '@/stores/useGroupStore'
import { onMounted } from 'vue'

const groupStore = useGroupStore()
const userId = window.sessionStorage.getItem('userId')

onMounted(() => {
  //   groupStore.fetchMyGroup(userId) //groupId setting
})
</script>
