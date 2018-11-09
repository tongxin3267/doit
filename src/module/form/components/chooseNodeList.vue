<template>
  <div>
    <div class="selectBox">
      <div class="selectBoxContent">
        <chooseNextNode v-if="nextNodeList.length>1"></chooseNextNode>
        <!--选择处理人-->
        <div v-if="FlowAuditUser.length">
          <user_selected_group
            class="chooseNodeListUI"
            v-if="item && item.startAuditList.show"
            v-for="(item,index) in FlowAuditUser"
            :title="startAuditTitle(item.nodeName)"
            :mustChoose="true">
            <user_selected_item
              v-if="flowNodeItemKeysShow"
              slot="user_selected_item"
              :isEdit="item.startAuditList.isCanEdit"
              :List="item.startAuditList.userSelected"
							:title="startAuditTitle(item.nodeName)"
							@showPersonList="showPersonList"
							@showUserSelectedBox="FlowAuditUserShowBox(index)"
							@removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
              :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
            </user_selected_item>
            <div class="qwui-user_cell_title" slot="qwui-user_select_person_open"
              v-show="item.startAuditList.flowNodeItemKeys&&item.startAuditList.allUser.length===0">
              <p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>
            </div>
          </user_selected_group>
        </div>
        <!--选择其它处理人-->
        <user_selected_group
          :title="'['+item.nodeName+']处理人'"
          v-for="(item,index) in appointNodeAndUserVOList"
          class="chooseNodeListUI" :mustChoose="true">
          <user_selected_item
            slot="user_selected_item"
            :List="flowChioseNodeAuditUser[index]"
						:title="'['+item.nodeName+']处理人'"
						@showPersonList="showPersonList"
						@showUserSelectedBox="otherAuditUserShowBox(index)"
						ref="item.nodeId"
            @removeSelected="(payload)=>{removeChioseNodeUser({parentIndex:index,index:payload.index})}">
          </user_selected_item>
        </user_selected_group>
      </div>
      <button_group :fixed="true">
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
			// 人员控件关联下一步处理人组件显示
			flowNodeItemKeysShow() {
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					if(this.FlowAuditUser[0].startAuditList.allUser.length === 0){
						return false
					}else{
						return true
					}
				}else if(this.FlowAuditUser[0].startAuditList){
					return true;
				}else{
					return false;
				}
			}
    },
    created: function () {
      if(!this.nextNodeList.length){return}
      this.$store.commit("updateUserSelectedData", {type: 'choosedNodeName', data: this.nextNodeList[0].nodeName})
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
			showPersonList (title,list){                                           //显示人员预览弹窗
				this.$emit("showPersonList",title,list,true);
			},
      startAuditTitle:function(nodeName) {
        return nodeName ? '['+nodeName+']处理人' : '处理人'
      },
			// 查询人员控件字段
			isItemKeys(keys){
				var str = '';
				if(keys){
					this.$store.state.formBase.schema.forEach((item) => {
						if(keys.indexOf(item._id) >= 0){
							str += item.label + '，';
						}
					})
				}
				return str.substring(0,str.length-1);
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
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 3;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F7F7F7;
  }
  .selectBoxContent{
    position: absolute;
    top: 0;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
  }
  .selectBoxContent::-webkit-scrollbar {
    width: 0;
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
    padding: 0px;
  }
  .chooseNodeListUI .qwui-user_select_add {
    margin-bottom: 15px;
  }
</style>
