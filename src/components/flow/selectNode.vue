<template>
  <!--选择节点弹窗-->
  <Mask_fix :show="showNodeMask" :colorType="''">
    <div class="qwui-flow_selectNode_box">
      <div class="qwui-flow_selectNode_item">
        <ul>
          <user_title_list
            :title="ListName.title"
            :headPic="ListName.headPic"
            :colorType="''">
            <span class="choose-list_user_name">{{ListName.personName}}</span>
            <span class="choose-list_user_time">{{ListName.createTime && ListName.createTime.substring(0,10)}}</span>
          </user_title_list>
        </ul>
        <p class="qwui-flow_selectNode_title">{{title}}</p>
        <div class="choose_node_list">
          <ul>
            <li class="qwui-flowNodeList_select" v-for="item in NodeList" :key="item.id" @click="selectNodeClick(item)">
              <p class="nodeName">{{item.nodeName}}</p>
              <span class="qwui-icon_arrow_right"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Mask_fix>
</template>
<script>
  import Mask_fix from '@/components/part/mask_fix';
  import user_title_list from '@/components/list/user_title_list';
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  export default {
    name:"QWSelectNode",
    data() {
      return {}
    },
    computed:{
      ...mapState({
        detailData:state => state.selectNode.detailData,
        title:state => state.selectNode.title,
        NodeList: state => state.selectNode.NodeList,
        ListName: state => state.selectNode.ListName,
        showNodeMask: state => state.selectNode.showNodeMask
      }),
    },
    created (){
      this.$store.commit('resetSelectNodeData')
    },
    methods: {
      selectNodeClick(data){
        this.$emit("selectNodeClick",data,this.detailData)
        this.$store.commit("updateShowNodeMask",false)
      }
    },
    components: {
      Mask_fix,
      user_title_list
    }
  }
</script>
<style scoped>
  .qwui-flow_selectNode_box{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 5px solid #7A7A7A;
  }
  .qwui-flow_selectNode_item{
    position: inherit;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 15px 0px;
    margin: 5px;
  }
  .qwui-flow_selectNode_title{
    padding-top: 20px;
    font-size: 16px;
    color: #333;
  }
  .qwui-flowNodeList_select{
    display: flex;
    padding: 10px;
    margin-top: 15px;
    font-size: 16px;
    color: #333;
    border-radius: 4px;
    background: #fff;
  }
  .qwui-flowNodeList_select .nodeName{
    flex: 1;
  }
  .choose_node_list ul{
    position: absolute;
    bottom: 60px;
    top: 125px;
    left: 0;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .choose_node_list ul::-webkit-scrollbar{
    width: 0;
  }
  .choose-list_user_name{
    padding-right: 20px;
    line-height: 18px;
    vertical-align: middle;
  }
  .choose-list_user_time{
    margin-right: 10px;
    line-height: 18px;
    vertical-align: middle;
  }
</style>
