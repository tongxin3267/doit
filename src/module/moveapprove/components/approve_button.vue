<template>
  <div>
    <flow_action_btn_group>
      <div style="display:flex; flex: 1">
        <flow_action_btn v-if="agreeBtn || agreeEndBtn || approveBtn || returnApproveBtn || bottomCreatorAction" text="评论" icon="icon-shenpiqingshi-pinglun" @actionButtonClick="showChatClick"></flow_action_btn>
        <div v-if="!agreeBtn && !agreeEndBtn && !approveBtn && !returnApproveBtn && !bottomCreatorAction" class="comment_btn_add" @click="showChatClick">
          <input class="comment-chat_input" type="text" :value="value" :placeholder="chatPlaceholder"></div>
        <flow_action_btn v-if="agreeBtn || agreeEndBtn" text="同意" icon="icon-shenpiqingshi-tongyi"
                         @actionButtonClick="showAgreeApproveBtn"></flow_action_btn>
        <!--审批-->
        <flow_action_btn v-if="approveBtn"
                         :text="returnApproveText[1]"
                         icon="icon-shenpiqingshi-tongyi"
                         @actionButtonClick="approve"></flow_action_btn>
        <!--退审按钮-->
        <flow_action_btn v-if="returnApproveBtn"
                         :text="returnApproveText[0]"
                         icon="icon-shenpiqingshi-tuishen"
                         @actionButtonClick="returnApprove">
        </flow_action_btn>
        <flow_action_btn v-if="agreeEndBtn" text="转审" icon="icon-shenpiqingshi-zhuanshen" @actionButtonClick="agreeReApprove"></flow_action_btn>
        <flow_action_btn v-if="bottomCreatorAction" icon="icon-shenpiqingshi-guanbi" text="关闭" @actionButtonClick="closeApprove"></flow_action_btn>
        <flow_action_btn v-if="bottomCreatorAction" icon="icon-shenpiqingshi-bianji" text="编辑" @actionButtonClick="editApprove"></flow_action_btn>
      </div>
      <!--更多-->
      <div style="width:48px;display: inline-block" v-if="moreApproveBtnShow">
        <flow_action_btn icon="icon-shenpiqingshi-gengduo" @actionButtonClick="showMoreApproveBtn"></flow_action_btn>
      </div>
    </flow_action_btn_group>

    <!--选择人员弹窗-->
    <div class="approveDialogPop" v-if="nextNodeListShow">
      <div class="approveDialog">
        <div class="approveFlex">
          <div class="selectBoxContent" :style="clientHeightStyle">
            <p class="chooseNodeListUI-top-title">{{approveTitle}}</p>
            <chooseNextNode v-if="nextNodeList.length>1&&ApproveStatusBtn=='approve'"></chooseNextNode>
            <p class="chooseNodeListUI-title" v-show="nextNodeList.length&&ApproveStatusBtn=='returnApprove'">选择退回的节点 <span class="tip">*</span></p>
            <div class="selectReturnNodeBox" v-show="nextNodeList.length&&ApproveStatusBtn=='returnApprove'">
              <select v-model="returnNextNodeId">
                <!--<option class="qwui-click_icon_right" v-if="nextNodeList.length>1">请选择</option>-->
                <option class="qwui-click_icon_right"
                        :value="item.nodeId"
                        v-for="(item,index) in nextNodeList"
                        :key="index">
                  {{item.nodeName}}
                </option>
                <option class="qwui-click_icon_right" value="">提单人</option>
              </select>
            </div>
            <!--加签-->
            <div class="selectAssignBox" v-if="assignSelctBoxShow">
              <label class="item" v-if="isSign">
                <input value="1" type="radio" class="icon_check" v-model="assignType">
                加会签 <span class="tip">(在当前节点中添加处理人)</span>
              </label>
              <label class="item" v-if="isFrontSign">
                <input value="2" type="radio" class="icon_check" v-model="assignType">
                加前签 <span class="tip">(在当前节点之前添加处理人)</span>
              </label>
              <label class="item" v-if="isBackSign">
                <input value="3" type="radio" class="icon_check" v-model="assignType">
                加后签 <span class="tip">(在当前节点之后添加处理人)</span>
              </label>
            </div>
            <!--选择处理人-->
            <div v-if="flowAuditUserShow">
              <user_selected_group
                customClass="chooseNodeListUI"
                v-if="(item && item.startAuditList.show) || assignSelctBoxShow"
                v-for="(item,index) in FlowAuditUser"
                :key="index"
                :title="startAuditTitle(item.nodeName)"
                :mustChoose="true">
                <user_selected_item
                  slot="user_selected_item"
                  :List="item.startAuditList.userSelected"
                  :title="startAuditTitle(item.nodeName)"
                  :isEdit="item.startAuditList.isCanEdit"
                  :widthSize="widthSize"
                  @showUserSelectedBox="FlowAuditUserShowBox(index)"
                  @showPersonList="showPersonList"
                  @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
                  :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
                </user_selected_item>
              </user_selected_group>
            </div>
            <!--选择其它处理人-->
            <div v-if="otherAuditUserShow">
              <user_selected_group
                :title="'['+item.nodeName+'] 处理人'"
                v-for="(item,index) in appointNodeAndUserVOList"
                :key="index"
                class="chooseNodeListUI" :mustChoose="true">
                <user_selected_item
                  slot="user_selected_item"
                  :title="'['+item.nodeName+'] 处理人'"
                  :List="flowChioseNodeAuditUser[index]"
                  :widthSize="widthSize"
                  @showUserSelectedBox="otherAuditUserShowBox(index)"
                  @showPersonList="showPersonList"
                  @removeSelected="(payload)=>{removeChioseNodeUser({parentIndex:index,index:payload.index})}">
                </user_selected_item>
              </user_selected_group>
            </div>
            <div class="qwui-dialog_textarea">
                    <textarea class="qwui-dialog_textarea_textarea"
                              :class="{textActive:isShowErrorTip}" cols="30" rows="2"
                              :placeholder="approveTip" maxlength="200" v-model="approveText">
                    </textarea>
              <p class="qwui-dialog_textarea_counter" @input="changeApproveTip">
                <span :class="{'active':approveText.length>190}">{{approveText.length}}</span>/200
              </p>
            </div>
            <p class="qwui-dialog_textarea_tips" v-show="approveErrorTip">{{approveErrorTip}}</p>
            <!--签名-->
            <assign_btn v-if="writeAssignBtnShow" @showAssignBox="showAssignBox" :isWriteSign="isWriteSign"></assign_btn>
            <div v-if="usePresetSignShow" class="usePresetSign_div">
              <label>
                <input type="checkbox" class="qwui-icon_checkbox" id="isUsePresetSign" :checked="isUsePresetSign" @click="checkUsePresetSign">
                使用后台存档的手写签名图
              </label>
              <p class="">开启指纹审批更安全</p>
            </div>
            <div class="footerHeight"></div>
          </div>
        </div>
        <!--确定按钮-->
        <div>
          <button_group>
            <qwui_button type="default" text="取消" @buttonClick="cancelDialog"></qwui_button>
            <!--其他操作确定-->
            <qwui_button v-if="!assignConfirmBtn" type="primary" text="确定" @buttonClick="confirmDialog"></qwui_button>
            <!--加签确定-->
            <qwui_button v-if="assignConfirmBtn" type="primary" text="确定" @buttonClick="assignConfirm"></qwui_button>
          </button_group>
        </div>

        <!--处理人范围选人-->
        <user_selected_ranglist
          v-if="FlowAuditUserBoxShow"
          :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
          :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
          :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
          :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
          :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
          :checked="FlowAuditUserIds(appointUserIndex)"
          @FlowAuditUserResult="FlowAuditUserResult">
        </user_selected_ranglist>
      </div>
    </div>
    <!--签名弹窗-->
    <qw_assign_box
      v-if="assignBoxShow"
      @cancelCanvas="assignBoxShow=false"
      :imgUrl="signImg"
      :isFree="this.detail.isFree"
      @saveCanvasToURL="saveCanvasToURL"></qw_assign_box>
    <!--更多审批按钮-->
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig">
      <dialog_mask_bottom_item slot="item" v-if="endBtn" name="结束" @dialogBtnClick="endApprove"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" v-if="assignBtn" name="加签" @dialogBtnClick="assignApprove"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" v-if="moreCreatorAction" name="关闭" @dialogBtnClick="closeApprove"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" v-if="moreCreatorAction" name="编辑" @dialogBtnClick="editApprove"></dialog_mask_bottom_item>
      <!--自由流程不显示明细-->
      <dialog_mask_bottom_item slot="item" v-if="this.detail.isFree!=1" name="流转明细" @dialogBtnClick="getFlowSerial"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" name="取消" @dialogBtnClick="showMoreApproveBtn" ></dialog_mask_bottom_item>
    </dialog_mask_bottom>
    <!--同意弹窗-->
    <dialog_mask_bottom :dialogConfig="agreeBottomConfig">
      <dialog_mask_bottom_item slot="item" v-if="agreeBtn" name="仅同意" @dialogBtnClick="agreeApprove"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" v-if="agreeEndBtn" name="同意并结束" @dialogBtnClick="agreeEndApprove"></dialog_mask_bottom_item>
      <dialog_mask_bottom_item slot="item" name="取消" @dialogBtnClick="showAgreeApproveBtn" ></dialog_mask_bottom_item>
    </dialog_mask_bottom>
    <!-- 流转明细 -->
    <flow_serial :flowSerialData="flowSerial" :isover="this.detail.isover" v-if="flowSerial.isShowFlowSerial"></flow_serial>
  </div>
