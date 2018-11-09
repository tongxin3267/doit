<template>
    <div class="qwui-cardList">
         <router-link
            class="qwui-cardList_item flexbox ku_arrow"
            v-for="(item,index) in list"
            :key="item.id"
            tag="div"
            :to="{name: 'detailData', query: { id: item.definitionVersionsId, isTask: '3'}}">
            <div class="flexItem pr15">
                <h3>{{item.formName}}</h3>
                <p>共有{{item.count}}条明细数据</p>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'openList',
    props: ['list'],
    data() {
        return {

        }
    }
}
</script>
<style scoped>
  .pr15{
    padding-right: 15px;
  }
</style>

