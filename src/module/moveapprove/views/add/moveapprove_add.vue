<template>
  <div class="wrap">
      <!--标题和类型-->
      <data_detail :dataDetailMsg="add_nav"
                   :agent="agentCode"
                   :autoCaching="autoCaching"
                   :typeErrorTip="typeErrorTip"
                   :titleErrorTip="titleErrorTip"
                   :contentErrorTip="contentErrorTip"
                   :isRequired="true"
                   @listenToChild="showMsgFromDataDetail">
      </data_detail>
      <!--上传图片-->
      <img_detail :dataDetailMsg="dataBase.draft.imgUpload"
                  @listenToChild="showMsgFromImgDetail"></img_detail>
      <!--上传附件-->
      <file_detail :dataDetailMsg="dataBase.draft.fileUpload"
                   @listenToChild="showMsgFromFileDetail"></file_detail>
      <!--流程列表-->
      <flow_list v-if="flow.isFree==0"></flow_list>
      <!--选择处理人-->
      <div v-if="FlowAuditUser.length">
        <user_selected_group
          v-if="item && item.startAuditList.show"
          v-for="(item,index) in FlowAuditUser"
          :key="index"
          :title="startAuditTitle(item.nodeName)"
          :mustChoose="true"
          :loadLast="loadLastConfig.toPersonList"
          @confirmPick="confirmPick">
          <user_selected_item
            slot="user_selected_item"
            :title="startAuditTitle(item.nodeName)"
            :isEdit="item.startAuditList.isCanEdit"
            :List="item.startAuditList.userSelected"
            @showPersonList="showPersonList"
            @showUserSelectedBox="FlowAuditUserShowBox(index)"
            @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
            :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
          </user_selected_item>
        </user_selected_group>
      </div>
      <!--选择相关人-->
      <user_selected_group
        title="相关人" :loadLast="loadLastConfig.ccPersonList" @confirmPick="confirmPick">
        <user_selected_item
          :userTotal="ccPersonList.length"
          :List="ccPersonList"
          title="相关人"
          @showPersonList="showPersonList"
          @showUserSelectedBox="ccPersonListShowBox"
          slot="user_selected_item"
          @removeSelected="removeCCPerson">
        </user_selected_item>
      </user_selected_group>

    <!--底部操作按钮-->
    <div class="qwui_btn_top_bottom">
    <flow_button :buttondata="dataBase.draft.buttonConfig"></flow_button>
    </div>

    <!--处理人范围选人-->
    <user_selected_ranglist :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
                            :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
                            :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
                            :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
                            :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
                            :checked="FlowAuditUserIds(appointUserIndex)"
                            @FlowAuditUserResult="FlowAuditUserResult"
                            v-if="FlowAuditUserBoxShow">
    </user_selected_ranglist>

    <!--选择节点处理人-->
    <choose_nodeList v-if="nextNodeListShow"
                     @showPersonList="showPersonList"
                     @saveNodeAuditUserJson="commitTask">
    </choose_nodeList>

    <!--公共选人组件-->
    <user_selected_Box v-if="dataBase.selectConfig.show"
                       :selectconfig="dataBase.selectConfig"
                       @confirmUserSelected=""></user_selected_Box>

    <!--人员列表预览组件-->
    <user_show :show.sync="showPerson"
               :title="userselectTitle"
               :limitPreview="limitPreview"
               :userSelect="userSelectList">
    </user_show>
  </div>
