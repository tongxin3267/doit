<template>
  <div class="wrap qwui-message_container">
    <template v-if="list.length">
      <scroll ref="scroll"
              :data="list"
              :pullUpLoad="pullUpLoad"
              @pullingUp="onPullingUp">
        <div v-for="item in list"
             :key="item.chatId"
             class="qwui-message_item"
             @click="navigateToChat(item.chatId)">
          <div class="qwui-message_badge">
            <img class="qwui-message_avatar"
                 :src="item.headPic"
                 width="50"
                 height="50"
                 alt="">
            <div class="qwui-message_dot"
                 v-if="+item.count">{{item.count}}</div>
          </div>
          <div class="qwui-message_section">
            <div class="qwui-message_title">
              <span class="qwui-message_name">{{item.chatName}}</span>
              <span class="qwui-message_time">{{item.nexSendMsgTime}}</span>
            </div>
            <span class="qwui-message_content">{{item.lastComment}}</span>
          </div>
        </div>
      </scroll>
    </template>
    <template v-else>
      <div class="qwui-message_nomessage">
        <div class="qwui-message_logo"></div>
        <span class="qwui-message_text">暂无记录</span>
      </div>
    </template>
  </div>
</template>

<script>
import Scroll from '../../../components/scroll/scroll'
import { getChatList } from '../../../api/smallProgram/getBata.js'

export default {
  components: { Scroll },
  data() {
    return {
      show: true,
      query: {
        chatType: 1,
        page: 1,
        pageSize: 10
      },
      list: [],
      total: '',
      pullUpLoad: true
    }
  },
  created() {
    this.getChatList()
  },
  methods: {
    // 获取聊天列表
    getChatList() {
      getChatList(this.query, res => {
        this.list = this.list.concat(res.pageData)
        this.total = res.maxPage
      })
    },
    // 上拉加载
    onPullingUp() {
      if (this.query.page === this.total) {
        this.pullUpLoad = false
      } else {
        this.query.page++
        this.getChatList()
      }
    },
    // 跳转到聊天室
    navigateToChat(chatId) {
      this.$router.push({ path: '/chat', query: { chatId } })
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-message_container {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  .qwui-message_item {
    width: 100%;
    height: 74px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f7f8fa;
    .qwui-message_badge {
      position: relative;
      font-size: 0;
      .qwui-message_avatar {
        margin: 0 14px;
        border-radius: 50%;
      }
      .qwui-message_dot {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 0;
        right: 10px;
        border-radius: 50%;
        background-color: #fe5354;
        color: #fff;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
      }
    }
    .qwui-message_section {
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      overflow: hidden;
      .qwui-message_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 15px;
        .qwui-message_name {
          font-size: 16px;
          color: #343434;
          font-weight: bold;
        }
        .qwui-message_time {
          font-size: 12px;
          color: #a2a4a7;
        }
      }
      .qwui-message_content {
        font-size: 14px;
        color: #7a7c80;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-right: 15px;
      }
    }
  }
  .qwui-message_nomessage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .qwui-message_logo {
      width: 160px;
      height: 160px;
      background: url('../../../../../assets/images/crm/crm_nocomment.png')
        center no-repeat;
      background-size: cover;
    }
    .qwui-message_text {
      color: #a2a5b2;
      font-size: 14px;
    }
  }
}
</style>
