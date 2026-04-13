import axios from 'axios'
import { defineStore } from 'pinia'

const BASE_URL = 'http://localhost:3000/groups'

export const useGroupStore = defineStore('group', {
  state: () => ({
    currentGroup: {
      id: '',
      name: '',
      memberIds: [],
      targetAmount: 0,
    },
    runners: [],
    limitPosition: 0,
    maxRunner: {
      name: '',
      amount: 0,
    },

    minRunner: {
      name: '',
      amount: 0,
    },
    displayMax: 0,
    displayMin: 0,
  }),

  getters: {},

  actions: {
    // 그룹 관련 state 초기화
    resetGroupState() {
      this.currentGroup = {
        id: '',
        name: '',
        memberIds: [],
        targetAmount: 0,
      }
      this.runners = []
      this.limitPosition = 0
      this.maxRunner = {
        name: '',
        amount: 0,
      }
      this.minRunner = {
        name: '',
        amount: 0,
      }
      this.displayMax = 0
      this.displayMin = 0
    },

    // 그룹 정보 불러오기 groupStore.currentGroup으로 접근 가능
    async loadGroup(groupId) {
      try {
        const response = await axios.get(`${BASE_URL}/${groupId}`)
        this.currentGroup = response.data
        if (!this.currentGroup) {
          console.log('그룹 정보를 불러오지 못했습니다.')
          return
        }
      } catch (e) {
        console.error(e)
      }
    }, //loadGroup

    // 그룹 생성
    async addGroup(userId, groupName, targetAmount) {
      try {
        const response = await axios.post(BASE_URL, {
          name: groupName,
          targetAmount: targetAmount,
          memberIds: [userId],
        })
        this.currentGroup = response.data
      } catch (e) {
        console.error(e)
      }
    }, //addGroup

    // 그룹 참여
    async joinGroup(userId, groupId) {
      try {
        const response = await axios.get(`${BASE_URL}/${groupId}`)
        const groupData = response.data
        console.log('그룹 데이터:', groupData)

        if (groupData.memberIds.length >= 5) {
          alert('레이스 인원이 꽉 찼습니다.')
          return null
        }

        const result = await axios.patch(`${BASE_URL}/${groupId}`, {
          memberIds: [...groupData.memberIds, userId],
        })
        this.currentGroup = result.data

        return true
      } catch (e) {
        alert('존재하지 않는 레이스입니다. 레이스 코드를 확인해주세요.')
        return null
      }
    }, //joinGroup

    // 그룹 탈퇴
    async leaveGroup(userId, groupId) {
      try {
        const response = await axios.get(`${BASE_URL}/${groupId}`)
        const groupData = response.data
        const updatedMemberIds = groupData.memberIds.filter((id) => id !== userId)

        this.resetRunners()

        if (updatedMemberIds.length === 0) {
          await axios.delete(`${BASE_URL}/${groupId}`)
          this.resetGroupState()
          return
        }

        const result = await axios.patch(`${BASE_URL}/${groupId}`, { memberIds: updatedMemberIds })
        this.currentGroup = result.data
        this.runners = this.runners.filter((runner) => runner.userId !== userId)
      } catch (e) {
        console.error(e)
        return
      }
    }, //leaveGroup

    // 그룹 멤버들(Runners) 중 현재 그룹에서 가장 많이 쓴 사람을 maxRunner로, 가장 적게 쓴 사람을 minRunner로 저장
    calculateRunners() {
      if (this.runners.length === 0) {
        this.maxRunner = { name: '', amount: 0 }
        this.minRunner = { name: '', amount: 0 }
        return
      }

      let max = 0
      let min = 0
      let maxRunnerName = ''
      let minRunnerName = ''
      for (const runner of this.runners) {
        if (runner.amount > max) {
          max = runner.amount
          maxRunnerName = runner.name
        }
        if (runner.amount < min || min === 0) {
          min = runner.amount
          minRunnerName = runner.name
        }
      }
      this.maxRunner.amount = max
      this.minRunner.amount = min
      this.maxRunner.name = maxRunnerName
      this.minRunner.name = minRunnerName
    }, //calculateRunners

    // 화면용 최소/최대값 계산: 양쪽에 패딩을 주고 10000원 단위로 정리
    calculateDisplayRange() {
      const maxAmount = this.maxRunner.amount
      const minAmount = this.minRunner.amount

      if (this.runners.length === 0) {
        this.displayMin = 0
        this.displayMax = 0
        return
      }

      const unit = 10000

      if (maxAmount === minAmount) {
        this.displayMin = Math.max(0, Math.floor((minAmount - unit) / unit) * unit)
        this.displayMax = Math.ceil((maxAmount + unit) / unit) * unit
        return
      }

      const range = maxAmount - minAmount
      const padding = Math.max(unit, range * 0.15)

      this.displayMin = Math.max(0, Math.floor((minAmount - padding) / unit) * unit)
      this.displayMax = Math.ceil((maxAmount + padding) / unit) * unit
    }, //calculateDisplayRange

    // limitPosition 계산: 화면 표시용 범위를 기준으로 계산
    calculateLimitPosition() {
      const targetAmount = this.currentGroup.targetAmount
      const displayRange = this.displayMax - this.displayMin

      if (displayRange <= 0) {
        this.limitPosition = 0
        return
      }

      this.limitPosition = ((targetAmount - this.displayMin) / displayRange) * 100

      if (this.limitPosition > 100) {
        this.limitPosition = 100
      }
      if (this.limitPosition < 0) {
        this.limitPosition = 0
      }
    }, // calculateLimitPosition

    // runners 배열에 position 필드 업데이트 하는 method
    updateRunnersPosition() {
      const displayRange = this.displayMax - this.displayMin

      this.runners.forEach((runner) => {
        if (displayRange <= 0) {
          runner.position = 0
        } else {
          runner.position = ((runner.amount - this.displayMin) / displayRange) * 100
        }
      })
    }, //updateRunnersPosition

    // runners 배열에 danger 필드 업데이트 하는 method
    updateRunnersDanger() {
      const targetAmount = this.currentGroup.targetAmount
      this.runners.forEach((runner) => {
        runner.danger = runner.amount >= targetAmount
      })
    }, //updateRunnersDanger

    // runners 배열에 가져온 비용과 유저 정보를 합쳐서 runners initialize 하는 method
    setRunners(runnersExpenses, runnersInfo) {
      this.runners = runnersExpenses.map((expense) => {
        const info = runnersInfo.find((info) => info.userId === expense.userId)
        return {
          userId: expense.userId,
          amount: expense.amount,
          name: info ? info.name : '',
          profileImg: info ? info.profileImg : '',
          position: 0,
          danger: false,
        }
      })
    }, //setRunners

    // runners 배열 초기화 하는 method
    resetRunners() {
      this.runners = []
      this.maxRunner = { name: '', amount: 0 }
      this.minRunner = { name: '', amount: 0 }
      this.displayMax = 0
      this.displayMin = 0
      this.limitPosition = 0
    }, //resetRunners

    // runners의 모든 필드를 업데이트 하는 method
    getRunnersDetails(runnersExpenses, runnersInfo) {
      this.setRunners(runnersExpenses, runnersInfo)
      this.calculateRunners()
      this.calculateDisplayRange()
      this.calculateLimitPosition()
      this.updateRunnersPosition()
      this.updateRunnersDanger()
    }, //getRunnersDetails
  },
})
