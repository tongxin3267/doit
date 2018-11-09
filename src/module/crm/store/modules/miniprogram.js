
const state = {
  showFlag: false
}
const mutations = {
  changeShowFlag(state, payload){
    state.showFlag = payload;
  }
}

export default {
  state, mutations
}