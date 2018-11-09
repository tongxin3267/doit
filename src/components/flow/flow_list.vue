<template>
  <div>
    <div class="flow_list_wrap">
      <div class="qwui-flow_list">
        <div class="qwui-user_cell_title">
          <p class="title qwui-flow_list-title">审批流程
            <span class="qwui-required_mark">*</span>
          </p>
        </div>
      </div>
      <ul class="flow_list">
        <li class="flow_list_item" v-for="(item,index) in flowList" :key="item.id">
          <label class="flow_name" @click="getFlowAuditUser(item.id)">
            <input type="radio" class="icon_check" :checked="item.id==flowId">
            <p>{{item.name}}</p>
          </label>
          <div class="icon_help" @click.stop="showFlowNode(item.id,item.name)"></div>
        </li>
      </ul>
    </div>
    <div class="process_pop" v-if="isShowFlowNode">
      <div class="process_mask">
        <div class="process_head">{{flowName}}</div>
        <div class="process_content">
          <div class="process_list">
            <div class="process_item">
              <div class="title">
                <i class="icon_step icon_step_check"></i>
                <div class="name">
                  <p>提单</p>
                </div>
              </div>
              <div class="content"></div>
            </div>
            <div class="process_item" v-for="(item,index) in nodeList" :key="item.id">
              <div class="title">
                <i class="icon_step">{{index + 1}}</i>
                <div class="name">
                  <p>{{item.nodeName}}</p>
                </div>
              </div>
              <div class="content">
                <p>[{{nodeType[item.nodeType - 1]}}{{item.isSign == 0 ? '/会签' : ''}}] {{item.handleAccounts}}</p>
              </div>
            </div>
            <div class="process_item">
              <div class="title">
                <i class="icon_step icon_step_check"></i>
                <div class="name">
                  <p>结束</p>
                </div>
              </div>
              <div class="content"></div>
            </div>
          </div>
        </div>
        <div class="processFooter">
          <span class="qwui-btn qwui-btn_default" @click="showOrHideProcessPop">返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import audit_flow_api from "@/components/flow/api/getData.js";

  export default {
    name: "QwFlowList",
    data() {
      return {
        isShowFlowNode: false,
        nodeList: [],
        flowName: "",
        nodeType: ["审批", "知会", "承办"],
        oldFlowId: ""
      };
    },
    computed: {
      ...mapState({
        flowList: state => state.userSelected.flowList,
        flowId: state => state.userSelected.flowId
      })
    },
    methods: {
      getFlowAuditUser(flowId) {
        let self = this;
        if (flowId == self.flowId) return;
        this.$store.commit("updateUserSelectedData", {
          type: "flowId",
          data: flowId
        });
        let paramData = {
          definitionId: "",
          id: "",
          flowId: flowId,
          currentNodeId: "",
          nextNodeId: "",
          parallelNextNodeIds: "",
          isBranchFlow: false
        };
        audit_flow_api.getFlowAuditUser(paramData, function (data) {
          self.$store.commit(
            "updateAppointNodeVOList",
            data.appointNodeAndUserVOList
          );
          self.$store.commit("updateFlowAuditUser", data.nodeInfo);
        });
      },
      showFlowNode(flowId, flowName) {
        if (flowId == this.oldFlowId) {
          this.showOrHideProcessPop();
          return;
        }
        this.oldFlowId = flowId;
        audit_flow_api.showFlowNode(flowId, nodeList => {
          this.nodeList = nodeList;
          this.flowName = flowName;
          this.showOrHideProcessPop();
        });
      },
      showOrHideProcessPop() {
        this.isShowFlowNode = !this.isShowFlowNode;
      }
    }
  };
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .process_pop {
      width: 740px;
      margin: auto;
    }
  }

  .flow_list_wrap {
    margin-top: 10px;
  }

  .flow_list {
    padding-bottom: 10px;
    background-color: #fff;
  }

  .flow_list_item {
    position: relative;
    display: flex;
    padding: 12px 15px;
    line-height: 20px;
    font-size: 16px;
    color: #333;
  }

  .qwui-flow_list{
    display: flex;
    position: relative;
    padding: 13px 15px 6px 15px;
    font-size: 14px;
    color: #333;
    text-align: left;
    background-color: #fff;
  }

  .qwui-flow_list-title{
    font-size: 16px;
    color:#333;
  }
  .icon_check {
    margin-right: 0;
  }

  .flow_name {
    display: flex;
    flex: 1;
    margin-right: 20px;
    width: 0;
  }

  .flow_name p {
    flex: 1;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon_help {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width: 40px;
    height: 50px;
    cursor: pointer;
  }

  .icon_help::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 15px;
    width: 16px;
    height: 16px;
    transform: translate(0, -50%);
    background: url(../../assets/images/icon_help.png);
    background-size: cover;
  }

  .process_pop {
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 5px;
    box-sizing: border-box;
    background-color: #7a7a7a;
  }

  .process_pop .process_mask {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
  }

  .process_head {
    position: absolute;
    top: 0;
    padding: 20px 15px 25px;
    width: 100%;
    color: #333;
    font-size: 16px;
    line-height: 1;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .process_content {
    position: absolute;
    top: 60px;
    bottom: 60px;
    width: 100%;
    overflow: auto;
  }

  .process_content::-webkit-scrollbar {
    width: 0;
  }

  .process_content .process_list {
    padding: 0 17px;
  }

  .process_item .title {
    display: flex;
  }

  .process_item .title .name {
    display: flex;
    flex: 1;
    width: 0;
  }

  .process_item .title .name p {
    color: #333;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .process_item .icon_step {
    float: left;
    margin: 3px 12px 0 0;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 13px;
    color: #fff;
    text-align: center;
    border-radius: 50%;
    background-color: #458be9;
  }

  .process_item .icon_step_check {
    background: #458be9 url(../../assets/images/icon_step_check.png) no-repeat center;
    background-size: 11px;
  }

  .process_item .content {
    padding-bottom: 15px;
    margin: 6px 8px;
    border-left: 2px #8ebbf4 solid;
  }

  .process_item:last-child .content {
    border-left: none;
  }

  .process_item .content p {
    margin-left: 20px;
    color: #999;
    font-size: 14px;
    line-height: 21px;
  }

  .processFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 8px 15px;
    background: #fff;
    box-sizing: border-box;
  }

  .processFooter::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
</style>
