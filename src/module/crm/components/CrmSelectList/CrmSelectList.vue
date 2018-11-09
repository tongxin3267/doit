/**
  *  @param listData(必传)：列表数据
  *  @param activeIdx(默认:0)：当前选中的索引值
  *  @param selectEvent：点击列表项回调函数
  *  @example
  *      <parent>
  *          <crm-select-list
  *              :listData="poolListData"
  *              :activeIdx="activeIdx"
  *              @selectEvent="selectPool"
  *          ></crm-select-list>
  *      </parent>
  */
<template>
    <ul class="crm_select_list">
        <li
            class="select_list_item"
            :class="{active: currentId == item.id}"
            v-for="(item,idx) in listData"
            :key="idx"
            @click="handleClick(item.id, item.title)"
        >{{item.title}}</li>
    </ul>
</template>
<script>
export default {
    name: 'CrmSelectList',
    props: {
        // 数据列表
        listData: {
            type: Array,
            required: true
        },

        // 选中的id
        activeId: {
            type: String,
           required: true
        }
    },
    data () {
        return {
            // 当前idx
            currentId: this.activeId
        }
    },
    methods: {
        // 点击列表项
        handleClick (id, title) {
            this.currentId = id;
            this.$emit('selectEvent', id, title);
        }
    }
}
</script>
<style lang="scss">
@import './CrmSelectList.scss';
</style>


