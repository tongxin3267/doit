/** 
  *  @param listData(默认:[])：列表数据，列表项数据格式参照CrmListItem
  *  @param isEllipsis(默认:false)：标题是否自动省略，否则自动换行
  *  @param rightDel(默认:false)：删除图标是否在列表项右边
  *  @param canSelect(默认:false)：是否可以选择选项
  *  @param onLine(默认:false)：是否点击一行可以触发选择框
  *  @param delEvent: 删除列表回调函数
  *  @param itemEvent：列表项点击回调函数
  *  @param selectEvent：选择框点击回调函数
  *  @example
  *      <parent>
  *          <crm-list :listData="listData" @itemEvent="goDetail" @delEvent="delItem"></crm-list>
  *      </parent>
  */
<template>
    <div class="crm_list">
        <crm-list-item 
            v-model="item.isSelect"
            v-for="(item,idx) in listData" 
            :key="idx" 
            :itemData="item" 
            :isEllipsis="isEllipsis"
            :rightDel="rightDel"
            :canSelect="canSelect"
            :itemIdx="idx" 
            :oneLine="oneLine"
            @click="goDetail(item.id, item.callBackVal)" 
            @delEvent="delEvent(item.id)"
            @input="selectItem"
        ></crm-list-item>
    </div>
</template>
<script>
import CrmListItem from '../CrmListItem/CrmListItem';
export default {
    name: 'CrmList',
    components: {
        CrmListItem
    },
    props: {
        // 列表数据
        listData: {
            type: Array,
            default: []
        },

        // 标题是否自动省略
        isEllipsis: {
            type: Boolean,
            default: false
        },

        // 删除图标是否在列表项右边
        rightDel: {
            type: Boolean,
            default: false
        },

        // 是否可以选择选项
        canSelect: {
            type: Boolean,
            default: false
        },

        // 是否点击一整行可以触发选择框
        oneLine: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 跳转详情
        goDetail (id, callBackVal) {
            this.$emit('click', id, callBackVal || '');
        },

        // 删除列表项
        delEvent (id) {
            this.$emit('delEvent', id);
        },

        // 点击选择框
        selectItem () {
            let selectArry = [];
            this.listData.map((item,idx) => {
                if(item.isSelect){
                    selectArry.push(item.id);
                }
            });
            this.$emit('selectEvent', selectArry);
        }
    }
}
</script>
<style lang="scss">
@import './CrmList.scss';
</style>


