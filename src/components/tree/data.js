const getDefaultState = () => {
  return  {
    config: {},               // 配置
    options: [],              // 列表数据
    renderData: {},           // { '父级ID': [子级数据] }
    selectValue: [],          // 当前已选的数据
    currentSelected: [],      // 先前选择的数据，点击“取消”时返回
    currentParentId: '',      // 当前列表的父Id
    prevParentId: [],         // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
  }
}
const DEFAULTCONFIG = {
  config: {},               // 配置
  options: [],              // 列表数据
  renderData: {},           // { '父级ID': [子级数据] }
  selectValue: [],          // 当前已选的数据
  currentSelected: [],      // 先前选择的数据，点击“取消”时返回
  currentParentId: '',      // 当前列表的父Id
  prevParentId: [],         // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
}

const state = {
  ...DEFAULTCONFIG
}

const getters = {
  selectName(state) {
    if(state.config.checkType==='radio' && state.selectValue.length>0) {
      return '1 个'
    }
    return state.selectValue.length + '个'
  },
}

const mutations = {
  // 修改配置
  changeConfig(state, payload) {
    state.config = Object.assign({}, payload)
  },
  // 修改已选择的数据
  updateSelectValue(state, value) {
    state.selectValue = value

  },
  // 请求列表数据时，做修改
  handleGetData(state, result) {
    state.options.push(...result)
    state.currentParentId = result[0][state.config.parentId]
    if(!state.renderData[state.currentParentId]) {
      state.renderData[state.currentParentId]=[...state.options]
    }else {
      state.renderData[state.currentParentId].push(...result)
    }
  },
  // 滚动加载后，继续添加对应的 renderData 数据
  handleRenderData(state, result) {

  },
  // 点击下一级前修改 prevParentId
  handlePrevParentId(state) {
    state.prevParentId.push(state.currentParentId)
  },
  // 点击下一级后修改的数据
  handleGetNextItem(state, {result,option}) {
    state.options=[...result]
    state.currentParentId = option[state.config.id]
    state.renderData[state.currentParentId]=[]
    state.renderData[state.currentParentId].push(...result)
  },
  // 点击取消时，返回未修改前的数据
  handleCancelSelected(state) {
    let ids = state.currentSelected.map(value => value[state.config.id])
    if(state.config.checkType==='radio') {
      state.selectValue = ids[0]
    }else {
      state.selectValue = ids
    }
  },
  // 点击确定时，返回已选的数据
  handleConfirmSelected(state) {
    let options = [];
    Object.values(state.renderData).forEach(value => {
      options = options.concat(value)
    })
    let items = options.filter(value => {
      if(state.config.checkType==='radio') {
        return state.selectValue===value[state.config.id]
      }else {
        return state.selectValue.indexOf(value[state.config.id])>-1
      }
    })
    state.currentSelected.splice(0)
    state.currentSelected.push(...items)
  },
  // 点击返回上一级时，修改 prevParentId、currentParentId 和 列表数据
  // payload:Object类型，可后期拓展。isResetData:Boolean,默认为true，重新请求，重置数据
  handleReturnBack(state,payload={isResetData:true}){
    state.currentParentId = state.prevParentId.pop()
    if(payload.isResetData) {
      state.options.splice(0)
      state.renderData=Object.assign({},{})
    }else {
      state.options = [...state.renderData[state.currentParentId]]
    }
  },
  // 重置成默认数据
  resetTreeConfigData(state) {
    Object.assign(state,getDefaultState())
  }
}

export default {
  state,
  getters,
  mutations
}
