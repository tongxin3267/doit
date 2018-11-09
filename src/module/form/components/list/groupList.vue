<template>
    <div class="group-list">
        <router-link
            class="group-item flexbox"
            v-for="item in list"
						v-if="item.count>0"
            :key="item.id"
            :to="{ name:'formlist', query:{ typeId: item.id } }">
            <div class="avator">
                <img :src="defaultImgSrc">
            </div>
            <div class="title description_title flexItem">
                <p class="name ellipsis">{{item.typeName}}</p>
            </div>
            <span class="fr c999">{{item.count}}</span>
            <i class="icon-arrow"></i>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'groupList',
    props: ['list'],
    data() {
        return {
            defaultImgSrc: require('@/assets/images/form_type.jpg')
        }
    }
}
</script>

<style>
.group-list {
    background-color: white;
    overflow: hidden;
    line-height: 2.2;
    clear: both;
    font-size: 16px;
    position: relative;
}
.group-item {
    position: relative;
    padding: 10px 35px 10px 15px;
    color: #333;
    line-height: 40px;
}
.group-item::before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #dfdfdd;
    color: #dfdfdd;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
}
.address_list .avator {
    width: 38px;
    height: 38px;
}
.avator {
    width: 40px;
    height: 40px;
    display: block;
    margin-right: 10px;
    position: relative;
    min-width: 38px;
}
.avator img {
    width: 100%;
    height: 100%;
}
.description_title {
    overflow: hidden;
}
.icon-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: url('../../../../assets/images/CSSSprites.png') no-repeat;
    background-size: 101px 101px;
    width: 10px;
    height: 15px;
}
.c999 {
    color: #999;
}
</style>


