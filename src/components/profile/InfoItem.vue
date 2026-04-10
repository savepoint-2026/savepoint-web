<template>
  <div class="info-item">
    <div class="label-box">
      <img :src="icons[id]" width="18" height="18" />
      <span class="text-black-2 fw-bold">{{ labels[id] }}</span>
    </div>
    <ProfileInput
      v-if="userStore.isModifying && id !== 1"
      :data="userStore.userModifyData[contents[id]]"
      :type="id ? 'number' : 'text'"
      @value-change="(data) => userStore.updateUserData(contents[id], data)"
    />
    <AddAlertButton :label="'한도'" v-else-if="id === 2 && !userStore.userData.expenseLimit" />
    <p class="text-black-1 fw-black" v-else>
      {{
        id === 2
          ? userStore.userData[contents[id]].toLocaleString()
          : userStore.userData[contents[id]]
      }}
      {{ id === 2 ? '&#8361' : '' }}
    </p>
    <hr
      class="bg-black-3"
      v-if="(!userStore.isModifying || id === 1) && (id !== 2 || userStore.userData.expenseLimit)"
    />
  </div>
</template>

<script setup>
import User from '@/assets/icons/mypage/mypage-user.png'
import Mail from '@/assets/icons/mypage/mypage-mail.png'
import Limit from '@/assets/icons/mypage/mypage-limit.png'

import { useUserStore } from '@/stores/useUserStore'
import ProfileInput from './ProfileInput.vue'
import AddAlertButton from './AddAlertButton.vue'

const { id } = defineProps({
  id: Number,
})

const userStore = useUserStore()

const icons = [User, Mail, Limit]
const labels = ['이름', '이메일 주소', '월간 지출 한도']
const contents = ['name', 'email', 'expenseLimit']
</script>

<style scoped>
.info-item {
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

hr {
  width: 100%;
  height: 1px;
  margin: 0;
  border: 0;
}

span {
  font-size: 14px;
}

p {
  font-size: 20px;
}
</style>
