<template>
  <div class="qwui-dynamic_detail">
	<img class="qwui-user_avatar" :src="formatImgUrl">
  	<div class="qwui-user_dynamic">
  	  <p class="qwui-user_dynamic_detail">{{formatText}}</p>
  	  <span class="qwui-user_visit_time">{{this.visitTime}}</span>
  	</div>
  </div>
</template>

<script>
export default {
  name: 'QwUserDynamic',
  props: {
    //用户头像
    userAvatar: {
      type: String
    },
    //用户名字
    userName: {
      type: String
    },
    //用户行为
    userDo: {
      type: String
    },
    //访问时间
    visitTime: {
      type: String
    }
  },
  computed: {
    formatImgUrl(){
      return _.filterCompressURL(this.userAvatar);
    },
    formatText(){
      return String(this.userDo);
    }
  }
}
</script>

<style scoped lang="scss">
.qwui-dynamic_detail {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
    .qwui-user_avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
}
.qwui-user_dynamic {
  padding-left: 16px;
  flex-grow: 1;
  overflow: hidden;
}
.qwui-user_dynamic_detail {
  font-size: 14px;
  line-height: 20px;
  color: #0A1735;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.qwui-user_visit_time {
  font-size: 12px;
  line-height: 17px;
  color: #B2B9C8;
}
</style>