</template>

<script>
  /*
  * TODO 创建者离职
  * */
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import {qwui_button, button_group} from '@/components/base/button'
  import {flow_action_btn,flow_action_btn_group} from '@/components/base/button'
  import audit_flow_api from '@/components/flow/api/getData'
  import assign_btn from '@/components/assign/assign_btn'
  import flow_serial from '@/components/flow/flow_serial'; // 流转明细
  import qw_assign_box from '@/components/assign/assign_box'
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom'
  import dialog_mask_bottom_item from '@/components/base/dialog_mask_bottom_item'
  import chooseNextNode from '../components/chooseNextNode'

  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import {images_upload} from '@/utils/uploadImages';
  export default {
    name: "approve_btn",
    components: {
      flow_action_btn,
      flow_action_btn_group,
      flow_serial,
      user_selected_group,
      user_selected_item,
      button_group,
      qwui_button,
      user_selected_ranglist,
      chooseNextNode,
      assign_btn,
      qw_assign_box,
      dialog_mask_bottom,
      dialog_mask_bottom_item,
    },
    props: {
      value:String,
      chatPlaceholder:{
        type:String,
        default:'评论一句吧'
      },
      agent:String,
      nodeId: String,
    },
    data() {
      return {
        dataBase,
        approveText: '',               // 输入的文字
        approveTip: '',                // 输入的提示语
        approveTitle: '',              // 标题文字
        approveErrorTip: '',           // 审批理由错误提示
        status: '',                    // 审批单状态修改（退审0，关闭-1，通过1，审批并结束2）
        ApproveStatusBtn: '',          // 审批单状态修改（agreeReApprove同意并转审，returnApprove退审，approve审批）
        commitData:{},                  // 提交数据
        returnNextNodeId:null,            // 选择的可退回节点
        assignSelctBoxShow: false,       // 显示加签选择
        assignConfirmBtn: false,       // 加签弹窗确定
        assignType:'',                 // 选择的加签类型
        assignBoxShow:false,           // 签名窗口
        dialogBottomConfig: {         // 更多审批按钮弹窗
          show: false,
        },
        agreeBottomConfig: {          // 同意的弹窗
          show: false
        },
        flowSerial: {                   // 流程明细
          isFirstRequest: true,
          isShowFlowSerial:false,
        },
        isWriteSign: false,          // 有无手写签名
        signImg:'',                  // 签名图
        isShowAssignBtn:false,      // 是否显示手写签名入口
        isShowErrorTip:false,
        clientHeight: false        //计算页面高度
      }
    },
    mounted (){
      this.clientHeight = document.documentElement.clientHeight||window.innerHeight
    },
    computed: {
      ...mapState({
        FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow,
        flowChioseNodeAuditUser: state  => state.userSelected.flowChioseNodeAuditUser,
        nextNodeList: state => state.userSelected.nextNodeList,
        nextNodeListShow: state => state.userSelected.nextNodeListShow,
        flowDpIdJson: state => state.userSelected.flowDpIdJson,
        appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,
        appointUserIndex:state => state.userSelected.appointUserIndex,
        FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
        flowChioseNodeAuditUserJson: state => state.userSelected.flowChioseNodeAuditUserJson,
        isChoise: state => state.userSelected.isChoise,
        audtiFlag: state => state.userSelected.audtiFlag,
        nextNodeId: state => state.userSelected.nextNodeId,
        parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,
        choiseFlowUserJson: state => state.userSelected.choiseFlowUserJson,
        detailData: state => state.detail.detailData,
        detail: state => state.detail.detailData.detail,     // 详情信息
        FlowAudit: state => state.detail.FlowAudit,       // 当前节点详细信息
        approveVo: state => state.detail.approveVo,       // 自由流程获取转审人员
      }),
      ...mapGetters([
        'FlowAuditUserIds'
      ]),
      widthSize(){
        return { paddingSize:10}
      },
      clientHeightStyle(){
        return {'maxHeight':  this.clientHeight - 75 +'px' }
      },
      // 当前节点id
      currentNodeId() {
        return this.nodeId || this.detail.currentNodeId
      },
      // 根据节点审批类型，显示“退审”/“审批”按钮文字
      returnApproveText() {
        if (!this.FlowAudit) {
          return ['退审', '审批']
        }
        let obj = {
          1: ['退审', '审批'],
          2: ['退回', '确认'],
          3: ['退回', '办理']
        }
        return (
          !this.FlowAudit.auditLeave              // 下一步处理人未离职
          && obj[this.FlowAudit.nodeType]
        )
      },
      // 退审理由
      reasonText() {
        if (!this.FlowAudit) {
          return ['退审', '审批']
        }
        let obj = {
          1: '同意',
          2: '已确认',
          3: '已办理'
        }
        return (
          !this.FlowAudit.auditLeave              // 下一步处理人未离职
          && obj[this.FlowAudit.nodeType]
        )
      },
      // 关闭、编辑
      creatorAction() {
        if (!!this.detailData) {
          return (
            this.detail.creator === _.userId                     // 是提单人
            && (this.detail.isover ==='0'                        // 被退审
              || ( this.detail.isover != -1                      // 未关闭
                && this.detailData.approve==='0'))              // 未审批过
          )
        }
      },
      // 更多那里显示 关闭、编辑
      moreCreatorAction() {
        return this.creatorAction && (this.agreeEndBtn || this.returnApproveBtn || this.agreeBtn)
      },
      // 底部的关闭、编辑按钮显示
      bottomCreatorAction() {
        return this.creatorAction && !(this.agreeEndBtn || this.returnApproveBtn || this.agreeBtn)
      },
      // 退审
      returnApproveBtn() {
        let flag = false
        if (!!this.detail && !!this.FlowAudit) {
          flag = (
            this.detail.moveapproveStatus != 2                               // 未审批完
            && this.FlowAudit.vo
            && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1       // 是当前处理人
            && !this.FlowAudit.auditLeave                                    // 下一步处理人未离职
            && this.detail.isover !== '0'                                    // 未被退审
          )
        }
        if (!!this.detail && !!this.approveVo) {
          flag = (
            this.detail.moveapproveStatus != 2                                // 未审批完
            && this.approveVo.vo
            && this.approveVo.vo.userId.indexOf(_.userId) > -1                // 是当前处理人
            && this.detail.isover !=='0'                                       // 未被退审
          )
        }
        return flag
      },
      // 审批
      approveBtn() {
        if (!!this.detail && !!this.FlowAudit) {
          return (
            this.detail.moveapproveStatus != 2                              // 未审批完
            && this.FlowAudit.vo
            && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1      // 是当前处理人
            && !this.FlowAudit.auditLeave                                   // 下一步处理人未离职
            && this.detail.isover !== '0'                                   // 未被退审
          )
        }
      },
      // 同意
      agreeBtn() {
        if (!!this.detailData && !!this.approveVo) {
          return (
            this.detail.isFree == 1                                             // 是自由流程
            && this.detail.moveapproveStatus != 2                               // 未审批完
            && this.approveVo.vo
            && this.approveVo.vo.userId.indexOf(_.userId) > -1                  // 是当前处理人
            && this.approveVo.vo.userId.split('|').length > 1                   // 多个处理人
          )
        }
      },
      // 同意并结束、同意并转审
      agreeEndBtn() {
        if (!!this.detailData && !!this.approveVo) {
          return (
            this.detail.isFree == 1                                             // 是自由流程
            && this.detail.moveapproveStatus != 2                               // 未审批完
            && this.approveVo.vo
            && this.approveVo.vo.userId.indexOf(_.userId) > -1                  // 是当前处理人
          )
        }
      },
      // 结束
      endBtn() {
        if (!!this.detailData && !!this.FlowAudit) {
          return (
            ( this.detail.moveapproveStatus != 2                                  // 未审批完
              && this.FlowAudit.vo
              && this.FlowAudit.vo.isCanEnd == "0"                                // 允许提前结束
              && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1  )       // 是当前处理人
            ||
            ( this.FlowAudit.vo
              && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1          // 是当前处理人
              && this.FlowAudit.auditLeave )                                      // 下一步处理人已离职
          )
        }
      },
      // 加签
      assignBtn() {
        if (!!this.detailData && !!this.FlowAudit) {
          return (
            this.FlowAudit.vo
            && this.FlowAudit.parseAddSignVO
            && this.FlowAudit.parseAddSignVO.canAddSign                           // 加签
            && this.detail.moveapproveStatus != 2                                  // 未审批完
            && this.detail.isover !== '0'                                          // 未被退审
          )
        }
      },
      // 更多审批按钮是否显示
      moreApproveBtnShow() {
        return this.endBtn            // 结束按钮
        || this.assignBtn             // 加签按钮
        || this.moreCreatorAction     // 关闭、编辑按钮
        || this.detail.isFree !=1     // 自由流程不显示明细
      },
      // 审批时，是否要选择下一步处理人
      flowAuditUserShow() {
        // 是可选的isChoise!=1 并且审批人是多部门的 auditFlag==2
        let flag1 = this.ApproveStatusBtn==='approve' && this.FlowAudit && (this.FlowAudit.isChoise!=1 || this.FlowAudit.audtiFlag==2)
        // 或是分支多节点
        let flag2 = this.ApproveStatusBtn==='approve' && this.detail.isFree == 3 && this.FlowAudit && this.FlowAudit.isBranchNode
        // 或是加签、或是转审
        return flag1 || flag2 || this.assignSelctBoxShow || this.ApproveStatusBtn==='agreeReApprove'
      },
      // 选择节点处理人
      otherAuditUserShow() {
        // 如果下个节点由当前节点自由选择处理人
        let flag1 = this.ApproveStatusBtn==='approve' && this.appointNodeAndUserVOList.length
        return flag1
      },
      // 是否可以选择会签 1:是 0:否addSign.countersignPersons
      isSign() {
        return this.FlowAudit && this.FlowAudit.parseAddSignVO
          && this.FlowAudit.parseAddSignVO.canAddSign && this.FlowAudit.parseAddSignVO.canAddConterSign
      },
      // 是否可以加前签
      isFrontSign() {
        return this.FlowAudit && this.FlowAudit.parseAddSignVO
          && this.FlowAudit.parseAddSignVO.canAddSign && this.FlowAudit.parseAddSignVO.canAddFrontSign
      },
      // 是否可以加后签
      isBackSign() {
        return this.FlowAudit && this.FlowAudit.parseAddSignVO
          && this.FlowAudit.parseAddSignVO.canAddSign && this.FlowAudit.parseAddSignVO.canAddBackSign
      },
      // 是否显示手写签名入口(微信端&&审批/退审/结束/同意/同意并结束/同意并转审) false:未开启
      writeAssignBtnShow() {
        return _.isWeChatApp() && this.isShowAssignBtn

      },
      // 是否显示开启存档签名的入口（审批/退审/允许提前结束）
      usePresetSignShow() {
        return (this.ApproveStatusBtn=="approve" || this.ApproveStatusBtn=="returnApprove" || this.ApproveStatusBtn=="canEnd")
        && this.detail.isFree!=1
      },
      // 是否开启存档签名 false:未开启
      isUsePresetSign() {
        return this.FlowAudit && this.FlowAudit.vo.isUsePresetSign && this.FlowAudit.userHandSignImg!=""
      },
      // 流程明细数据
      flowSerialData() {
        return this.flowSerial
      }
    },
    watch: {
      "approveErrorTip"(val){
        if(val!=""){
          _.tooltips_succeed(val,true,"",3000);
          this.approveErrorTip="";
        }
      }
    },
    methods: {
      ...mapMutations([
        "updateUserSelectedData",
        "removeFlowAuditUser",    // 删除已选处理人
        "removeChioseNodeUser",
        "saveChoiseFlowUserJson",     // 保存自由选择的处理人
      ]),
      ...mapActions([
        "updataAuditStatus",     // 更新状态(关闭/退审)
        "addCountersignType",    // 加签
        "updateFlowUserSelected",     // 更新已选处理人
        "getFlowReturnAudit",         // 获取可退审节点
      ]),
      startAuditTitle:function(nodeName) {
        return nodeName ? nodeName+' 处理人' : '处理人'
      },
      // 重置数据
      resetData() {
        this.isShowErrorTip=false;
        this.approveText= ''               // 输入的文字
        this.approveTip= ''                // 输入的提示语
        this.approveTitle= ''              // 标题文字
        this.assignSelctBoxShow= false       // 显示加签选择
        this.status= ''                    // 审批单状态修改（退审0，关闭2，通过1，审批并结束2）
        this.approveErrorTip= ''
        this.ApproveStatusBtn=''
        this.isShowAssignBtn=false
        this.isWriteSign=false
        this.signImg=''
        // 重置节点
        this.$store.commit('updateNextNodeList',[])
        // 隐藏加签弹窗确定按钮
        this.assignConfirmBtn = false
        this.commitData = Object.assign({},{})
      },
      // 关闭
      closeApprove() {
        this.resetData()
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.approveTitle = '关闭申请单'
        this.approveText = '已完成'
        this.approveTip = '请输入关闭原因'
        this.status = -1
        // 在底部显示关闭编辑
        if(this.moreCreatorAction) {
          this.showMoreApproveBtn()
        }
      },
      showChatClick(){                                              //显示评论弹窗
        this.$emit("showChatTool",true);
      },
      showPersonList (title,list){                                           //显示人员预览弹窗
        this.$emit("showPersonList",title,list,true);
      },
      // 编辑
      editApprove() {
        this.$router.replace({path: '/add',query:{moveId:this.detail.moveapproveId}})
      },
      // 退审
      returnApprove() {
        let self = this
        this.resetData()
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.approveTitle = '退审'
        this.approveText = '不同意'
        this.approveTip = '请输入退审原因'
        this.status = 0
        this.ApproveStatusBtn='returnApprove'
        this.isShowAssignBtn=true
        // 非自由流程获取可退审节点
        if(this.detail.isFree !=1) {
          this.getFlowReturnAudit({
            refId: this.detail.moveapproveId,
            isBranch: this.detail.isFree == 3,
            currentNodeId: this.currentNodeId,
            isMiddleAudit: this.FlowAudit.vo.nodeStatus == 4,     // 是否并行流程子节点
            callback: function (data) {
              self.$store.commit('updateNextNodeList',data.returnedNodeList.reverse())
              self.returnNextNodeId =data.returnedNodeList[0] ? data.returnedNodeList[0].nodeId : ''
            }
          })
        }
      },
      // 审批
      approve(e) {
        this.resetData()
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.approveTitle = '审批'
        this.approveText = this.reasonText
        this.approveTip = '请输入流转意见'
        this.status = 1
        this.ApproveStatusBtn='approve'
        this.isShowAssignBtn=true
        if (this.detail.isFree == 3 && this.FlowAudit.isBranchNode) {   // 分支流程
          let defaultNextNodeId=this.FlowAudit.vo.defaultNextNodeId;
          let data = {
            initRefId: this.detail.moveapproveId,
            templateRefId: 'moveapprove'+this.detail.orgId.replace(/-/g, ''),
            currentNodeId: defaultNextNodeId? defaultNextNodeId:this.currentNodeId,
          };
          audit_flow_api.findBranchFlowNextNodeInfo(data, (result) => {
            this.$store.commit('updateFlowAuditUser', result.nodeInfo);
            this.$store.commit("updateNextNodeList", result.nextNodeList)
            if(result.nextNodeList.length){
              this.$store.commit("updateUserSelectedData", {type: 'choosedNodeName', data: result.nextNodeList[0].nodeName})
            }
//            this.$store.commit('updateAppointNodeVOList', result.appointNodeAndUserVOList);
            this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: result.nextNodeId})
            this.$store.commit("updateUserSelectedData", {type:'flowId',data:result.flowId})
            this.$store.commit('updateUserSelectedData', {type: 'parallelNextNodeIds', data: result.parallelNextNodeIds});
            this.$store.commit("updateUserSelectedData", {type: 'currentNodeId', data: data.currentNodeId})
          })
        }
      },
      // 加签操作
      assignApprove() {
        this.resetData()
        this.$store.commit('resetFlowAuditUser')
        this.approveTitle = '加签'
        this.approveText = '请协助处理'
        this.approveTip = '请输入加签原因'
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.assignConfirmBtn = true
        this.assignSelctBoxShow = true
        this.showMoreApproveBtn()
      },
      // 加签确定  请选择加签处理人/加签说明不能为空/不能加签提单人/不能加签自己/不能加签当前负责人/不能加签下一步处理人
      assignConfirm() {
        let self = this
        let addCounterSignPersonStr=''        // 被加签的id
        this.FlowAuditUser.forEach(function(value){
          let users = value.startAuditList.userSelected
          if(!users) return;
          let ids = users.map((item)=>{
            return item.userId
          })
          addCounterSignPersonStr+=ids.join('|')
        })
        // 请选择加签类型
        if(!this.assignType){
          this.approveErrorTip = '请选择加签类型';
          return false
        }
        // 请选择加签处理人
        if(!this.FlowAuditUser[0].startAuditList.userSelected.length) {
          this.approveErrorTip = '请选择加签处理人'
          return false
        }
        // 不能加签自己
        if(addCounterSignPersonStr.indexOf(_.userId)>-1) {
          this.approveErrorTip = '不能加签自己'
          return false
        }
        // 不能加签下一步处理人
        if(this.FlowAudit.nextAuditList && this.FlowAudit.nextAuditList.length) {
          let nextAuditFlag = this.FlowAudit.nextAuditList.filter(value=>{
            return addCounterSignPersonStr.indexOf(value.userId)>-1
          })
          if(nextAuditFlag.length>0){
            this.approveErrorTip = '不能加签下一步处理人'
            return false
          }
        }
        // 当前选择的处理人是否在当前负责人
        let addCounterSignFlag = this.FlowAudit.auditUserList.filter(value=>{
          return addCounterSignPersonStr.indexOf(value.userId)>-1
        })
        // 不能加签当前负责人
        if(addCounterSignFlag.length>0){
          this.approveErrorTip = '不能加签当前负责人'
          return false
        }
        // 如果用户没有输入理由
        if (!this.approveText) {
          this.approveErrorTip = '加签说明不能为空'
          return false
        }
        // 提交
        this.addCountersignType({
          'isFree': this.detail.isFree,
          'type': this.assignType,
          'addCounterSignPersonStr': addCounterSignPersonStr,
          'reason':this.approveText,
          'id':this.detail.moveapproveId,
          'currentNodeId': this.currentNodeId,
        })
      },
      // 结束
      endApprove() {
        this.resetData()
        // 下一步处理人已离职
        if (this.FlowAudit.auditLeave) {
          this.approveText = '下一步处理人离职或者不存在'
        }
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        // 创建者已离职
        this.status = 2
        this.ApproveStatusBtn='canEnd'
        this.showMoreApproveBtn()
        this.approveText = '同意并结束'
        this.approveTip = '请输入流转意见'
        this.isShowAssignBtn=true
      },
      // 同意
      agreeApprove() {
        this.resetData()
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.approveText = '同意'
        this.approveTip = '请输入同意意见'
        this.status = 1
        this.showAgreeApproveBtn()
        this.isShowAssignBtn=true
      },
      // 同意并结束
      agreeEndApprove() {
        this.resetData()
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.approveTitle = '同意并结束'
        this.approveText = '同意'
        this.approveTip = '请输入结束原因'
        this.status = 2
        this.showAgreeApproveBtn()
        this.isShowAssignBtn=true
      },
      // 同意并转审
      agreeReApprove(e) {
        this.resetData()
        this.updateUserSelectedData({type: "nextNodeListShow", data: true})
        this.$store.commit('resetFlowAuditUser')
        this.ApproveStatusBtn = 'agreeReApprove'
        this.approveTitle = '选择转审处理人'
        this.approveText = '同意'
        this.approveTip = '请输入流转意见'
        this.status = 1
        this.isShowAssignBtn=true
      },
      // 同意并转审判断方法
      changeTo() {
        // 转审人不能为空
        if(!this.FlowAuditUser[0].startAuditList.userSelected.length) {
          this.approveErrorTip = '转审人不能为空'
          return false
        }
        // 如果是自由流程，则保存转审的数据
        this.commitData.chooseFlowUser = this.FlowAuditUserIds(0).join('|')
        return true
      },
      sendAgreenApproveContent(){                                                          //转审后发送评论
        let userSelected=this.FlowAuditUser[0].startAuditList.userSelected;
        let content="";
        userSelected.forEach((item,index)=>{
          content+=item.personName+"、";
        });
        content=content.substring(0,content.lastIndexOf("、"));
        let result={
          type:1,
          status:6,
          content:this.approveText+"，请("+content+")审批",
          userIds:this.FlowAuditUserIds(0).join('|')
        };
        this.$emit("sendContent",result);
      },
      // 输入审批文字
      changeApproveTip() {
        if (this.approveText.length > 200) {
          this.approveText = this.approveText.splice(0, 100)
        }
      },
      stringUserIds(array) {
        let ids = array.map((value)=>{
          return value.userId;
        })
        return ids.join('|');
      },
      // 点击确定
      confirmDialog() {
        // 审批或退审时验证手写签名
        if(this.isShowAssignBtn && this.detail.isFree!=1) {
          if(!this.checkSoterInfo()) return
        }
        // 如果用户没有输入理由
        if (!this.approveText) {
          this.isShowErrorTip = true;
          return
        }
        // 如果是转审
        if(this.ApproveStatusBtn==='agreeReApprove'&&!this.changeTo()) {return}
        // 如果是退审
        if(this.ApproveStatusBtn ==='returnApprove' && this.nextNodeList.length) {
          if(this.detail.isFree==3) {
            this.commitData.nextNodeId = this.returnNextNodeId
          }else {
            this.commitData.nextNodeId = this.returnNextNodeId
            this.commitData.chooseFlowUser = this.returnNextNodeId
          }
        }
        // 如果是分支流程，传下个节点id
        if (this.ApproveStatusBtn !=='returnApprove' && this.detail.isFree == 3 && this.FlowAudit) {
          if(this.FlowAudit.vo.defaultNextNodeId){
            this.commitData.nextNodeId = this.FlowAudit.vo.defaultNextNodeId
          }else {
            this.commitData.nextNodeId = this.nextNodeId
          }
        }
        // 如果是审批,验证是否选择处理人
        if(this.ApproveStatusBtn==='approve') {
          if(this.flowAuditUserShow && !audit_flow_api.isCheckAuditUser({FlowAuditUser:this.FlowAuditUser})) {return}
          if (this.otherAuditUserShow && this.appointNodeAndUserVOList.length && !audit_flow_api.isCheckAppointNodeAndUser({flowChioseNodeAuditUser: this.flowChioseNodeAuditUser})) {return}
          this.$store.commit('saveChoiseFlowUserJson')
          this.$store.commit('saveNodeAuditUserJson')
          // 有选择部门负责人// 如果选择了处理人
          if (this.detail.isFree == "0") {
            if (this.FlowAuditUser.length) {
              let userSelected = this.FlowAuditUser[0].startAuditList.userSelected;
              if (this.FlowAuditUser[0].isChoise == "0" || this.FlowAuditUser[0].isChoise == "2") {
                this.commitData.chooseFlowUser = this.stringUserIds(userSelected);
              }
              if (this.FlowAuditUser[0].audtiFlag == "2") {
                this.commitData.flowDpId = userSelected[0].deptId;
              }
            }
          }
          if (this.detail.isFree == "3") {
            if(this.choiseFlowUserJson.length) {
              this.commitData.chooseFlowUser = this.choiseFlowUserJson
            }
            if(this.flowDpIdJson.length){
              this.commitData.flowDpId = this.flowDpIdJson
            }
          }
        }
        // 有选择节点负责人
        if(this.flowChioseNodeAuditUserJson.length) {
          this.commitData.flowChioseNodeAuditUserJson = JSON.stringify(this.flowChioseNodeAuditUserJson)
        }
        // 非自由流程
        let currentNodeId = this.nodeId || this.detail.currentNodeId
        if(this.detail.isFree!=1 && currentNodeId) {
          this.commitData.currentNodeId = currentNodeId
        }
        let self = this
        this.updataAuditStatus({
          'moveId': this.detail.moveapproveId,
          'reason': this.approveText,
          'status': this.status,
          'parallelNextNodeIds': this.parallelNextNodeIds,
          ...this.commitData,
          // 'chooseFlowUser':'',
          // 'parallelNextNodeIds':'',
          // 'flowDpId':'',
          // 'flowChioseNodeAuditUserJson':'',
          // 'signImg':'',
          'callback': function () {
            _.tooltips_succeed('操作成功');
            if(self.ApproveStatusBtn=="agreeReApprove"){
              self.sendAgreenApproveContent();
            }else{
              setTimeout(()=>{
                self.$router.replace('/')
              },1000)
            }
          }
        })
      },
      cancelDialog() {
        this.updateUserSelectedData({type: "nextNodeListShow", data: false})
      },
      // 选择处理人弹窗
      FlowAuditUserShowBox(index) {
        let self = this
        setTimeout(()=>{
          self.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
          // 如果是指定范围选人
          if(self.FlowAuditUser[index].startAuditList.assignRange) {
            self.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
          }else {
            let toPersonList = self.dataBase.selectConfig.selectList.toPersonList
            self.dataBase.selectConfig.signIndex="toPersonList"
            self.dataBase.selectConfig.show=true
            toPersonList.userSelected.length=0
            if(self.FlowAuditUser[index].startAuditList.userSelected.length) {
              toPersonList.userSelected.push(...self.FlowAuditUser[index].startAuditList.userSelected)
            }
            toPersonList.callBack.confirm=function (type, obj) {
              toPersonList.userSelected.length=0
              toPersonList.userSelected.push(...obj.user.data);
              self.$store.commit('resetFlowAuditUser')
              self.$store.commit('updateUserSelected',obj.user.data)
            }
          }
        },500)
      },
      // 选择处理人后
      FlowAuditUserResult(payload) {
        let self = this
        this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: false})
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
        let result = payload.result
        this.FlowAuditUser.forEach(function(value){
          if(value.audtiFlag == "2"){
            if (value.isChoise == "1") {
              self.commitData.flowDpId = payload.ids;
            } else {
              self.commitData.flowDpId = result.length ? payload.result[0].deptId:'';
            }
          }
        })
      },
      otherAuditUserShowBox(index) {
        let self = this
        setTimeout(()=>{
          let toPersonList = self.dataBase.selectConfig.selectList.toPersonList
          self.dataBase.selectConfig.signIndex="toPersonList"
          self.dataBase.selectConfig.show=true
          toPersonList.userSelected.length=0
          if(self.flowChioseNodeAuditUser.length && self.flowChioseNodeAuditUser[index]) {
            toPersonList.userSelected.push(...self.flowChioseNodeAuditUser[index])
          }
          toPersonList.callBack.confirm=function (type, obj) {
            toPersonList.userSelected.length=0
            toPersonList.userSelected.push(...obj.user.data);
            self.$store.commit('updateChooiseNodeAuditUser',{
              index: index,
              data: obj.user.data
            })
          }
        },500)
      },
      // 显示签名窗口
      showAssignBox(payload) {
        this.assignBoxShow = payload
      },
      // 保存签名图
      saveCanvasToURL(payload) {
        this.isWriteSign = payload.isWriteSign
        if(payload.isWriteSign) {
          images_upload(payload.imageUrl,this.agent,(callback)=>{
            this.commitData.signImg = callback.imgurl
          })
          this.signImg = payload.imageUrl
        }else {
          this.commitData.signImg=''
          this.signImg = ''
        }
        this.assignBoxShow = false
      },
      // 显示更多审批按钮
      showMoreApproveBtn() {
        this.dialogBottomConfig.show=!this.dialogBottomConfig.show
      },
      // 显示同意按钮弹窗
      showAgreeApproveBtn() {
        //多个处理人
        if(this.approveVo.vo.userId.split('|').length > 1){
          this.agreeBottomConfig.show=!this.agreeBottomConfig.show
          this.isShowErrorTip = false;
				}else{
				  this.resetData()
          this.updateUserSelectedData({type: "nextNodeListShow", data: true})
          this.approveTitle = '同意并结束'
          this.approveText = '同意'
          this.approveTip = '请输入结束原因'
          this.status = 2
          this.isShowAssignBtn=true
				}
      },
      // 获取流程流转明细
      getFlowSerial() {
        this.showMoreApproveBtn()
        let dataParam = {
          refId: this.detail.moveapproveId,
          isBranch: (this.FlowAudit && this.FlowAudit.isBranchNode) ||  this.detail.isFree == 3,
        }
        this.flowSerial.isFreeFlow = this.detail.isFree
        audit_flow_api.getParallelFlowSerial(dataParam, this.flowSerial, (result) => {
          this.flowSerial = Object.assign({},result)
        })
      },
      // 后台是否上传签名图
      checkUsePresetSign(event) {
        if(event.target.checked){
          if(!this.FlowAudit.vo.isUsePresetSign){
            this.approveErrorTip = '后台未开启“允许使用存档签名”功能';
            return
          }
          if(this.FlowAudit.userHandSignImg==""){
            this.approveErrorTip = '后台还未上传手写签名，请联系管理员';
            return
          }
        }
      },
      // 手写签名验证
      checkSoterInfo() {
        if (this.FlowAudit.vo.isUseHandWriteSign) { //必须手写签名
          let isUseSign = false
          if (this.isWriteSign) { //没有手写签名的时候验证有无使用留档签名
            isUseSign = true
          } else if (document.getElementById("isUsePresetSign").checked && this.FlowAudit.userHandSignImg != "") {
            isUseSign = true
            this.commitData.signImg = this.FlowAudit.userHandSignImg
          }
          if (!isUseSign) {
            this.approveErrorTip = '必须使用签名功能才能审批';
            return false
          }
        } else { //只勾选存档签名
          if (document.getElementById("isUsePresetSign").checked && this.FlowAudit.userHandSignImg != "") {
            this.commitData.signImg = this.FlowAudit.userHandSignImg
          }
        }
        return true
      }
    },
  }

