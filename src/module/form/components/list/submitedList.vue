<template>
    <div class="qwui-cardList">
        <div
            class="qwui-cardList_item flexbox"
            v-for="(item,index) in list"
            :key="item.id">
        <router-link
            class="flexItem pr20"
            :to="{name: 'detail', query: { id: item.id}}"
            tag="div">
            <h3>{{item.instanceTitle}}</h3>
            <p>
            <span
                class="applyStatus"
                :class="statusClass(item.isTask,item.isClose,item.isover)">{{showStatus(item.isTask,item.isClose,item.isover)}}</span>
            {{isTask(item.isTask) +  '·' + timeStr(item.createaTime)}}</p>
            <p>{{currentNodestr(item.currentNode)}}</p>
        </router-link>
        <i
            class="qwui-icon-operate showActionSheet"
            @click="deleteData(item.id,index)"></i>
        </div>
    </div>
</template>

<script>
import { mixinList } from './list'
import { submitSearch, submitCheck, submitDel } from '../../api/list'

export default {
    mixins: [mixinList],
    props: ['list'],
    methods: {
        deleteData(id,index) {
            let _this = this;

            dataBase.dialogBottomConfig.show = true;
            dataBase.dialogBottomConfig.btnConfig[0].callBack = function(){
                dataBase.dialogBottomConfig.show = false;
                _.showLoading("正在删除...");
                submitCheck(id).then((res) => {
                    _.hideLoading();
                    if(res.code != "0") {
                        return _.alert("提示", res.desc);
                    }
                    submitDel(id).then((res) => {
                        if(res.code != "0") {
                            return _.alert("提示", res.desc);
                        }
                        //删除列表的li
                        _this.$emit('deleteList',index);
                        _.tooltips_succeed(res.desc);
                    })
                })
            }
        }
    }
}
</script>
<style scoped>
  .pr20{
    padding-right: 20px;
  }
</style>


