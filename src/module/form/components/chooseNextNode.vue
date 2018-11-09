<template>
  <div>
    <p v-show="nextNodeList.length>1" class="chooseNodeListUI-title">选择下一步处理节点</p>
    <div class="selectNodeBox" @click="showNodeBox">
      {{choosedNodeName}}
      <i class="qwui-click_icon_right"></i>
    </div>
    <div class="selectBox" v-if="isShowNodeBox">
      <div class="selectTitle">选择下一步处理节点</div>
      <div class="selectBoxContent">
        <label class="nodeItem"
               v-for="(item,index) in nextNodeList"
               :for="item.nodeId">
          <input type="radio" class="icon_check" :value="item.id" :checked="item.id==nextNodeId" @change="changeNodeId(item)">
          <div class="nodeItemContent">
            <p>{{item.nodeName}}</p>
            <p v-for="(childItem,index) in item.nextNodeList" v-if="item.nodeStatus==3&&item.ext1!=2">· {{childItem.nodeName}}</p>
          </div>

        </label>
      </div>
      <button_group :fixed="true">
        <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
      </button_group>

    </div>
  </div>
</template>
<script>
  import audit_flow_api from "@/components/flow/api/getData.js";
  import {qwui_button, button_group} from '@/components/base/button'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import {getMember} from '../js/getData.js'

  export default {
    components: {
      button_group,
      qwui_button,
    },
    name: "chooseNextNode",
    data() {
      return {
        isShowNodeBox:false,
        initNextNodeId:'',//初始下一节点id，id不同时才请求处理人
      }
    },
    computed: {
      ...mapState({
        nextNodeList: state => state.userSelected.nextNodeList,
        flowId: state => state.userSelected.flowId,
        currentNodeId: state => state.userSelected.currentNodeId,
        nextNodeId: state => state.userSelected.nextNodeId,
        choosedNodeName: state => state.userSelected.choosedNodeName,
        parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,
        nodeInfo: state => state.userSelected.nodeInfo,
      })
    },
    created: function () {
      this.initNextNodeId = this.nextNodeId;
    },
    methods: {
      showNodeBox() {
        this.isShowNodeBox = !this.isShowNodeBox
      },
      changeNodeId(nodeItem) {
        let chooseNodeTitle = ''
        let parallelNextNodeIds = ''
        if (nodeItem.nodeStatus == 3 && nodeItem.ext1 != 2) {
          this.isParallelNode = true
          chooseNodeTitle += '并行处理：'
          for (var i = 0; i < nodeItem.nextNodeList.length; i++) {
            parallelNextNodeIds += nodeItem.nextNodeList[i].id + ','
            if (i == nodeItem.nextNodeList.length - 1) {
              chooseNodeTitle += nodeItem.nextNodeList[i].nodeName
            } else {
              chooseNodeTitle += nodeItem.nextNodeList[i].nodeName + "+"
            }
          }
        } else {
          chooseNodeTitle += nodeItem.nodeName
          parallelNextNodeIds = ""
        }
        this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: nodeItem.id})
        this.$store.commit("updateUserSelectedData", {type: 'choosedNodeName', data: nodeItem.nodeName})
        this.$store.commit("updateUserSelectedData", {type: 'parallelNextNodeIds', data: parallelNextNodeIds})
      },
      confirmSelected() {
        this.isShowNodeBox = !this.isShowNodeBox
        if(this.initNextNodeId == this.nextNodeId)return
        this.initNextNodeId = this.nextNodeId
        var paramData = {
          definitionId:'',
          flowId:this.flowId,
          id:"",//新建是空的
          currentNodeId:this.currentNodeId,
          nextNodeId:this.nextNodeId,
          isBranchFlow: true,
          parallelNextNodeIds:this.parallelNextNodeIds
        }
        audit_flow_api.getFlowAuditUser(paramData, this.auditUserCallback);
        
      },
      auditUserCallback(data) {
				//判断下一节点是否是人员控件选择的处理人
        var flowNodeItemKeys = data.nodeInfo[0].flowNodeItemKeys;
				if(flowNodeItemKeys){
          var ItemKeys = []
          ItemKeys = flowNodeItemKeys.split('|');
					this.$store.commit('updateFlowNodeItemKeys', flowNodeItemKeys);
					let users = [];
					let userItem = [];
					for(let i=0; i<ItemKeys.length; i++){
						var person = this.$store.state.formBase.data[ItemKeys[i]] || [];
						userItem.push(...person);
						if(userItem){
							userItem.forEach(item =>{
								let arry = item.split('_');
								users.push(arry[0])
							});
						}
					}
					let ids = users.unique().join(',');
					ids && getMember(ids, (res) => {
            this.$store.commit('updateItemKeysSelected',res);
					});
				}
        this.$store.commit('updateFlowAuditUser', data.nodeInfo);
        /*this.nodeInfo.forEach((data,index) => {
          // 如果有处理人,且可以显示
          if (!data.startAuditList || !data.startAuditList.show) {
            this.$store.commit('resetFlowAuditUser',{index})
          }
        })*/
      },
    }
  }
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F7F7F7;
  }
  .selectBoxContent{
    position: absolute;
    top:54px;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
    background-color: #fff;
  }
  .selectBoxContent::-webkit-scrollbar {
    width: 0;
  }
  .chooseNodeListUI-title {
    font-size: 16px;
    padding: 15px 15px 10px;
    color: #333;
  }
  .selectNodeBox {
    position: relative;
    margin: 0 15px 15px;
    padding: 10px;
    color: #333;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: #fff;
    box-sizing: border-box;
  }
  .selectNodeBox:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    transform: scale(0.5);
    transform-origin: left top;
  }
  .qwui-click_icon_right {
    display: block;
    position: absolute;
    top: 50%;
    right: 15px;
    width: 9px;
    height: 15px;
    background:0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    transform: translate(0,-50%);
  }
  .selectTitle{
    position: absolute;
    top: 0;
    padding: 10px 15px;
    width: 100%;
    color: #333;
    font-size: 16px;
    background-color: #fff;
  }

  .nodeItem{
    position: relative;
    display: flex;
    align-items: center;
    padding: 18px 15px;

  }
  .nodeItem::after{
    content: " ";
    position: absolute;
    bottom: 0;
    left: 15px;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
  .nodeItemContent p{
    color: #999;
    font-size: 13px;
  }
  .nodeItemContent p:nth-child(1){
    color: #333;
    font-size:16px;
  }
  .nodeItemContent p:nth-child(2){
    margin-top: 10px;
  }
</style>
