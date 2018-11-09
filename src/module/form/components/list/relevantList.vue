<template>
    <ul class="qwui-cardList">
        <router-link :to="{name: 'detail', query: { id: item.id}}" @click.native="setPagerNum(index)" tag="li" v-for="(item,index) in list" class="qwui-cardList_item flexbox" :key="item.id">
            <div class="flexItem pr15">
                <h3>{{item.instanceTitle}}</h3>
                <p class="ellipsis">{{timeStr(item.createaTime) + ' ' + item.formTitle}} </p>
            </div>
        </router-link>
    </ul>
</template>

<script>
import { mixinList } from './list'

export default {
    mixins: [mixinList],
    props: ['list']
}
</script>
<style scoped>
  .pr15{
    padding-right: 15px;
  }
</style>
