<template>
  <div class="qwui-user_select_box">
    <div class="qwui-user_select_charge" v-if="item && item.userSelected.length>0" v-for="(item,index) in userselect">
      <div class="qwui-user_select_title">{{$t(item.title)}}<span class="person_num" v-if="item.num">{{userTitleType(item)}}</span></div>
      <div class="qwui-user_select_item">
        <div class="qwui-user_select_list">
          <ul>
            <li v-for="(list,i) in item.userSelected" v-if="i<4">
              <p class="img" @click.stop.prevent="showPersonDetail(list)" :class="{'active':list.headPic=='0'||list.headPic==''}">
                <img v-if="list.headPic!='0' && list.headPic!=''" :src="list.headPic"  alt="">
              </p>
              <p class="qwui-user_select_person">{{list.personName}}</p>
            </li>
          </ul>
          <i class="qwui-icon_select_right" v-show="item && item.userSelected.length>4" @click="showAllPerson(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'userSelect',
    props:{
      userselect:Object
    },
    data() {
      return {
      }
    },
    methods:{
      userTitleType:function(item){
        if(item.num && item.num>=0){
          return '('+item.num+')';
        }
        return "";
      },
      showAllPerson:function (item) {
        item.show=!item.show;
      },
      showPersonDetail:function (data){
        if(data.userId!=_.userId){
          EventBus.$emit("atThisPersonUtil",data);
        }
      }
    }
  }
</script>
