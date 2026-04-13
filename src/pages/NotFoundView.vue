<template>
  <section class="not-found-wrap">
    <div class="not-found-card box-default">
      <p class="error-code fw-black text-red-1">404</p>
      <h1 class="title fw-black text-black-1">페이지를 찾을 수 없어요</h1>
      <p class="desc fw-medium text-black-2">
        주소가 잘못되었거나, 요청한 페이지가 이동되었을 수 있어요.
      </p>

      <div class="action-group">
        <RouterLink to="/" class="orange-btn home-link">홈으로 가기</RouterLink>
        <button class="line-btn fw-bold" type="button" @click="goBack">이전 페이지</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.not-found-card {
  width: 100%;
  max-width: 520px;
  padding: 48px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  transform: translateY(-120px);
}

.error-code {
  margin: 0;
  font-size: 72px;
  line-height: 1;
}

.title {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
}

.desc {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.action-group {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.home-link {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  text-decoration: none;
}

.line-btn {
  height: 48px;
  padding: 0 20px;
  border: 1px solid var(--black-2);
  border-radius: 999px;
  background-color: transparent;
  color: var(--black-2);
  cursor: pointer;
}

@media (max-width: 768px) {
  .not-found-card {
    padding: 36px 24px;
  }

  .error-code {
    font-size: 56px;
  }

  .title {
    font-size: 26px;
  }

  .desc {
    font-size: 14px;
  }

  .action-group {
    width: 100%;
    flex-direction: column;
  }

  .line-btn,
  .home-link {
    width: 100%;
  }
}
</style>
