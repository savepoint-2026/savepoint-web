<template>
  <ProfileBox v-if="!userStore.loading" />
</template>

<script setup>
import ProfileBox from '@/components/profile/ProfileBox.vue'

import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'

const authStore = useAuthStore()
const userStore = useUserStore()

userStore.loadUserData(authStore.currentUserId)
</script>
