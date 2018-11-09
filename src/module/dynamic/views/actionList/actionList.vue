<template>
  <div class="qwui-action">
    <div class="qwui-action_list" v-for="(item,index) in list" >
      <div class="check_box" v-if="useCheck">
        <label :for="listId(item)" class="check_label">
          <input type="checkbox"  v-model="checkList" :value="listId(item)" :id="listId(item)">
          <span ></span>
        </label>
      </div>
      <div class="msg" @click="toDetail(item,index)">
        <p class="name">{{nameFilter(item)}}</p>
        <p class="description">
          {{item.personName}}<span class="divide">|</span>{{descriptionFilter(item)}}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      list:{
        type:Array,
      },
      useCheck:{
        type:Boolean,
        default:false
      },
      listIndex:String|Number
    },
    data(){
      return {
        checkList:[],
      }
    },
    watch:{
      checkList:function (val) {
        this.$emit("returnList", val);
      }
    },
    methods:{
      listId:function(val){
        return this.listIndex == '1' ? val.dynamicInfoId : val.commentId
      },
      nameFilter:function (val) {
        return this.listIndex == '1' ? val.title : val.content
      },
      descriptionFilter:function (val) {
        return this.listIndex == '1' ? val.summary : val.title
      },
      //跳到详情
      toDetail:function (val,index) {
        this.$router.push({
          path: '/partyDetail',
          query: { id:(this.listIndex == '1' ? val.dynamicInfoId : val.dynamicinfoId), page:index+1}
        })
      }
    }
  }
</script>
<style src="../../scss/actionList.scss" lang="scss">
</style>
