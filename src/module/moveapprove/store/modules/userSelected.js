import axios from 'axios'
const USERCONFIG = {
  user:{id: 'userId', name: 'personName',headpic:'headPic',type:'user'},
  deptManager:{id: 'userId', name: 'personName',headpic:'headPic',type:'user',group:true,groupTitle:'departmentName'},
  dept:{id: 'id', name: 'departmentName',headpic:'headPic',type:'dept'},
}
const DeptConfig = {
  "isCanDelete":false,
  "isCanEdit": true,
  "checkedType": "radio",
}
const UserConfig = {
  "isCanDelete":true,
  "isCanEdit": true,
  "checkedType": "checkbox",
}
const DefaultFlowAuditUser = {
  "show": true,
  // "config": USERCONFIG.user,
  "assignRange":false,
  "selectType": USERCONFIG.user,   // 选人类型
  "flowUserList":[],  // 选人范围
  "userSelected":[],  // 已选的人
  ...UserConfig,
}
const updateArray = (data,arr) => {
  data.length=0
  data.push(...arr)
}
const state = {
  "FlowAuditUserBoxShow": false,    // 选择处理人弹窗
  "nextNodeListShow": false,    // 节点处理人弹窗
  "FlowAuditUser":[{
    startAuditList: DefaultFlowAuditUser
  }],
  "ccPersonList":[],    // 相关人
  "appointNodeAndUserVOList":[],    // 其它节点列表
  "nextNodeList":[],    // 下个节点列表
  "flowChioseNodeAuditUser":[],
  "flowChioseNodeAuditUserJson":[],
  'nextNodeId':'',
  'parallelNextNodeIds':'',
  'currentNodeId': '',
  'flowId': '',
  'flowList': [],
  'choosedNodeName': '',
  'appointUserIndex':0,      // 用户当前选择处理人的第几个节点
  'choiseFlowUserJson': '',
  'flowDpIdJson': '',
}

const getters = {
// 已选择的处理人id
  FlowAuditUserIds:(state)=>(index)=>{
    let ids=[]
    let checked = state.FlowAuditUser[index].startAuditList.userSelected
    // 如果用户有选择
    if(checked && checked.length) {
      // 如果是选择部门负责人
      if(state.FlowAuditUser[index].startAuditList.selectType.type==='dept'){
        ids=checked[0].deptId
      }
      // 如果是选择分组负责人
      if(state.FlowAuditUser[index].startAuditList.selectType.group && state.FlowAuditUser[index].startAuditList.selectType.type==='user'){
        ids=checked.map(item=>checked[0].deptId + item[state.FlowAuditUser[index].startAuditList.selectType.id])
      }
      if(!state.FlowAuditUser[index].startAuditList.selectType.group && state.FlowAuditUser[index].startAuditList.selectType.type==='user'){
        ids=checked.map(item=>item[state.FlowAuditUser[index].startAuditList.selectType.id])
      }
    }
    return ids
  },
}

