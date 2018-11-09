<template>
  <div class="qwui-showMoreList" :class="['qwui-backgroundColor_'+colorType,{'borderTop':borderTop}]" v-show="showLoading">
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
      type:{                            //列表类型：commentList：评论，默认为others
        type:String,
        default:"others",
      },
      autoload:{                      //默认自动加载
        type:Boolean,
        default:true,
      },
      loading:{     //正在加载
        type:Boolean,
        required:true,
        default:false,
      },
      hasMore:{
        type:Boolean,
        default:false,
      },
      currPage:{
        type:[Number,String],// 当前条数
        required:false,
        default:"",
      },
      maxPage:{
        type:[Number,String],// 总数
        required:false,
        default:"",
      },
      colorType:{
        type:String,
        default:'',
      },
      borderTop:{
        type:Boolean,
        default:false,
      }
    },
    data() {
      return {

      }
    },
    computed:{
      showLoading(){
        if(this.type!="commentList"){
          return (this.currPage && this.maxPage);
        }else{
          return true;
        }
      },
      loadable(){
        if(this.type!="commentList"){
          return !this.loading && this.currPage<this.maxPage;
        }else{
          return !this.loading && this.hasMore;
        }
      },
    },
    methods:{
      loadMoreClick(){
        if(this.currPage<this.maxPage){
          this.$emit("loadMoreClick",true);
        }else if(this.hasMore){
          this.$emit("loadMoreClick",true);
        }
      },
    }
  }
</script>
<style scoped>
  .qwui-showMoreList{
    position: relative;
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }
  .qwui-showMoreList.borderTop:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
</style>
