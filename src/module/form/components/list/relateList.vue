<template>
    <div class="qwui-cardList">
        <router-link
            class="qwui-cardList_item flexbox"
            v-for="(item,index) in list"
						@click.native="setPagerNum(index)"
						:key="item.id"
            tag="div"
            :to="{name: 'detail', query: { id: item.id}}">
        <div class="qwui-cardList_img">
            <img
                :src="item.headPic"
                @error="noFind"></div>
        <div class="flexItem pr15">
            <h3>{{item.instanceTitle}}</h3>
            <p>
            <span class="applyStatus" :class="statusClass(item.isTask,item.isClose,item.isover)">{{showStatus(item.isTask,item.isClose,item.isover)}}</span>
            {{timeStr(item.createaTime) + ' ' + item.personName}}</p>
            <p>{{currentNodestr(item.currentNode)}}</p>
        </div>
        </router-link>
    </div>
</template>

<script>
import { mixinList } from './list'
export default {
    mixins: [mixinList],
    props:['list']
}
</script>
<style scoped>
  .pr15{
    padding-right: 15px;
  }
</style>