</template>
<script>
  import data_detail from "@/components/add/add_title";
  import img_detail from "@/components/add/add_img";
  import file_detail from "@/components/add/add_file";
  import flow_button from "@/components/button/flow_button";
  import flow_list from "@/components/flow/flow_list";
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import choose_nodeList from '../../components/chooseNodeList'
  import {USERSELECTED, USERLIST} from '../../mock/userSelected'
  import audit_flow_api from '@/components/flow/api/getData'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import {showTypeDict,getFlowTemplate,getConfig,getOldccOrTolist,getccPersonList,getTaskInfo} from "../../api/getData";
  import user_show from '@/components/detail/user_show'
  const USERCONFIG = {
    user: {id: 'id', name: 'personName', headpic: 'headPic', type: 'user'},
    dept: {id: 'id', name: 'departmentName', headpic: 'headPic', type: 'dept'},
  }

  export default {
    components: {
      data_detail,
      img_detail,
      file_detail,
      flow_button,
      flow_list,
      user_selected_item,
      user_selected_group,
      user_selected_ranglist,
      choose_nodeList,
      user_selected_Box,
      user_show
    },
    data() {
      return {
        dataBase: dataBase,
        agentCode: 'moveapprove',
        add_nav: { // 数据详情头部信息
          nav: '申请类型', // 头部标题
          title: "",
          content: "",
          titlePlaceholder: '输入申请标题（必填）',
          contentPlaceholder: '输入申请内容（必填）',
          templateTypeId: "",
          templateType: [],
        },
       //错误信息提示 头部组件
        typeErrorTip: '',
        titleErrorTip: '',
        contentErrorTip: '',
        autoCaching:false,
        deleteCaching:false,
        draft: {
          moveId: "", // 审批单id
          creator: "", // 创建人
          mediaIds: "", // 附件
          imageUrls: "", // 图片
          addOrUpdateUrl: '',
          commitStatus: '', // 0代表保存草稿，1代表提交
        },
        commitDraft: {}, // 提交参数
        flow: {
          isFree: '1', // 流程类型0固定1自由3分支
          isBranchNode: false, // 是否分支流转节点
          templateRefId: '',
          parallelCurrentNodeId: '' // 下个节点是并行开始传的当前节点
        },
        loadLastConfig: { // 加载上次按钮配置
          ccPersonList: {
            type: '1',
            show: true,
            name: '加载上次',
            isGetVal: false,
          },
          toPersonList: {
            type: '0',
            show: true,
            name: '加载上次',
            isGetVal: false,
          }
        },
        userselectTitle:'',
        userSelectList:[],
        showPerson:false,
        limitPreview:false
      };
    },

    created: function () {
      // 判断是新增或者编辑
      if (this.$route.query.moveId) {
        this.draft.moveId = this.$route.query.moveId;
        this.draft.addOrUpdateUrl = '/portal/moveapprove/ajaxUpdate.do';
        this.loadDraftData();
      } else {
        this.draft.creator = this.dataBase.config.userId
        this.draft.addOrUpdateUrl = '/portal/moveapprove/ajaxAdd.do';
                                                                                        //开启自动缓存
        this.autoCaching=true;
        let name=this.agentCode+"_add_"+_.userId;
        let addNavData=JSON.parse(localStorage.getItem(name));
        if(addNavData){
          this.add_nav=addNavData;
          if(addNavData.templateTypeId && addNavData.templateType.length>0){
            for(let i=0;i<addNavData.templateType.length;i++){
              if (addNavData.templateTypeId== addNavData.templateType[i].id) {
                this.showMsgFromDataDetail(addNavData.templateType[i]);
                break;
              }
            }
          }
        }
      }
      // 获取模板
      showTypeDict( (template) => {
        this.add_nav.templateType = template
      })
      // 获取orgID
      getConfig( (orgID) => {
        this.flow.templateRefId = this.agentCode + orgID;
      })
      // 重置数据
      this.$store.commit('resetFlowData');
      this.dataBase.draft.buttonConfig.primaryList[0].callBack = this.checkCommit;
      this.dataBase.draft.buttonConfig.defaultList[0].callBack = this.checkDraft;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
    },
    computed: {
      ...mapState({
        FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow, // 是否显示选人弹窗
        nextNodeListShow: state => state.userSelected.nextNodeListShow, // 是否显示选择下一个节点
        FlowAuditUser: state => state.userSelected.FlowAuditUser, // 处理人信息
        ccPersonList: state => state.userSelected.ccPersonList, // 相关人信息
        flowChioseNodeAuditUser: state  => state.userSelected.flowChioseNodeAuditUser, // 当前节点指定处理人的处理人信息
        flowChioseNodeAuditUserJson: state => state.userSelected.flowChioseNodeAuditUserJson, // 当前节点指定处理人的处理人json
        choiseFlowUserJson: state => state.userSelected.choiseFlowUserJson, // 已选的处理人json(后台允许上一节点指定处理人:固定流程 人员id|人员id
                                                                            // 分支流程 {节点id:人员id|人员id,节点id:人员id|人员id})
        flowDpIdJson: state => state.userSelected.flowDpIdJson, // 并行节点，多部门，选择的部门({节点id:部门id,节点id:部门id})
        flowList: state => state.userSelected.flowList, // 流程列表
        flowId: state => state.userSelected.flowId, // 已选的流程id
        currentNodeId: state => state.userSelected.currentNodeId, // 当前节点id
        nextNodeId: state => state.userSelected.nextNodeId, // 下一节点id
        parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开
        appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
        appointUserIndex:state => state.userSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
      }),
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
      ]),
    },
    destroyed(){
      if(this.deleteCaching){
        let name=this.agentCode+"_add_"+_.userId;
        localStorage.removeItem(name);
      }
    },
    methods: {
      ...mapMutations([
        "removeFlowAuditUser",        // 删除处理人
        "updateNextNodeList",         // 更新下个节点列表
        'saveChoiseFlowUserJson',     // 自由选择处理人信息
      ]),
      ...mapActions([
        "updateFlowUserSelected",     // 更新已选处理人
      ]),

      startAuditTitle:function(nodeName) {
        if(this.flow.isFree==1){
          return nodeName ? nodeName+'审批人' : '审批人(或签)'
        }else{
          return nodeName ? nodeName+'处理人' : '处理人'
        }
      },
      // 删除相关人
      removeCCPerson(payload) {
        this.dataBase.selectConfig.selectList.ccPersonList.userSelected.splice(payload.index,1)
        this.$store.commit('removeCCPerson',payload)
      },
      // 选择处理人弹窗
      FlowAuditUserShowBox(index) {
        this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
        // 如果是指定范围选人
        if(this.FlowAuditUser[index].startAuditList.assignRange) {
          this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
        }else {
          let self = this
          let toPersonList = this.dataBase.selectConfig.selectList.toPersonList
          this.dataBase.selectConfig.signIndex="toPersonList"
          this.dataBase.selectConfig.show=true
          toPersonList.userSelected.length=0
          if(this.FlowAuditUser[index].startAuditList.userSelected.length) {
            toPersonList.userSelected.push(...this.FlowAuditUser[index].startAuditList.userSelected)
          }
          toPersonList.callBack.confirm=function (type, obj) {
            toPersonList.userSelected.length=0
            toPersonList.userSelected.push(...obj.user.data);
            self.$store.commit('updateUserSelected',obj.user.data)
          }
        }
      },
      // 选择处理人后
      FlowAuditUserResult(payload) {
        if(payload.selectType==='dept' && !payload.ids){
          _.tooltips_succeed('请选择部门',true,"",2500);
          return
        }
        this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: false})
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      // 选择相关人
      ccPersonListShowBox(){
        let self = this
        this.dataBase.selectConfig.signIndex="ccPersonList"
        this.dataBase.selectConfig.show=true
        self.dataBase.selectConfig.selectList.ccPersonList.userSelected.length=0
        this.dataBase.selectConfig.selectList.ccPersonList.userSelected.push(...this.ccPersonList)
        this.dataBase.selectConfig.selectList.ccPersonList.callBack.confirm=function (type, obj) {
          self.dataBase.selectConfig.selectList.ccPersonList.userSelected.length=0
          self.dataBase.selectConfig.selectList.ccPersonList.userSelected.push(...obj.user.data);
          self.$store.commit('updateCCPerson',obj.user.data)
        }
      },
      showPersonList(title,list,type){
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        if(type){
          this.limitPreview = true
        }else{
          this.limitPreview = false
        }
      },
      stringUserIds(array) {
        let ids = array.map((value)=>{
          return value.userId;
        })
        return ids.join('|');
      },
      showMsgFromImgDetail(imgurl) {
        this.draft.imageUrls = "";
        this.draft.imageUrls = imgurl.join(",");
      },
      showMsgFromFileDetail(mediaId) {
        this.draft.mediaIds = mediaId.join(",");
      },
      // @val 返回原来接口请求的数据
      showMsgFromDataDetail(val) {
        // 子组件传来数据
        this.flow.isBranchNode = false;
        this.commitDraft = {};      // 提交数据
        this.$store.commit('resetFlowData');

        if (val) {
          //配置时间标题
          let time = _.getCurrentTime().substring(0,10).replace(/-/g,"")
          this.add_nav.title = _.personName + "_" + time + "_" + val.title
          // 加载上一次
          this.loadLastConfig.toPersonList.show = (val.isFree == "0" || val.isFree == "3")? false : true;
          this.loadLastConfig.toPersonList.isGetVal = false;
          this.loadLastConfig.ccPersonList.isGetVal = false;
          // 请求相关人
          getccPersonList(val.id, (cclist) => {
            this.$store.commit('updateCCPerson', cclist);
          })
          // 根据模板id请求最新的模板详情
          this.getFlowTemplate(val.id);
        }
      },
      getFlowTemplate(id) {
        getFlowTemplate(id, (data) => {
          //先判断是固定，分支，否则就是自由，自由类型可能是null
          if(data.isFree == "0" || data.isFree == "3" ){
            this.flow.isFree = data.isFree;
            var dataParam = {
              id: id,
              agentCode: this.agentCode,
              isBranchFlow: data.isFree == 3 ? true : false
            }
            var config = {
              isFreeFlow: data.isFree,
            }
            // 固定、分支请求流程列表 /portal/flow/flowAction!ajaxSearchFlowList.action
            audit_flow_api.searchFlowList(dataParam, config, this.flowCallback);
          }else{
            this.flow.isFree = '1';
            this.$store.commit('resetFlowAuditUser');
          }
        })
      },
      // 编辑初始数据
      loadDraftData() {
        getTaskInfo(this.draft.moveId, (data) => {
          this.dataBase.draft.fileUpload.mediaList = data.mediaList;
          if (data.vo) {
            this.add_nav.templateTypeId = data.vo.moveapproveType;
            this.add_nav.title = data.vo.title;
            this.add_nav.content = data.vo.content;
            this.draft.creator = data.vo.creator;
            this.dataBase.draft.imgUpload.picList = data.vo.picList;
            this.flow.isFree = data.vo.isFree;

            this.$store.commit("updateUserSelectedData", {type: 'flowId', data: data.vo.flowId});
            this.loadLastConfig.toPersonList.show = (data.vo.isFree == "0" || data.vo.isFree == "3") ? false : true;
            this.$store.commit('updateUserSelected', data.vo.toPersons);
            this.$store.commit('updateCCPerson', data.vo.ccPersons);
            this.getFlowTemplate(data.vo.moveapproveType);
          }
        })
      },
      // 加载上一次审批人/相关人
      confirmPick(type, isGet) {
        if (!isGet) {
          if (type == 1) {
            this.$store.commit('updateCCPerson', []);
          } else {
            this.$store.commit('updateUserSelected', []);
          }
        } else {
          getOldccOrTolist(type, (ccOrTolist) => {
            if (type == 1) {
              this.$store.commit('updateCCPerson', ccOrTolist);
            } else {
              this.$store.commit('updateUserSelected', ccOrTolist);
            }
          })
        }
      },
      flowCallback(data) {
        this.$store.commit('updateFlowAuditUser', data.nodeInfo);
        this.$store.commit('updateAppointNodeVOList', data.appointNodeAndUserVOList);
        this.$store.commit('updateFlowList', data.flowList);
        this.$store.commit('updateUserSelectedData', {type: 'flowId', data: data.flowId});
        this.$store.commit("updateUserSelectedData", {type: 'currentNodeId', data: data.currentNodeId})
        this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: data.nextNodeId})
        this.flow.isBranchNode = data.isBranchNode;
        this.flow.parallelCurrentNodeId = data.parallelCurrentNodeId;
      },
      checkCommit() { // 提交
        this.draft.commitStatus = 1;
        this.isCheckMust();
      },
      checkDraft() { // 保存为草稿
        this.draft.commitStatus = 0;
        this.isCheckMust();
      },
      isCheckMust() { // 验证必填
        this.typeErrorTip = '';
        this.titleErrorTip = '';
        this.contentErrorTip = '';
        this.hasError = false;
        if (this.add_nav.templateTypeId == '') {
          this.typeErrorTip = '申请类型不能为空';
          this.hasError = true;
        }
        if (this.add_nav.title == '') {
          this.titleErrorTip = '申请标题不能为空';
          this.hasError = true;
        }
        if (this.add_nav.content == '') {
          this.contentErrorTip = '申请内容不能为空';
          this.hasError = true;
        }
        if(this.hasError){
          document.body.scrollTop = 0
          // Firefox
          document.documentElement.scrollTop = 0
          // Safari
          window.pageYOffset = 0
          return
        }
        // 如果是草稿，就直接提交
        if (!this.draft.commitStatus) {
          this.commitTask();
        } else {
          var data = {
            creator: this.draft.creator,
            isFree: this.flow.isFree,
            flowListLength: this.flowList.length,
            flowId: this.flowId,
            FlowAuditUser: this.FlowAuditUser,
            isBranchNode: this.flow.isBranchNode,
            appointNodeAndUserVOList: this.appointNodeAndUserVOList,
            appointCallback: this.appointCallback,
            branchNodeCallback: this.branchNodeCallBack,
            showUserBoxCallback: this.showFlowAuditUserBox
          }
          audit_flow_api.isCheckFlow(data,this.commitTask);
        }
      },
      showFlowAuditUserBox() {
        this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true});
      },
      // 自由选择处理人，显示选人弹窗
      appointCallback(){
        this.$store.commit("updateUserSelectedData", {type: "nextNodeListShow", data: true});
      },
      branchNodeCallBack(){
        var data = {
          templateRefId: this.flow.templateRefId,
          currentNodeId: this.flow.parallelCurrentNodeId == "" ? this.currentNodeId : this.flow.parallelCurrentNodeId,
        };
        audit_flow_api.findBranchFlowNextNodeInfo(data, (result) => {
          this.$store.commit('updateFlowAuditUser', result.nodeInfo);
          this.$store.commit('updateAppointNodeVOList', result.appointNodeAndUserVOList);
          this.$store.commit("updateNextNodeList", result.nextNodeList);
          this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: result.nextNodeId});
          if(result.nextNodeList.length){
            this.$store.commit("updateUserSelectedData", {type: 'choosedNodeName', data: result.nextNodeList[0].nodeName})
          }
          this.$store.commit("updateUserSelectedData", {type: 'nextNodeListShow', data: true});
          this.$store.commit('updateUserSelectedData', {type: 'parallelNextNodeIds', data: result.parallelNextNodeIds});
        })
      },
      initCommitDraft() {
        this.commitDraft = { // 提交参数
          'tbQyMoveapprovePO.moveapproveType': this.add_nav.templateTypeId,
          'tbQyMoveapprovePO.title': this.add_nav.title,
          'tbQyMoveapprovePO.content': this.add_nav.content,
          'tbQyMoveapprovePO.isFree': this.flow.isFree,
          'tbQyMoveapprovePO.moveapproveStatus': this.draft.commitStatus,
          'mediaIds': this.draft.mediaIds,
          'imageUrls': this.draft.imageUrls,
          'relatives': this.stringUserIds(this.ccPersonList),
        }
        if (this.$route.query.moveId) {
          this.commitDraft['tbQyMoveapprovePO.moveapproveId'] = this.draft.moveId;
          this.commitDraft['tbQyMoveapprovePO.creator'] = this.draft.creator;
        }

        if (this.flow.isFree == "0" || this.flow.isFree == "3") {
          this.commitDraft['flowId'] = this.flowId;
          if (this.appointNodeAndUserVOList.length) {
            this.commitDraft['flowChioseNodeAuditUserJson'] = JSON.stringify(this.flowChioseNodeAuditUserJson);
          }
          if (this.flow.isFree == "0" && this.FlowAuditUser.length) {
            let userSelected = this.FlowAuditUser[0].startAuditList.userSelected;
            if (this.FlowAuditUser[0].isChoise == "0" || this.FlowAuditUser[0].isChoise == "2") {
              this.commitDraft['chooseFlowUser'] = this.stringUserIds(userSelected);
            }
            if (this.FlowAuditUser[0].audtiFlag == "2") {
              this.commitDraft['flowDpId'] = userSelected[0].deptId;
            }
          }
          if (this.flow.isFree == "3") {
            this.commitDraft['currentNodeId'] = this.currentNodeId;
            this.commitDraft['nextNodeId'] = this.nextNodeId;
            if (this.flow.isBranchNode) {
              this.commitDraft['templateRefId'] = this.flow.templateRefId;
              this.commitDraft['parallelNextNodeIds'] = this.parallelNextNodeIds;
            }
            if (this.FlowAuditUser.length) {
              this.$store.commit("saveChoiseFlowUserJson");
              this.commitDraft['chooseFlowUser'] = this.choiseFlowUserJson;
              this.commitDraft['flowDpId'] = this.flowDpIdJson;
            }
          }
        } else {
          this.commitDraft['incharges'] = this.stringUserIds(this.FlowAuditUser[0].startAuditList.userSelected);
        }
      },
      commitTask() {
        this.initCommitDraft();
        var self = this;
        _.showLoading("i18n.submitting");
        _.ajax({
          url: _.baseURL + self.draft.addOrUpdateUrl,
          type: 'POST',
          data: self.commitDraft,
          dataType: 'json',
          success: function (result) {
            _.hideLoading();
            if (result.code == "0") {
              _.tooltips_succeed("i18n.operationSuccess");
              self.deleteCaching=true;
              if (self.draft.commitStatus) {
                self.$router.push({
                  path: '/my/submit'
                })
              } else {
                self.$router.push({
                  path: '/draft'
                })
              }
            } else {
              _.alert('提示', result.desc);
            }
          }
        })
      },
    },
  };

</script>


