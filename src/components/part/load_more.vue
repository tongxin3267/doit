<template>
  <div class="qwui-showMoreList" v-show="showLoading">
    <p @click="loadMoreClick">
      <span v-if="loading"><i class="qwui-icon_loadingMore"></i>正在加载</span>
      <span v-else-if="loadable">向上滑加载更多</span>
      <slot v-else></slot>
    </p>
  </div>
</template>
<script>
  import noRecord from '@/components/base/no_record';
  export default {
    name: 'loadMore',
    props:{
      autoload:{  //默认自动加载
        type:Boolean,
        default:true,
      },
      loading:{     //正在加载
        type:Boolean,
        required:true,
        default:false,
      },
      currentRows:{
        type:[Number,String],// 当前条数
        required:true,
      },
      maxPage:{
        type:[Number,String],// 总数
        required:true,
      },
    },
    data() {
      return {

      }
    },
    computed:{
      showLoading(){
        return (this.currentRows!='' && this.maxPage!='');
      },
      loadable(){
        return !this.loading && this.currentRows<this.maxPage;
      },
    },
    methods:{
      loadMoreClick(){
        if(this.currentRows<this.maxPage){
          this.$emit("loadMoreClick",true);
        }
      },
    }
  }
</script>
<style>
  .qwui-showMoreList{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }
</style>
