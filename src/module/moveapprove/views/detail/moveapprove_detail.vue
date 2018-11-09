<template>
  <div class="wrap"  v-windowscroll="scrollList">
    <div v-if="detailTitleData">
      <!--详情标题头部-->
      <detail-title v-if="detailTitleData"
                    :titledata="detailTitleData"
                    @showThisPersonUtil="atThisPersonUtil">
      </detail-title>
      <div class="relative">
        <span class="qwui-serial_entrance" @click="getFlowSerial" v-show="flowSerial.isFreeFlow!=1"><i class="qwui-icon_serial"></i>流转明细</span>

        <!--当前处理人-->
        <user_selected_group
          v-for="(item,index) in startAuditList"
          :key="index"
          v-if="startAuditList && item.auditUserList.length"
          :title="startAuditTitle(item)"
          :isEdit="false">
          <user_selected_item
            :title="startAuditTitle(item)"
            :List="item.auditUserList"
            :isEdit="false"
            @atThisPersonUtil="atThisPersonUtil"
            @showPersonList="showPersonList"
            slot="user_selected_item">
          </user_selected_item>
        </user_selected_group>

        <!--自由流程审批人-->
        <user_selected_group
          v-if="freeAuditList"
          title="审批人"
          :isEdit="false">
          <user_selected_item
            title="审批人"
            :List="freeAuditList"
            :isEdit="false"
            @atThisPersonUtil="atThisPersonUtil"
            @showPersonList="showPersonList"
            slot="user_selected_item"></user_selected_item>
        </user_selected_group>

        <!--下一步处理人-->
        <user_selected_group
          v-if="nextAuditListShow"
          title="下一步处理人" :isEdit="false">
          <user_selected_item
            title="下一步处理人"
            :List="FlowAudit.nextAuditList"
            :isEdit="false"
            @atThisPersonUtil="atThisPersonUtil"
            @showPersonList="showPersonList"
            slot="user_selected_item">
          </user_selected_item>
        </user_selected_group>

        <!--相关人-->
        <user_selected_group
          v-if="detailDataConfig && detailDataConfig.ccPersons && detailDataConfig.ccPersons.length"
          title="相关人" :isEdit="false">
          <user_selected_item
            title="相关人"
            :List="detailDataConfig.ccPersons"
            :isEdit="false"
            @atThisPersonUtil="atThisPersonUtil"
            @showPersonList="showPersonList"
            slot="user_selected_item">
          </user_selected_item>
        </user_selected_group>
      </div>
      <!--评论列表-->
      <comment_list
        :commentList="commentList"
        :totalRow="listTotalRows"
        @onlyComment="onlySeeComment"
        @atThisPersonUtil="atThisPersonUtil"
        @commentListImagesURL="commentListImagesURL"
        @delete="deleteThisComment">
      </comment_list>

      <!--加载更多-->
      <Load_more :loading="loading"
                 :type="'commentList'"
                 :hasMore="hasMore"
                 @loadMoreClick="loadMoreList">
        <!--<span v-if="listTotalRows>0">共 {{listTotalRows}} 评论</span>-->
        <span v-if="!listTotalRows">还没有任何评论</span>
      </Load_more>

      <div v-if="!hasMore && listTotalRows" class="height-margin"></div>
      <div class="height-bottom"></div>

      <!--审批请示按钮-->
      <approve_btn
        :value="commentValue"
        :nodeId="flow.nodeId"
        :agent="agent"
        @showChatTool="chetButtonClick"
        @showPersonList="showPersonList"
        @sendContent="updateContent">
      </approve_btn>
    </div>

    <!--个人信息-->
    <user_info @showChatTool="chetButtonClick"></user_info>

    <!-- 流转明细 -->
    <flow_serial :flowSerialData="flowSerialData" :isover="flow.isover" v-if="flowSerial.isShowFlowSerial"></flow_serial>

    <!--选人-->
    <user_selected_Box :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_selected_Box>

    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @dealccPerson="backUserSelect"
      @closeChat="closeChatMask">
    </chatInput>

    <!--选择节点-->
    <qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

    <!--预览图片组件-->
    <previewImages :urls="previewImageUrl"></previewImages>

    <!--人员列表组件-->
    <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>
  </div>
