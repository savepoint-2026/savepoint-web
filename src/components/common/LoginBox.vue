<template>
  <div class="box-default container">
    <div class="title-box">
      <p class="title fw-black text-black-1">로그인</p>
      <p class="subtitle fw-regular text-black-2">우리 함께 $AVE POINT 해 볼까요?</p>
    </div>
    <div class="input-box">
      <InputBox
        :label="'ID'"
        :label-width="20"
        :type="'text'"
        :data="id"
        @value-change="(data) => (id = data)"
      />
      <InputBox
        :label="'PW'"
        :label-width="20"
        :type="'password'"
        :data="pw"
        @value-change="(data) => (pw = data)"
      />
    </div>
    <button class="orange-btn" @click="onClickLogin">
      <img :src="Check" width="18" height="18" />
      <span class="fw-black">로그인</span>
    </button>
  </div>
</template>

<script setup>
import Check from '@/assets/icons/check.png'
import InputBox from './InputBox.vue'

import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()

const id = ref('')
const pw = ref('')

const authStore = useAuthStore()

const onClickLogin = () => {
  const url = `/api/users?email=${id.value}&password=${pw.value}`

  axios
    .get(url, { timeout: 900 })
    .then((response) => {
      id.value = ''
      pw.value = ''

      if (response.data.length == 0) {
        window.alert('아이디 또는 비밀번호가 올바르지 않습니다.')
        throw new Error('아이디 또는 비밀번호가 올바르지 않습니다')
      }

      return response.data[0]
    })
    .then((data) => {
      authStore.login(data.id)
      router.push('/')
    })
    .catch((e) => {
      console.log(e)
    })
}
</script>

<style scoped>
.container {
  width: 404px;
  height: 351px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 32px;
  justify-content: space-between;
}

.title-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title {
  font-size: 20px;
}

.subtitle {
  font-size: 14px;
}

button {
  align-self: center;
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
}

span {
  font-size: 14px;
}

.input-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
