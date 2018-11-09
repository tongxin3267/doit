import axios from 'axios'

 const state = {
   title:'请选择可处理的节点',
   showNodeMask: false,
   ListName:{
     title:'',
     personName:'',
     headPic:'',
     createTime:''
   },
   NodeList:[],
   detailData:null
 }


const mutations = {
  resetSelectNodeData (state){                                                 //重置数据
    state.title = '请选择可处理的节点'
    state.showNodeMask = false
    state.ListName = {
      title:'',
      personName:'',
      headPic:'',
      createTime:''
    }
    state.NodeList.length = 0
    state.detailData = null
  },
  updateShowNodeMask (state,payload){                                             //更新显示隐藏弹窗
    state.showNodeMask = payload
  },
  updateListName (state,payload){                                                 //更新弹窗头部提单人信息
    state.detailData = Object.assign({},payload)
    if(payload.detail){
      state.ListName = Object.assign({},payload.detail)
    }
  },
  updateNodeList (state,payload){                                                //更新节点列表
    state.NodeList.length = 0
    state.showNodeMask = true
    state.NodeList.push(...payload)
  }
}

const actions = {
  getNodeListInfo ({commit},{...data}) {
    let {callback,...refId}=data
    _.showLoading();
    axios.post(_.baseURL + '/portal/flow/flowParallel/ajaxGetTodoNodeInfo.do', {
      ...refId
    }).then(function (result) {
      _.hideLoading();
      if (result.code === '0') {
        let nodeList=result.data.nodeList
        if(nodeList && nodeList.length>1){
          commit('updateNodeList',nodeList)
        } else {
          callback(nodeList)
        }
      } else {
        _.alert('提示', result.desc);
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
