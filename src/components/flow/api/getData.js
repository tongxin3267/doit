/**
 * Created by Administrator on 2018/4/13.
 */
import axios from 'axios';
// 选人类型
const USERCONFIG = {
  user:{id: 'userId', name: 'personName',headpic:'headPic',type:'user'},
  deptManager:{id: 'userId', name: 'personName',headpic:'headPic',type:'user',group:true,groupTitle:'departmentName'},
  dept:{id: 'id', name: 'departmentName',headpic:'headPic',type:'dept',checkedType:'radio'},
};

function audit_flow_api(){

}
audit_flow_api.prototype={

  //是否并行节点
  initData:{
    isStartParallelNode:false,
    isEndParallelNode:false,
    refId:""//审批单id
  },
  //默认流程配置
  initFlowData:{},
  //数据初始化验证
  initCheck(config){
    this.initData.isStartParallelNode = false;
    this.initData.isEndParallelNode = false
    this.initData.refId="";
    this.initFlowData={
      isBranchFlow:config.isBranchFlow?config.isBranchFlow:config.isFreeFlow=="3"?true:false,        //是否分支流程，true:是
      isBranchNode:config && config.isBranchNode==true? true:false,
      templateRefId:"",      //模板ID
      flowId:config && config.flowId? config.flowId:"",            //流程ID
      currentNodeId:config && config.currentNodeId? config.currentNodeId:"",  //当前节点ID
      nextNodeId:"",     //下一节点ID
      definitionId:config && config.definitionId? config.definitionId:"",  //超表详情ID
      parallelCurrentNodeId:"",//下一个节点是并行开始节点
      parallelNextNodeIds:"",   //开始并行的下一节点集合
      flowList:[],            //固定流程列表
      nextNodeList:[],      //节点下拉选择列表
      appointNodeAndUserVOList:config && config.appointNodeAndUserVOList? config.appointNodeAndUserVOList:[],     //节点审核人列表
	  firstFieldControlList:[],      //表单
      nodeInfo:[],
    };
  },
  //获取节点信息参数
  initCheckParams(){
    //初始化参数
    var initParams={
      definitionId:this.initFlowData.definitionId,
      id:this.initData.refId,
      flowId:this.initFlowData.flowId,
      currentNodeId:this.initFlowData.currentNodeId,
      nextNodeId:this.initFlowData.nextNodeId,
      parallelNextNodeIds:this.initFlowData.parallelNextNodeIds,
      isBranchFlow:this.initFlowData.isBranchFlow,
    };
    return initParams;
  },
  //① 新建页面

  // 获取第一个节点的信息和流程列表
  // 必配入参{ id:"模板id",agentCode：" ",isBranchFlow:"是否分支，true|false"
  // config配置:isFreeFlow流程类型， ccList相关人,templateRefId实例id,编辑、复制页面还需要传：toList
  searchFlowList(data,config,callBack){
    if(config && config.isFreeFlow!=null && config.isFreeFlow!=undefined && config.isFreeFlow!="1"){
      //初始化数据
      this.initCheck(config);
      var self=this;
      _.showLoading();
      axios.post(_.baseURL+'/portal/flow/flowAction!ajaxSearchFlowList.action',{
        ...data
      }).then(function (result) {
        if(result.code==='0'){
          var data=result.data;
          if(data.list && data.list.length>0){
          	if(data.firstFieldControlList && data.firstFieldControlList.length>0){
				self.initFlowData.firstFieldControlList.push(...data.firstFieldControlList)
			}
            self.initFlowData.isBranchFlow? self.branchFlowCheck(data,callBack):self.noBranchFlowCheck(data,callBack);
          }else{
            _.hideLoading();
            _.alert('提示',"没找到可用的流程，请联系管理员");
          }
        }else {
          _.hideLoading();
          _.alert('提示',result.desc);
        }
      })
    }
  },

  //分支流程相关人
  branchFlowCheck(data,callBack){
    this.initFlowData.flowId=data.list[0].id;//流程id
    this.initFlowData.currentNodeId=data.branchNodeInfo.nodeId;//记录当前节点id
    this.initFlowData.isBranchNode=data.branchNodeInfo.havaBranch? true:false;
    //不存在流程信息
    if(data.branchNodeInfo.havaBranch!="1"){
      this.initFlowData.nextNodeId=data.branchNodeInfo.defaultNextNodeId;
      //配置入参,请求节点信息
      this.getFlowAuditUser(this.initCheckParams(),callBack);
    }else{
      if(data.branchNodeInfo.defaultNextNodeId){
        this.initData.isStartParallelNode=true;
        this.initFlowData.parallelCurrentNodeId=data.branchNodeInfo.defaultNextNodeId;
      }
      _.hideLoading();
      callBack(this.initFlowData);
    }
  },
  //固定流程相关人、流程列表
  noBranchFlowCheck(data,callBack){
      this.initFlowData.flowList.push(...data.list);
      if(data.list.length==1){
        this.initFlowData.flowId=data.list[0].id;//记录流程id
        //配置入参,请求节点信息
        this.getFlowAuditUser(this.initCheckParams(),callBack);
      }else{
        _.hideLoading();
        callBack(this.initFlowData);
      }
  },

  // 获取下一节点信息
  // 必配入参{ initRefId:"审批单的Id,新建为空"，templateRefId："模板id",currentNodeId："当前节点"
  findBranchFlowNextNodeInfo(data,callBack){
    var self=this;
    _.showLoading();
    axios.post(_.baseURL+'/portal/flow/flowBranchAction!findBranchFlowNextNodeInfo.action',{
      ...data
    }).then(function (result) {
      if(result.code==='0'){
        var nextNodeList=result.data.nextNodeList;
        if(nextNodeList && nextNodeList.length>0) {
          self.setInitRefIdCheck(data);
          self.initFlowData.nextNodeList=[...nextNodeList];
          //当只有一个节点且这个节点为结束节点时直接提交
          if (nextNodeList.length==1 && nextNodeList[0].nodeStatus=="2") {
              _.hideLoading();
            if(self.initData.isEndParallelNode){
              self.initFlowData.parallelNextNodeIds=nextNodeList[0].id;
            }else{
              self.initFlowData.nextNodeId=nextNodeList[0].id;
            }
            callBack(self.initFlowData);
            return;
          } else {
            self.initFlowData.parallelNextNodeIds = ""
            self.initFlowData.nextNodeId = nextNodeList[0].id;
            //新建单分支下一节点是并行开始
            if((nextNodeList[0].nodeStatus=="3" && nextNodeList[0].ext1!="2")){
              self.initFlowData.parallelNextNodeIds=self.setParallelNextNodeIds(nextNodeList[0].nextNodeList);
            }

            //新建、详情页面下一节点是并行开始或并行结束
            if(self.initData.isStartParallelNode || self.initData.isEndParallelNode){
              _.hideLoading();
              self.initFlowData.parallelNextNodeIds=nextNodeList.map(value=>{
                return value.id
              }).join(',');
              self.initFlowData.nextNodeList.length=0;
              self.initFlowData.nextNodeId = self.initFlowData.parallelCurrentNodeId;
            }
            //查询审批用户信息接口
            self.getFlowAuditUser(self.initCheckParams(),callBack);
          }
        }else{
          _.hideLoading();
          _.alert('提示',"没有找到相应的节点信息,请联系管理员");
        }
      }else {
        _.hideLoading();
        _.alert('提示',result.desc);
      }
    })
  },
  //配置当前节点id,initRefId
  setInitRefIdCheck(data){
    this.initFlowData.templateRefId = data.templateRefId? data.templateRefId:"";
    this.initFlowData.definitionId = data.initRefId? '':this.initFlowData.templateRefId;
    this.initFlowData.isBranchFlow=true;
  },
  //设置并行后的节点id字符串
  setParallelNextNodeIds(nextNodeList){
    var parallelNextNodeIds="";
    if(nextNodeList && nextNodeList.length>0){
      for(var i=0;i<nextNodeList.length;i++){
        parallelNextNodeIds+=nextNodeList[i].id+",";
      }
      parallelNextNodeIds=parallelNextNodeIds.substring(0,parallelNextNodeIds.lastIndexOf(","));
    }
    return parallelNextNodeIds;
  },

  // 获取审核人节点信息
  // 固定\分支必配入参{definitionId:"超级表单关联id", id:"审批单id",flowId:"流程id",currentNodeId："当前节点",nextNodeId:"下一节点",isBranchFlow:"是否分支流程，true|false"
  //并行需要多传一个参数：parallelNextNodeIds：开始并行的下面的全部节点ID
  getFlowAuditUser(data,callBack){
    if(data && callBack){
      var self=this;
      //记录流程ID
      _.showLoading();
      axios.post(_.baseURL+'/portal/flow/flowParallel/ajaxGetFlowAuditUser.do',{
        ...data
      }).then(function (result) {
        if(result.code==='0'){
          //记录流程id、当前节点、id下一节点id、记录是否并行开始的全部节点id
          self.resetFlowAuditData(data);

          //表单字段
	      if(data.firstFieldControlList && data.firstFieldControlList.length>0){
				self.initFlowData.firstFieldControlList.push(...data.firstFieldControlList)
		  }
          //添加可自由选择的处理人
          if(result.data.appointNodeAndUserVOList && result.data.appointNodeAndUserVOList.length>0){
            self.initFlowData.appointNodeAndUserVOList.push(...result.data.appointNodeAndUserVOList);
          }
          self.branchFlowAuditUserConfig(result.data,callBack);
        }else {
          _.hideLoading();
          _.alert('提示',result.desc)
        }
      })
    }else{
      console.log("获取审核人节点信息失败");
    }
  },
  //重置返回的数据
  resetFlowAuditData(data){
    this.initFlowData.flowId=data.flowId;
    this.initFlowData.currentNodeId=data.currentNodeId;
    this.initFlowData.nextNodeId=data.nextNodeId;
    this.initFlowData.parallelNextNodeIds=data.parallelNextNodeIds? data.parallelNextNodeIds:"";
    this.initFlowData.appointNodeAndUserVOList.length=0;
    this.initFlowData.nodeInfo.length=0;
  },
  //处理分支流程的自由选择、下拉列表、审核人列表, 固定流程的自由选择列表和审核人列表
  branchFlowAuditUserConfig(data,callBack){
    if(data.nodeInfo && data.nodeInfo.length>0){
      var nodeInfoArrList=[];
        for(var i=0;i<data.nodeInfo.length;i++) {
          var startAuditList=this.checkFlowAuditUser(data.nodeInfo[i],'startAuditList');
          if(startAuditList){
            data.nodeInfo[i].startAuditList=Object.assign({},startAuditList);
            nodeInfoArrList.push(data.nodeInfo[i]);
          }
        }
      if(nodeInfoArrList.length>0){
        var self=this;
        var needRequestTime=0;//需要请求部门次数
        var hasRequestTime=0;//已经请求部门次数
        var hasDept=false;//存在部门查询
        nodeInfoArrList.forEach(function(value,index){
          if(nodeInfoArrList[index].isChoise=="1" && nodeInfoArrList[index].audtiFlag=="2"){
            //请求部门列表
            var msg={
              nextNodeId:nodeInfoArrList[index].nodeId,
              isBranchFlow: self.initFlowData.isBranchFlow,
              flowId:self.initFlowData.flowId,
              id:self.initData.refId,
            };
            hasDept=true;
            needRequestTime++;
            var department=null;
            self.requestDeptList(msg).then(function (result) {
              if (result.code === '0') {
                department=result.data;
              } else {
                _.alert('提示', result.desc);
              }
            }).then(function(){
              if(department && department.departmentList && department.departmentList.length>0){
                nodeInfoArrList[index].startAuditList.flowUserList.push(department.departmentList);
              }else{
                console.log("部门数据为空");
              }
              hasRequestTime++;
              if(needRequestTime==hasRequestTime){
                _.hideLoading();
                self.initFlowData.nodeInfo.push(...nodeInfoArrList);
                callBack(self.initFlowData);
              }
            });
          }
        });
        if(!hasDept){
          _.hideLoading();
          self.initFlowData.nodeInfo.push(...nodeInfoArrList);
          callBack(self.initFlowData);
        }
      }else{
        _.hideLoading();
        callBack(this.initFlowData);
      }
    }else{
      _.hideLoading();
      _.alert("提示","没有找到下一节点的信息,请联系管理员");
    }
  },

  //处理人结构逻辑判断
  checkFlowAuditUser(data,type){
    var startAuditList=null;
    if(data.nodeHandleType!="5" || type=="nextAuditList"){
      startAuditList = {
        "show":true,
        "selectType": USERCONFIG.user,  //默认选的是人员
        "userSelected": [],
        "allUser":[],
        "flowUserList": [],
        "assignRange": true,
        "isCanEdit":true,
        "isCanDelete":true,
		"flowNodeItemKeys":''
      };
      if(data.audtiFlag!="3"){
      	if(data.flowNodeItemKeys){
          startAuditList.flowNodeItemKeys = data.flowNodeItemKeys;
          //将人员控件所选的所有人赋值给编辑弹窗
          startAuditList.flowUserList.push(startAuditList.allUser);
          startAuditList.defaultAllSelect = true; //默认全选
          let isChoise = data.isChoise;
          // 允许上个节点指定处理人
          if(isChoise == "0" || isChoise == "2"){
            startAuditList.isCanDelete = true;
            startAuditList.isCanEdit = true;
          }else{
            startAuditList.isCanDelete = false;
            startAuditList.isCanEdit = false;
          }
				}else{
      		switch (data.isChoise){
						case "0":
							// "0":"1 单部门":"人员，默认全选"
							data.alreadyChoiseList && data.alreadyChoiseList.length>0?
								startAuditList.userSelected.push(...data.alreadyChoiseList):
								startAuditList.userSelected.push(...data[type]);
							startAuditList.flowUserList.push(data[type]);
							startAuditList.defaultAllSelect = true; //默认全选
							break;
						case "2":
							// "2":"1 单部门":"人员，默认不全选"
							// "2","2 多部门":部门负责人
							data.alreadyChoiseList && data.alreadyChoiseList.length>0?
								startAuditList.userSelected.push(...data.alreadyChoiseList):"";
							if(data.audtiFlag == "1"){
								startAuditList.flowUserList.push(data[type]);
								startAuditList.defaultAllSelect = true; //默认全选
							} else if (data.audtiFlag == "2") {
								startAuditList.selectType = USERCONFIG.deptManager;
								var departmentName="",arr=[];
								for(var i=0;i<data[type].length;i++){
									if(i==0){
										departmentName=data[type][i].departmentName;
									}else if(departmentName!=data[type][i].departmentName){
										startAuditList.flowUserList.push(arr);
										departmentName=data[type][i].departmentName;
										arr=[];
									}
									arr.push(data[type][i]);
								}
								startAuditList.flowUserList.push(arr);
							}
							break;
						case "1":
							// 不可选，"1":"1 单部门":人员
							// "1":"2 多部门":部门
							if (data.audtiFlag == "1") {
								if(data[type].length==0 && data.nodeName){
									const noAuditUser={
										"startAuditList":"节点【" + data.nodeName + "】处理人为空",
									};
									_.alert("提示", noAuditUser[type]);
								}
								startAuditList.userSelected.push(...data[type]);
								startAuditList.isCanDelete = false;
								startAuditList.isCanEdit =false;
							} else if (data.audtiFlag == "2") { //选择部门
								startAuditList.selectType = USERCONFIG.dept;
								startAuditList.isCanDelete = false;
								if(type=="nextAuditList"){
									var msg={
										nextNodeId:this.initFlowData.nextNodeId,
										isBranchFlow: this.initFlowData.isBranchFlow,
										flowId:this.initFlowData.flowId,
										id:this.initData.refId,
									};
									this.requestDeptList(msg).then(function (result) {
										if (result.code === '0') {
											startAuditList.flowUserList.push(result.data.departmentList);
										} else {
											_.alert('提示', result.desc);
										}
									})
								}
							}
							break;
					}
				}

      }else{
        _.alert("提示", "你所在的部门暂无设置直接负责人,请联系后台管理员");
      }
    }
    return startAuditList;
  },

  //请求部门列表
  requestDeptList(data){
    return axios.post(_.baseURL+'/portal/flow/flowAction!getDepartmentInfo.action',{
      ...data
    });
  },

// ② 详情页面
  //移动审批自由流程状态判断
  statusCheckFree(creatorId,status,isOver){
    if(creatorId!=_.userId){
      let statusObj={
        "-1":"已关闭",
        "0":"退审",
      };
      if(statusObj[isOver]){
        return statusObj[isOver];
      }else if(status=="2"){
        return "已审批";
      }else{
        return "审批中";
      }
    }else{
      let statusObj={
        "-2":"已结束",
        "2":"已审批",
      };
      let isOverObj={
        "-1":"已关闭",
        "0":"退审",
        "1":"已审批"
      };
      if(isOverObj[isOver]){
        return isOverObj[isOver];
      }else if(statusObj[status]){
        return statusObj[status];
      }else{
        return "审批中";
      }
    }
  },
  //固定流程和分支流程的审批状态判断
  statusCheck(creatorId,status,isOver){
    var statusObj={
      "-1":"已结束",
      "0":"已审批",
    };
    var isOverObj={
      "-1":"已关闭",
      "0":"退审",
      "1":"已审批"
    };
    if(statusObj[status]){
      return statusObj[status];
    }
    if(creatorId!=_.userId) {
      if (isOverObj[isOver]) {
        return isOverObj[isOver];
      }
      if (status == "2") {
        return "已结束";
      }
      if (status != "2" && isOver != "0") {
        return "审批中";
      }
    }
    return "";
    // }else{
    //   if(isOver!="1" && isOver!="3" && isAlreadyAudit && isAlreadyAudit>0){
    //     return "审批中";
    //   }
    // }
  },
	//表单的固定流程和分支流程的审批状态判断
	statusFormCheck(creatorId,status,isOver,isClose){

		//status 0草稿，1提交
		//isover 固定流程和分支流程用 -1 关闭 ，0退审，1全部审核通过，2流转中
		//isClose 任务单和自由流程判断用：1是关闭，0没关闭
		// if(isClose == 1){
  		// 	return "已结束";
		// }

		var isOverObj={
			"-1":"已关闭",
			"0":"退审",
			"1":"已审批",
			"2":"审批中"
		};
		if(isOverObj[isOver]){
			return isOverObj[isOver];
		}
		return "";
	},


  // 当前处理人、下一节点处理人、节点信息、流转明细
  // 必配入参{definitionId:"",id:"审批单的id",nodeId："当前节点",isBranch:"是否分支，true|false"
  getFlowAuditDetail(data,callBack){
    var self=this;
    axios.post(_.baseURL+'/portal/flow/flowParallel/ajaxGetFlowAudit.do',{
      ...data
    }).then(function (result) {
      if(result.code==='0'){
        var resultData=result.data.data[0];
        if(!resultData){
          return
        }
        var config={
          isBranchFlow:data.isBranch!=undefined? data.isBranch:"",
          isBranchNode:resultData.isBranchNode!=undefined? resultData.isBranchNode:"",
          definitionId:data.definitionId!=undefined? data.definitionId:"",
          flowId:resultData.vo && resultData.vo.flowId? resultData.vo.flowId:"",
          currentNodeId:data.nodeId? data.nodeId:"",
        };
        resultData.appointNodeAndUserVOList? config.appointNodeAndUserVOList=resultData.appointNodeAndUserVOList:"";
        self.initCheck(config);
        self.initData.refId=data.refId;//审批单id

        //下一节点是并行开始或并行结束
        if(resultData.vo){
          self.initFlowData.nextNodeId = resultData.vo.defaultNextNodeId;
          if(config.isBranchNode && resultData.vo.defaultNextNodeId){
            self.initData.isEndParallelNode=true;
            self.initFlowData.parallelCurrentNodeId = resultData.vo.defaultNextNodeId
          }
        }

        let nodeInfo = []
        for(let i=0;i<result.data.data.length;i++){
          var startAuditList=self.checkFlowAuditUser(result.data.data[i],'nextAuditList');
          if(startAuditList){
            result.data.data[i].startAuditList=Object.assign({},startAuditList);
            nodeInfo.push(result.data.data[i]);
          }
        }
        result.data.nodeInfo = nodeInfo;
        callBack(result.data);
      }else{
        _.alert('提示',result.desc)
      }
    })
  },
  //流转明细
  getParallelFlowSerial(data, flowSerial, callBack) {
    if (flowSerial.isFirstRequest) {
      axios.post(_.baseURL + '/portal/flow/flowParallel/getParallelFlowSerial.do', {
        ...data
      }).then(function (result) {
        if (result.code == '0') {
          if (result.data.auditSerial.length > 0) {
            flowSerial.list = result.data.auditSerial;
            flowSerial.isShowFlowSerial = true;
            flowSerial.isFirstRequest = false;
            callBack(flowSerial);
          }
        } else {
          _.alert('提示', result.desc);
        }
      })
    } else {
      flowSerial.isShowFlowSerial = true;
      callBack(flowSerial);
    }
  },
  //查看流程节点
  showFlowNode(flowId,callback) {
    axios.post(_.baseURL + '/portal/flow/flowAction!findFlowNodeList.action', {
      flowId: flowId
    }).then(function (result) {
      if (result.code == '0') {
        callback(result.data.nodeList)
      } else {
        _.alert('提示', result.desc)
      }
    })
  },
  stringUserIds(array) {
    let ids = array.map((value) => {
      return value.userId;
    })
    return ids.join('|');
  },
  isCheckFlow(data, callback) {
    if (data.isFree == "0") {
      if (data.flowId == "") {
        if (!data.flowListLength) {
          _.alert("提示", "没找到可用的固定流程，请联系管理员");
          return
        } else {
          _.tooltips_succeed("请选择审批流程", true, "", 3000);
          return
        }
      }
      if (this.isCheckAuditUser(data)) {
        this.isCheckAppointNode(data, callback);
      }
    }else if (data.isFree == "3") {
      if (data.isBranchNode) {
        if (data.branchNodeCallback) data.branchNodeCallback()
      } else {
        if (this.isCheckAuditUser(data)) {
          this.isCheckAppointNode(data, callback);
        }
      }
    }else{
      let incharges = data.FlowAuditUser[0].startAuditList.userSelected;
      let userIds = this.stringUserIds(incharges);
      if (!incharges.length) {
        _.tooltips_succeed("处理人不能为空", true, "", 3000);
        return
      }
      if (userIds.indexOf(data.creator) > "-1") {
        _.tooltips_succeed("处理人不能选择自己", true, "", 3000);
        return
      }
      if (callback) callback()
    }
  },
  isCheckAuditUser(data) {
    let FlowAuditUser = data.FlowAuditUser;
    if (FlowAuditUser.length) {
      for (let i = 0; i < FlowAuditUser.length; i++) {
        let userSelectedLength = FlowAuditUser[i].startAuditList.userSelected.length;
        let audtiFlag = FlowAuditUser[i].audtiFlag;
        let isChoise = FlowAuditUser[i].isChoise;
        if (!userSelectedLength) {
          if (audtiFlag != "1") {
            // 无部门负责人
            if (audtiFlag == "3") {
              _.alert("提示", "你所在的部门暂无设置直接负责人,请联系后台管理员");
              return false
            }
            // 多部门
            if (isChoise == "0" || isChoise == "2") { // 允许上个节点指定处理人
              _.tooltips_succeed("选择下一步处理人", true, "", 3000);
            } else { // 不允许指定处理人
              _.tooltips_succeed("选择下一步处理人所在的部门", true, "", 3000);
            }
            if (data.showUserBoxCallback) {
              data.showUserBoxCallback();
            }
            return false
          } else {
            // 单部门/固定处理人 允许上个节点指定处理人
            if (isChoise == "0" || isChoise == "2") {
              _.tooltips_succeed("选择下一步处理人", true, "", 3000);
            } else if (isChoise == "1") {
              _.alert("提示", "找不到下一步处理人，请联系后台管理员");
            }
            return false
          }
        }
      }
    }
    return true
  },
  isCheckAppointNode(data, callback) {
    // 有在当前节点选择处理人的节点信息，显示选人弹窗
    if (data.appointNodeAndUserVOList.length) {
      if (data.appointCallback) data.appointCallback();
      return
    }
    if (callback) callback()
  },
  isCheckAppointNodeAndUser(data) {
    // 判断自由选人是否已选
    if (!data.flowChioseNodeAuditUser.length) {
      _.tooltips_succeed("处理人不能为空", true, "", 3000);
      return false
    } else {
      for (let i = 0; i < data.flowChioseNodeAuditUser.length; i++) {
        if (data.flowChioseNodeAuditUser[i] == undefined || !data.flowChioseNodeAuditUser[i].length) {
          _.tooltips_succeed("处理人不能为空", true, "", 3000);
          return false
        }
      }
    }
    return true
  }
};


export default new audit_flow_api();
