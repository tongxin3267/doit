<template>
  <div class="user_select_pop">
    <div class="user_select_box">
      <div class="user_select_content">
        <chooseNextNode v-if="nextNodeList.length>1"></chooseNextNode>
        <!--选择处理人-->
        <div v-if="FlowAuditUser.length">
          <user_selected_group
            customClass="chooseNodeListUI"
            v-if="item && item.startAuditList.show"
            v-for="(item,index) in FlowAuditUser"
            :key="index"
            :title="startAuditTitle(item.nodeName)"
            :mustChoose="true">
            <user_selected_item
              slot="user_selected_item"
              :title="startAuditTitle(item.nodeName)"
              :isEdit="item.startAuditList.isCanEdit"
              :List="item.startAuditList.userSelected"
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
        <user_selected_group
          :title="'['+item.nodeName+'] 处理人'"
          v-for="(item,index) in appointNodeAndUserVOList"
          :key="index"
          class="chooseNodeListUI" :mustChoose="true">
          <user_selected_item
            slot="user_selected_item"
            ref="item.nodeId"
            :List="flowChioseNodeAuditUser[index]"
            :title="'['+item.nodeName+'] 处理人'"
            :widthSize="widthSize"
            @showUserSelectedBox="otherAuditUserShowBox(index)"
            @showPersonList="showPersonList"
            @removeSelected="(payload)=>{removeChioseNodeUser({parentIndex:index,index:payload.index})}">
          </user_selected_item>
        </user_selected_group>
      </div>
      <button_group>
        <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="saveNodeAuditUser"></qwui_button>
      </button_group>
    </div>
  </div>
</template>

<script>
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import chooseNextNode from '../components/chooseNextNode'
  import {qwui_button, button_group} from '@/components/base/button'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import audit_flow_api from '@/components/flow/api/getData'
  export default {
    components: {
      button_group,
      qwui_button,
      user_selected_item,
      user_selected_group,
      user_selected_ranglist,
      chooseNextNode
    },
    name: "choose-node-list",
    props: {
    },
    data() {
      return {
        dataBase,
        parallelNextNodeIds:''
      }
    },
    computed: {
      ...mapState({
        appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,
        flowChioseNodeAuditUser: state => state.userSelected.flowChioseNodeAuditUser,
        nextNodeList: state => state.userSelected.nextNodeList,
        FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
      }),
      widthSize(){
        return { paddingSize:10}
      }
    },
    created: function () {
      if(!this.nextNodeList.length){return}
    },
    methods: {
      ...mapMutations([
        "removeFlowAuditUser",   // 删除处理人
        "removeChioseNodeUser",
        "saveNodeAuditUserJson"
      ]),
      ...mapActions([
        "updateFlowUserSelected",     // 更新已选处理人
        "updateAppointNodeVOList",    // 更新节点列表
        "updateNextNodeList",         // 更新下个节点列表
      ]),
      startAuditTitle:function(nodeName) {
        return nodeName ? '['+nodeName+'] 处理人' : '处理人'
      },
      FlowAuditUserShowBox(index){
        this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})

        // 如果是指定范围选人
        if(this.FlowAuditUser[index].startAuditList.assignRange) {
          this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
        }
      },
      cancelSelected(){
        this.$store.commit("updateUserSelectedData",{type:"nextNodeListShow",data:false})
      },
      showPersonList (title,list){                                           //显示人员预览弹窗
        this.$emit("showPersonList",title,list,true);
      },
      // 选择其它节点处理人
      otherAuditUserShowBox(index) {
        let self = this
        let toPersonList = this.dataBase.selectConfig.selectList.toPersonList
        this.dataBase.selectConfig.signIndex="toPersonList"
        this.dataBase.selectConfig.show=true
        toPersonList.userSelected.length=0
        if(this.flowChioseNodeAuditUser.length && this.flowChioseNodeAuditUser[index]) {
          toPersonList.userSelected.push(...this.flowChioseNodeAuditUser[index])
        }
        toPersonList.callBack.confirm=function (type, obj) {
          toPersonList.userSelected.length=0
          toPersonList.userSelected.push(...obj.user.data);
          self.$store.commit('updateChooiseNodeAuditUser',{
            index: index,
            data: obj.user.data
          })
        }
      },

      saveNodeAuditUser() {
        if (!audit_flow_api.isCheckAuditUser({FlowAuditUser: this.FlowAuditUser})) return
        if (this.appointNodeAndUserVOList.length) {
          if (!audit_flow_api.isCheckAppointNodeAndUser({flowChioseNodeAuditUser: this.flowChioseNodeAuditUser})) return
        }
        this.saveNodeAuditUserJson();
        this.$emit('saveNodeAuditUserJson');
      },
    }
  }
</script>

<style>
  @media screen and (min-width: 1024px) {
    .user_select_pop{
      width: 740px;
      margin: auto;
    }
    .user_select_pop .qwui-btn_box{
      width: 730px!important;
    }
  }
  .user_select_pop{
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
  .user_select_box {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #F7F7F7;
  }
  .user_select_content{
    flex: 1;
    position: relative;
    top: 0;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
  }
  .user_select_content::-webkit-scrollbar {
    width: 0;
  }
  .qwui-user_select_charge_view.chooseNodeListUI{
    background-color: transparent;
  }


</style>
