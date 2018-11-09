<template>
    <div class="member_item">
        <div class="member_msg">
            <img :src="item.headPic">
            <span>{{item.memberName}}</span>
        </div>
        <div class="mt5 goal_data">
            <p class="goal_num data_item">
                <span class="c999">目标：</span>
                <span class="c666">{{item.goalAmount | formatMoney}}元</span>
            </p>
            <p class="data_item">
                <span class="c999">完成：</span>
                <span class="c666">{{item.goalFinishedAmount | formatMoney}}元</span>
            </p>
        </div>
        <div>
            <div class="data_progress">
                <div class="ring-left"></div>
                <div class="ring-right"></div>
                <div class="rings-left" :style="{transform: 'rotateZ(' + (-item.leftDeg) + 'deg)', zIndex: item.leftDeg > 0? 6 : 2}"></div>
                <div class="rings-right" :style="{transform: 'rotateZ(' + (-item.rightDeg) + 'deg)'}"></div>
                <div class="ring-info">
                    <p class="rate_num">{{item.finishRate}}</p> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props: {
        item: {
            type: Object
        }
    }
}
</script>
<style scoped>
.mt5{
    margin-top: 0.42rem;
}
.member_item:after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #ddd;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
.member_item{
    position: relative;
    padding: 1.25rem 0;
}
.member_item:last-child:after{
    content: normal;
}
.member_msg{
    width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.member_msg img{
    display: inline-block;
    margin-right: 0.42rem;
    width: 2.17rem;
    height: 2.17rem;
    vertical-align: middle;
    border-radius: 3px; 
}
.goal_num{
    position: relative;
    padding-right: 1.67rem;
    margin-right: 1rem;
}
.goal_num::after{
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #ddd;
    transform: scaleX(0.5);
    transform-origin: 0 0;
}
.data_item{
    display: inline-block;
    font-size: 1.08rem;
}
.data_progress{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 1.25rem;
    margin: auto;
    height: 46px;
    width: 46px;
}
.ring-left{
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 40px;
    border: 3px solid #D0D0D0;
    border-radius: 42px 0 0 42px;
    border-right: none;
    z-index: 3;
}
.ring-right{
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 40px;
    border: 3px solid #D0D0D0;
    border-radius: 0 42px 42px 0;
    border-left: none;
    z-index: 5;
}
.rings-left{
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 40px;
    border: 3px solid #468CEB;
    border-radius: 42px 0 0 42px;
    border-right: none;
    transform-origin: right center;
}
.rings-right{
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 40px;
    border: 3px solid #468CEB;
    border-radius: 0 42px 42px 0;
    border-left: none;
    z-index: 4;
    transform-origin: left center;
}
.ring-info{
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -8px;
    width: 100%;
    height: 1.58rem;
    line-height: 1.58rem;
    font-size: 0.92rem;
    text-align: center;
    color: #468CEB;
}
</style>


