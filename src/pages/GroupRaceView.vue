<template>
  <div v-if="!isLoading">
    <GroupManager
      v-if="
        !userStore.userData.groupId ||
        userStore.userData.groupId === 'empty' ||
        userStore.userData.groupId === ''
      "
    />
    <div v-else>
      <RaceTrack />
      <RankingBoard />
    </div>
  </div>
</template>

<script setup>
import GroupManager from '@/components/group/GroupManager.vue'
import RaceTrack from '@/components/group/RaceTrack.vue'
import RankingBoard from '@/components/group/RankingBoard.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useUserStore } from '@/stores/useUserStore'
import { onMounted, ref, watch } from 'vue'

const userStore = useUserStore()
const AuthStore = useAuthStore()
const groupStore = useGroupStore()
const transactionStore = useTransactionStore()
const isLoading = ref(true)

watch(
  () => userStore.userData.groupId,

  async (newGroupId) => {
    if (
      !userStore.userData.groupId ||
      userStore.userData.groupId === 'empty' ||
      userStore.userData.groupId === ''
    ) {
      isLoading.value = false
      return
    }

    try {
      //data loading
      await groupStore.loadGroup(newGroupId)
      const memberIds = groupStore.currentGroup.memberIds

      // memberIds로 transactionStore 접근해서 runners의 지출액 데이터 가져오기
      const runnersExpenses = await transactionStore.fetchGroupRunners(memberIds)
      // runners 배열에 userStore에서 userId로 이름, 아바타 이미지 조회해서 추가
      const runnersInfo = await userStore.fetchUsersInfo(memberIds)
      // runners 배열에 지출액, 이름, 아바타 이미지 및 필요한 데이터 합치기
      groupStore.getRunnersDetails(runnersExpenses, runnersInfo)
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await userStore.fetchUserData(AuthStore.currentUserId)
})
</script>