const mutations = {
  // 更新处理人
  updateFlowAuditUser(state,payload) {
    updateArray(state.FlowAuditUser,payload)
  },
  // 重置处理人信息
  resetFlowAuditUser(state,payload) {
    state.FlowAuditUser.length=0
    state.FlowAuditUser.push({
      startAuditList:DefaultFlowAuditUser
    })
  },
  clearFlowAuditUser(state,payload) {
    state.FlowAuditUser.length=0
  },
  // 更新选人列表 {index:Number,data:Array}
  updateFlowUser(state,payload) {
    updateArray(state.FlowAuditUser.flowUserList,payload)
  },
  // 更新已选人
  updateUserSelected(state,payload) {
    updateArray(state.FlowAuditUser[state.appointUserIndex].startAuditList.userSelected,payload)
  },
  // 删除处理人
  removeFlowAuditUser(state,payload) {
    // index
    state.FlowAuditUser[payload.index].startAuditList.userSelected.splice(payload.delUserIndex,1)
  },
  // 更新相关人
  updateCCPerson(state,payload) {
    updateArray(state.ccPersonList,payload)
    Object.assign(state.ccPersonList,payload)
  },
  // 删除相关人
  removeCCPerson(state,payload) {
    state.ccPersonList.splice(payload.index,1)
  },
  // 更新节点列表
  updateAppointNodeVOList(state,payload) {
    updateArray(state.appointNodeAndUserVOList,payload)
    state.flowChioseNodeAuditUser.length = payload.length
  },
  // 由上一个节点已选择的处理人
  updateFlowChioseNodeAuditUser(state,payload) {
    state.appointNodeAndUserVOList.forEach((value,index) => {
      if(value.nodeAudtiUserList) {
        state.flowChioseNodeAuditUser.splice(index,1, value.nodeAudtiUserList)
      }
    })
  },
  // 更新下个节点列表
  updateNextNodeList(state,payload) {
    updateArray(state.nextNodeList,payload)
  },
  // 更新state 非引用类型的值
  updateUserSelectedData(state,payload) {
    state[payload.type] = payload.data
  },
  // 更新第index 的数据
  updateChooiseNodeAuditUser(state,payload) {
    state.flowChioseNodeAuditUser.splice(payload.index,1,payload.data)
  },
  // 删除已选处理人
  removeChioseNodeUser(state,payload){
    state.flowChioseNodeAuditUser[payload.parentIndex].splice(payload.index,1)
  },
  // 更新flowList
  updateFlowList(state,payload){
    updateArray(state.flowList,payload)
  },
  // 保存节点的选人信息
  saveNodeAuditUserJson(state) {
    let json = []
    state.appointNodeAndUserVOList.forEach((value,index)=>{
      let obj = {}
      let users = state.flowChioseNodeAuditUser[index]
      if(!users) return;
      obj.nodeId = value.nodeId
      let ids = users.map((value)=>{
        return value.userId
      })
      obj.auditUserIds = ids.join('|')
      json.push(obj)
    })
    updateArray(state.flowChioseNodeAuditUserJson,json)
    state.nextNodeListShow = false
  },
  saveChoiseFlowUserJson(state){
    let choiseFlowUserJson = {}
    let flowDpIdJson = {}
    state.FlowAuditUser.forEach(function(value){
      let users = value.startAuditList.userSelected
      if(!users) return;
      // 允许上个节点指定处理人
      if (value.isChoise == "0" || value.isChoise == "2") {
        let ids = users.map((value)=>{
          return value.userId
        })
        if (value.isBranchNode!=undefined && !value.isBranchNode) {
          choiseFlowUserJson[value.vo.defaultNextNodeId] = ids.join('|')
        } else {
          choiseFlowUserJson[value.nodeId] = ids.join('|')
        }
      }
      // 多部门
      if (value.audtiFlag == "2") {
        if (value.isBranchNode!=undefined && !value.isBranchNode) {
          flowDpIdJson[value.vo.defaultNextNodeId] = value.startAuditList.userSelected[0].deptId
        } else {
          flowDpIdJson[value.nodeId] = value.startAuditList.userSelected[0].deptId
        }
      }
    })
    if (JSON.stringify(choiseFlowUserJson) != "{}") {
      state.choiseFlowUserJson = JSON.stringify(choiseFlowUserJson)
    }
    if (JSON.stringify(flowDpIdJson) != "{}") {
      state.flowDpIdJson = JSON.stringify(flowDpIdJson)
    }
  },
  resetFlowData(state){
    state.FlowAuditUserBoxShow = false
    state.nextNodeListShow = false
    state.ccPersonList.length = 0
    state.appointNodeAndUserVOList.length = 0
    state.nextNodeList.length = 0
    state.flowChioseNodeAuditUser.length = 0
    state.flowChioseNodeAuditUserJson.length = 0
    state.nextNodeId = ""
    state.parallelNextNodeIds = ""
    state.currentNodeId = ""
    state.flowId = ""
    state.flowList.length = 0
    state.choosedNodeName = ""
    state.appointUserIndex = 0
    state.choiseFlowUserJson = ""
    state.flowDpIdJson = ""
    state.ccPersonList.length=0
    state.FlowAuditUser.length=0
    state.FlowAuditUser.push({
      startAuditList:DefaultFlowAuditUser
    })
    state.FlowAuditUser[0].startAuditList.userSelected.splice(0);
  }
}
const actions = {
  // 获取部门负责人
  updateFlowUserSelected({commit},payload){
    if(payload.selectType==='dept'){
      axios.post(_.baseURL+'/portal/flow/flowAction!getFlowUserReceive.action',{
        dpId:payload.ids
      }).then((result)=>{
        if(result.code==="0"){
          commit('updateUserSelected',result.data.userList)
        }else {
          _.alert('', result.desc)
        }
      })
    }else {
      commit('updateUserSelected', payload.result)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
