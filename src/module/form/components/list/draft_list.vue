<template>
    <div class="qwui-cardList">
        <div class="qwui-cardList_item flexbox" v-for="(item,index) in list" :key="item.id">
			<router-link :to="{name: 'add', query: { id: item.id,type:'edit'}}" tag="div" class="flexItem  pr15" >
				<h3>{{item.instanceTitle}}</h3>
				<p>{{isTask(item.isTask) + timestr(item.createaTime)}}</p>
			</router-link>
			<i class="qwui-icon-operate showActionSheet" @click="deleteData(item.id,index)"></i>
        </div>
    </div>
</template>

<script>

    export default {
        props:['list'],
        data(){
            return {
            }
        },
        computed:{

        },
        methods:{
            isTask(task){
                var text = '';
                if(task == 0){
                    text = '普通单';
                }else if(task == 1){
                    text = '任务单';
                }else if(task == 2){
                    text = '审批单';
                }else if(task == 3){
                    text = '外部单';
                }
                    return text;
            },
            timestr(createTime){
                if(createTime != null && createTime != 'null' && createTime != ''){
                    try{
                        createTime = new Date(createTime.substr(0,10)).Format("MM-dd");;
                    }catch(e){}
                }
                return '·'+createTime;
            },
            deleteData(id,index){
                var _this = this;
                dataBase.dialogBottomConfig.show = true;
                dataBase.dialogBottomConfig.btnConfig[0].callBack = function(){
                    dataBase.dialogBottomConfig.show = false;
                    _.showLoading();
                    //判断能否删除
                    _.ajax({
                        url:_.baseURL+"/portal/portalFormAction!ajaxBatchCheck.action",
                        type:"post",
                        data:{
                            "ids":id
                        },
                        dataType:"json",
                        success:function(result){
                            if(result.code!="0"){
                                //不能删除
                                _.hideLoading();
                                _.alert("提示", result.desc);
                            }else{
                //                删除数据
                                _.ajax({
                                    url:_.baseURL+"/portal/portalFormAction!ajaxBatchDelete.action",
                                    type:"post",
                                    data:{
                                        "ids":id
                                    },
                                    dataType:"json",
                                    success:function(result){
                                        _.hideLoading();
                                        if ("0" == result.code) {
                                        //把需要删除的表单的索引发送给父组件
                                        _this.$emit('listenUpdateList',index)
                                        _.tooltips_succeed('删除成功', true);
                                        } else {
                                            _.alert("提示", result.desc);
                                        }
                                    }
                                });
                            }
                        },
                    });
                }
            }
        },
    }
</script>

<style scoped>
  .pr15{
    padding-right: 15px;
  }
</style>
