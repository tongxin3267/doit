// 星期
const WEEK = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
}
const DATE = (function () {
  let obj = {}
  for(let i=1;i<29;i++){
    obj[i] = i+'号'
  }
  return obj
})()
const DAY = '次日'

const state = {
  rate: '',
  currentDay:'',
  lastTime: '',
  rang: '',
}

const getters = {
  rate: state => state.rate,
  rang: state => state.rang,
  currentDay: state => String(state.currentDay),
  lastTime: state => state.lastTime,
  handleCurrentDay: state => {
    if(state.rate==1){
      return DAY
    }
    if(state.rate==2){
      if(WEEK[state.currentDay]) {
        return WEEK[state.currentDay]
      }
      return WEEK[1]
    }
    if(state.rate==3){
      if( DATE[state.currentDay]) {
        return  DATE[state.currentDay]
      }
      return DATE[1]
    }
  },
  handleLastTime: state => {
    let str = String(state.lastTime)
    return str.slice(0, -2) + ':' + str.slice(-2,str.length)
  }
}

const mutations = {
  updateRate(state,rate) {
    state.rate = rate
  },
  updateCurrentDay(state,day){
    state.currentDay = day
  },
  updateLastTime(state,time) {
    state.lastTime = time
  },
  updateRang(state,rang) {
    state.rang = rang
  }
}

export default {
  state,
  getters,
  mutations,
}