</script>

<style scoped>
  @media screen and (min-width: 1024px) {
    .approveDialogPop {
      width: 740px;
      margin: auto;
    }
    .approveDialogPop .qwui-btn_box{
      width: 730px!important;
    }
  }
  .approveDialogPop {
    position: fixed;
    z-index: 3;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 5px;
    box-sizing: border-box;
    background-color: #7a7a7a;
  }

  .qwui-dialog_textarea_textarea::-webkit-input-placeholder{
    color:#bbb;
  }
  .qwui-dialog_textarea_textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#bbb;
  }
  .qwui-dialog_textarea_textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#bbb;
  }
  .qwui-dialog_textarea_textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#bbb;
  }
  .textActive::-webkit-input-placeholder{
    color: #FF1515
  }
  .textActive::-moz-placeholder{
    color: #FF1515
  }
  .textActive:-moz-placeholder{
    color: #FF1515
  }
  .textActive:-ms-input-placeholder{
    color: #FF1515
  }
  .approveDialog {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #F7F7F7;
    overflow-x: hidden;
  }

  .selectBoxContent {
    position: relative;
    top: 0;
    width: 100%;
    overflow-y: auto;
  }
  .selectBoxContent::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }

  .chooseNodeListUI-top-title {
    margin: 25px 15px 15px;
    font-size: 16px;
    color: #333;
    line-height: 1;
  }

  .chooseNodeListUI .qwui-user_cell_title{
    color: #333;
    font-size: 16px;
  }
  .chooseNodeListUI .qwui-user_select_item{
    background-color: transparent;
  }
  .chooseNodeListUI .qwui-user_select_title:after, .qwui-user_select_charge:after {
    border: 0;
  }
  .chooseNodeListUI .qwui-user_select_list{
    margin: 0;
  }
  .chooseNodeListUI .qwui-user_select_add {
    margin-bottom: 15px;
  }
  .chooseNodeListUI.qwui-user_select_charge_view {
    background-color: transparent;
  }

  .chooseNodeListUI-title {
    font-size: 16px;
    padding: 15px 15px 10px;
    color: #333;
  }

  .selectReturnNodeBox {
    position: relative;
    margin: 0 15px 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 2px;
    background-color: #fff;
  }

  .selectReturnNodeBox select {
    width: 100%;
    padding-right: 20px;
    color: #333;
    font-size: 16px;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    border: none;
    background: url("../../../assets/images/icon_arrow_d.png") no-repeat right center;
    background-size: 12px 8px;
  }

  .qwui-click_icon_right {
    display: block;
    position: absolute;
    top: 50%;
    right: 15px;
    width: 9px;
    height: 15px;
    background: 0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    transform: translate(0, -50%);
  }
  .approveFlex{
    flex: 1;
  }
  .footerHeight{
    height: 20px;
  }
  .selectTitle {
    position: absolute;
    top: 0;
    padding: 10px 15px;
    width: 100%;
    color: #333;
    font-size: 16px;
    background-color: #fff;
  }

  .selectContent {
    position: absolute;
    top: 54px;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
    background-color: #fff;
  }

  .selectContent::-webkit-scrollbar {
    width: 0;
  }

  .selectAssignBox {
    margin: 0 15px 25px;
  }

  .selectAssignBox .item {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    line-height: 1;
    font-size: 16px;
    color: #333;
  }

  .selectAssignBox .tip {
    color: #999;
  }

  .nodeItemContent p {
    color: #999;
    font-size: 14px;
  }

  .nodeItemContent p:nth-child(1) {
    color: #333;
    font-size: 16px;
  }

  .nodeItemContent p:nth-child(2) {
    margin-top: 10px;
  }

  .qwui-dialog_textarea {
    flex-direction: column;
    margin: 0 15px;
    padding: 10px;
    border: 1px #ccc solid;
    border-radius: 2px;
    background-color: #fff;
  }

  .qwui-dialog_textarea_counter {
    font-size: 14px;
    color: #999;
    text-align: right;
    line-height: 1;
  }

  .approveDialog textarea {
    width: 100%;
    height: 94px;
    text-align: left;
    vertical-align: top;
    font-size: 16px;
    color: #333;
    line-height: 1.5;
    border: none;
  }

  .qwui-dialog_textarea_counter .active {
    color: red;
  }

  .tip {
    color: red;
  }

  .approveDialog .subTitle {
    font-size: 14px;
    color: #999;
  }

  .usePresetSign_div {
    margin: 30px 15px;
  }

  .usePresetSign_div label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    line-height: 1;
  }

  .usePresetSign_div p {
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
  .comment_btn_add{
    display: flex;
    justify-content: left;
    align-items: center;
    flex: 1;
    margin: 6px 15px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #999;
    text-align: left;
    background: #F5F5F5;
    cursor: pointer;
  }
  .comment-chat_input{
    font-size: 15px;
    background: none;
    width: 100%;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