</template>
<script>
  import detailTitle from '@/components/detail/detail_title';
  import userSelect from '@/components/detail/user_select';
  import comment_list from '@/components/list/comment_list';
  import Load_more from '@/components/list/load_more';
  import chatComment from '@/components/detail/chat_comment';
  import chatInput from '@/components/detail/chatInput';
  import user_info from '@/components/detail/user_info_card';
  import flow_serial from '@/components/flow/flow_serial'; // 流转明细
  import audit_flow_api from '@/components/flow/api/getData.js';
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
  import user_selected_Box from '@/components/base/user_or_dept_select';
  import approve_btn from '../../components/approve_button';
  import previewImages from "@/components/detail/previewImages";
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import {commentListMore,addCommentList,deleteCommentList,getMoveDetail} from "../../../moveapprove/api/getData";
  import EventBus from '@/utils/eventBus';
  import qw_select_node from '@/components/flow/selectNode';
  import user_show from '@/components/detail/user_show'

  export default {
    name: 'detail',
    components: {
      detailTitle,
      userSelect,
      comment_list,
      Load_more,
      chatComment,
      user_info,
      flow_serial,
      user_selected_item,
      user_selected_group,
      approve_btn,
      user_selected_Box,
      chatInput,
      previewImages,
      qw_select_node,
      user_show
    },
    data() {
      return {
        dataBase: dataBase,
        moveId: '',
        startAuditList:null,//当前审批人
        freeAuditList:null,//自由流程审批人
        flowSerial: {
          isFirstRequest: true,
          isShowFlowSerial: false,
          list: [],
          isFreeFlow: ''
        },
        returnNode: {
          list: [],
          isFirstRequest: true,
        },
        flow: {
          isBranchFlow: false,
          nodeId: '', //当前节点id
          creatorId:"",
          status: '', //审批状态
          isover:"",
          isAlreadyAudit:"",
          definitionId: '' //模板id
        },
        loading:false,
        hasMore:false,
        lock_roll:false,
        currentPage:1,
        commentStatus:"1",
        listTotalRows:0,
        agent:'moveapprove',
        commentList:[],                                                        //评论列表
        commentValue: '',                                                        //评论输入框的值
        showChatTool:false,                                                      //显示评论输入框
        autofocus:false,
        moveapproveId:"",                                                       //审批单id
        deleteListIndex:"",                                                     //需要删除的index
        detailPicList:[],                                                       //详情头部图片列表
        previewImageUrl:[],                                                     //需要预览的图片列表
        showPerson:false,                                                   //是否展开所有选中人员列表
        userselectTitle:'',
        userSelectList:[],
        limitPreview:false                                                //限制弹个人信息弹窗
      }
    },
    created() {
      this.moveId = this.$route.query.moveId;
      this.showMoveDetail();
      this.$store.commit('resetFlowData')
      this.$store.commit('resetDetailData')
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
    },
    computed: {
      ...mapState({
        detailDataConfig: state => state.detail.detailData.detail,     // 详情信息
        FlowAudit: state => state.detail.FlowAudit,     // 详情信息
        mediaList: state => state.detail.mediaList,   // 附件信息
        detailTitleData: state => state.detail.detailTitleData,   // 附件信息
        FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
        detailDataTitle: state => state.detail.detailDataTitle,
      }),
      listComment: function () { //评论数据
        return this.detailData.listComment;
      },
      flowSerialData: function () {
        return this.flowSerial;
      },
      // 下一步处理人是否显示
      // 是当前处理人且不可选、不是当前处理人、nextAuditList.length>0
      nextAuditListShow() {
        let flag1 = this.FlowAudit && this.FlowAudit.nextAuditList.length>0
        let flag2 =  this.FlowAudit && !(this.FlowAudit.isChoise!=1 || this.FlowAudit.audtiFlag==2)
          && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1     // 是当前处理人
        let flag3 =  this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId)==-1    // 或不是当前处理人
        return flag1 && (flag2 || flag3)
      }
    },
    methods: {
      ...mapActions([
        "getApprove",   // 自由流程获取转审人员
        "getNodeListInfo" //获取节点选择信息
      ]),
      // 查询并行的节点选择接口
      getDetailNodeList (data) {
        let self = this
        this.getNodeListInfo({'refId':this.moveId,'callback': function (result){
          if (result.length>0){
            self.flow.nodeId = result[0].nodeId
          } else {
            self.flow.nodeId = data.detail?  data.detail.currentNodeId : ''
          }
          self.showDetailPage(data)
        }})
      },
      //并行流程选择节点后进行处理
      selectNodeClick (item,data){
        this.flow.nodeId = item.nodeId

        this.showDetailPage(data)
      },
      // 详情加载
      showMoveDetail: function () {
        var self = this;
        getMoveDetail({
          moveId: self.moveId,
          size: "10",
        }).then(function (result) {
          _.hideLoading();
          if (result.code == "0") {
            //判断是否是并行，是就查询并行接口获取节点列表
            if (result.data.detail && result.data.detail.currentNodeId.indexOf(',')!=-1){
              self.$store.commit('updateListName',result.data)
              self.getDetailNodeList(result.data)
            } else {
              //非并行流程
              self.flow.nodeId = result.data.detail?  result.data.detail.currentNodeId : ''
              self.showDetailPage(result.data)
            }
          }else if(result.code == "24003"){
            let btnConfig={
              primaryBtn:{name:"i18n.confirm", callBack:function () {
                self.$router.replace('/')
              }},
              defaultBtn:{name:"", callBack:null},
            };
            _.alert("该申请已被删除无法查看", result.desc,btnConfig);
          } else {
            _.alert("i18n.notice", result.desc);
          }
        })
      },
      showDetailPage (data){
        this.$store.commit('updateTitleData',data)
        this.$store.commit('updateDetailData',data)
        this.$store.commit('updateMediaList',data.mediaList)

        //图片列表
        this.detailPicList.push(...data.detail.picList);
        this.moveapproveId=data.detail.moveapproveId;

        //评论列表处理
        this.hasMore = data.hasMore;
        this.showCommentList(data.comments, data.hasMore ,data.detail.commentCount);

      //标题设置
        data.detail.title? document.title = data.detail.title: '';

        this.flow.status = data.detail.moveapproveStatus;
        this.flow.creatorId=data.detail.creator;
        this.flow.isover=data.detail.isover;
        this.flow.isBranchFlow = data.detail.isFree == 3 ? true : false;
        this.flowSerial.isFreeFlow = data.detail.isFree;
        this.flow.status=data.detail.moveapproveStatus;
        this.flow.definitionId = this.agent + data.detail.orgId

        //审批状态判断
        let statusString = audit_flow_api.statusCheckFree(this.flow.creatorId,this.flow.status,this.flow.isover,true);
        let status = _.append_status(statusString,true);
        this.detailTitleData.status=status;

        if (data.detail.isFree != "1") {      // 非自由流程
          this.getFlowAuditDetail();
        }else {
          this.getApprove(this.moveapproveId);   // 自由流程获取转审人员
        }
        // 已关闭、已审批、被退审、自由流程：显示所有审批人
        if(data.detail.isover == -1 || data.detail.moveapproveStatus == 2
          || data.detail.isover === '0' || data.detail.isFree == 1 ) {
          this.freeAuditList=[...data.detail.toPersons]
        }
      },
      chetButtonClick(data){
        this.showChatTool = true;
        this.autofocus = true
      },
      backUserSelect: function (obj) { //@人后把人添加为相关人,当@的人是审批人的话，不加到相关人
        let toPerson = this.flowSerial.isFreeFlow == '1'? this.freeAuditList:this.startAuditList
        let toPersonIdStr = ''
        toPerson.forEach(function(item){
          toPersonIdStr+=item.userId
        });
        for(let i=obj.data.length-1;i>=0;i--){
          if(toPersonIdStr.indexOf(obj.data[i].userId)>-1){
            obj.data.splice(i,1);
          }
        }
        this.$store.commit('addCCPersonList',obj.data);
      },
      getFlowAuditDetail: function () { //当前节点的详细信息
        // 已关闭、已审批、被退审,不需要请求/portal/flow/flowParallel/ajaxGetFlowAudit.do
        if(this.detailDataConfig.isover == -1 || this.detailDataConfig.moveapproveStatus == 2
          || this.detailDataConfig.isover === '0') {
          return
        }
        var dataParam = {
          refId: this.moveId,
          definitionId: this.flow.definitionId,
          isBranch: this.flow.isBranchFlow,
          nodeId: this.flow.nodeId,
          status: this.flow.status
        };

        audit_flow_api.getFlowAuditDetail(dataParam, (result) => {
          let data=result.data[0];
          this.startAuditList = [...result.data]
          let statusString = audit_flow_api.statusCheck(this.flow.creatorId, this.flow.status, this.flow.isover);
          if(statusString){
            let status = _.append_status(statusString,true);
            this.detailTitleData.status=status;
            this.$store.commit('updateTitleStatus',status)
          }

          this.$store.commit('updateFlowAuditUser',result.nodeInfo)
          if(result.data.length===1){
            this.$store.commit('updateFlowAudit',data)
            this.$store.commit("updateAppointNodeVOList", data.appointNodeAndUserVOList)
            this.$store.commit('updateFlowChioseNodeAuditUser')
          }
        })
      },
      getFlowSerial: function () { //获取流程流转明细
        let dataParam = {
          refId: this.moveId,
          isBranch: this.flow.isBranchFlow,
        }
        audit_flow_api.getParallelFlowSerial(dataParam, this.flowSerial, (result) => {
          this.flowSerial = result
        })
      },
      // 处理人标题
      startAuditTitle(item) {
        if(this.startAuditList.length>1) {
          return item.vo.nodeName+' 处理人'
        }else {
          return '当前处理人'
        }
      },
      atThisPersonUtil(user){                                            // 查看个人头像信息
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
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
      scrollList(){                                                // 滚动更多列表
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.lock_roll=true;
            this.currentPage++;
            this.loadMoreList(status);
          }
        }
      },
      onlySeeComment(type){
        this.currentPage=1;
        this.commentList.length=0;
        this.commentStatus=type? "2":"1";
        if(!this.loading){
          this.loadMoreList();
        }
      },
      loadMoreList(){                                               // 加载更多列表
        var data={
          id:this.moveapproveId ,
          size: 10,
          commentStatus: this.commentStatus,
        };
        this.loading=true;
        data.page=this.currentPage;
        commentListMore(data,this.dealCommentList);
      },
      dealCommentList(data){
        this.loading=false;
        let commentCount = data.tbTaskinfo? data.tbTaskinfo.commentCount : null
        this.showCommentList(data.comments,data.hasMore,commentCount);
      },
      showCommentList(data,hasMore,commentCount){                                    // 处理返回的评论
        this.hasMore=hasMore;
        this.lock_roll=false;
        if(data && data.length>0){
          this.commentList.push(...data);
          this.listTotalRows=commentCount? commentCount : Number(this.commentList.length);
        }else{
          this.commentList.length=0;
          this.listTotalRows=0;
        }
      },
      commentListImagesURL(urls){                                              // 处理详情的全部图片src
        this.previewImageUrl=[];
        this.previewImageUrl.push(...this.detailPicList);
        this.previewImageUrl.push(...urls);
      },
      closeChatMask(val){
        this.commentValue = val
      },
      updateContent(data){                                              // 发送评论
        if(data){
          let msg={
          "content":data.content,
          "refId":this.moveapproveId,
          "type":data.type,
          "status":data.status,
          "userId":_.userId
          };
          data.userIds? msg.userIds=data.userIds:"";

          var self=this;
          addCommentList(msg,function (result) {
            if(result.commentId){
              self.commentList.splice(0,0,{
                commentId:result.commentId,
                headPic:_.headPic,
                personName:_.personName,
                creator:_.userId,
                type:data.type,
                content:data.content,
                time:"刚刚",
                commentStatus:data.status,
              });
              self.listTotalRows++;
            }
            if(data.status=="6"){
              window.location.reload();
            }
          });
        }
      },
      deleteThisComment(data,index){                                 // 删除评论
        if(data){
          this.deleteListIndex=index;
          var self=this;
          deleteCommentList({commentId:data.commentId},function (result) {  // 删除成功
            self.commentList.splice(self.deleteListIndex,1);
            self.listTotalRows--;
          });
        }
      },
    }
  }

</script>
<style scoped>
  .relative{position: relative}
  .height-margin{height: 15px;}
  .height-bottom{height: 50px}
</style>
