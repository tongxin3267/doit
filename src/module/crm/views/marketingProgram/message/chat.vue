<template>
  <div class="wrap qwui-chat_container">
    <scroll ref="scroll"
            :data="messages"
            :pullDownRefresh="pullDownRefresh"
            @pullingDown="searchChatList"
            class="qwui-chat_content">
      <div class="qwui-chat_time">{{currentTime}}</div>
      <div class="qwui-chat_section"
           v-for="message in messages"
           :key="message.id">
        <template v-if="message.sendType === '1'">
          <receive-post-message v-if="message.type === '4'"
                                :message="message"></receive-post-message>
          <receive-message v-if="message.type === '1'"
                           :message="message"></receive-message>
        </template>
        <send-message v-if="message.sendType === '0'"
                      :message="message"></send-message>
      </div>
    </scroll>
    <div class="qwui-chat_message">
      <input ref="input"
             class="qwui-chat_input"
             v-model="message"
             @click="handleInputFix" />
      <x-button class="qwui-chat_send"
                @click.native="sendMessage"
                type="primary">发送</x-button>
    </div>
  </div>
</template>

<script>
import Scroll from '../../../components/scroll/scroll'
import { XButton } from 'vux'
import ReceiveMessage from './components/ReceiveMessage'
import ReceivePostMessage from './components/ReceivePostMessage'
import SendMessage from './components/SendMessage'
import { formatTime } from '../../../utils'
import { searchChatList, getChatId } from '../../../api/smallProgram/getBata.js'

export default {
  components: {
    XButton,
    ReceiveMessage,
    ReceivePostMessage,
    SendMessage,
    Scroll
  },
  data() {
    return {
      searchQuery: {
        pageSize: 10,
        sort: '',
        id: ''
      },
      pullDownRefresh: true,
      websocket: null,
      messages: [],
      message: ''
    }
  },
  computed: {
    query() {
      return {
        chatId: this.searchQuery.id,
        userId: _.userId
      }
    },
    currentTime() {
      return this.messages[0] && this.messages[0].createTime
    }
  },
  destroyed() {
    this.websocket.close()
  },
  created() {
    this.initChatId().then(() => {
      this.initChatList()
      this.createWebsocket()
    })
  },
  methods: {
    // 初始查询ChatId
    initChatId() {
      return new Promise(resolve => {
        const query = this.$route.query
        if (query.chatId) {
          this.searchQuery.id = query.chatId
          resolve()
        } else if (query.openId) {
          getChatId({ openId: query.openId }, res => {
            this.searchQuery.id = res.chatId
            resolve()
          })
        } else {
          _.alert('提示', '页面查询参数错误！')
          resolve()
        }
      })
    },
    // 初始化查询
    initChatList() {
      this.searchChatList().then(() => {
        this.toScroll()
      })
    },
    // 查询历史消息
    searchChatList() {
      return new Promise(resolve => {
        searchChatList(this.searchQuery, res => {
          document.title = res.name
          this.messages = res.pageData.reverse().concat(this.messages)
          this.messages[0] && (this.searchQuery.sort = this.messages[0].sort)
          res.currPage === res.maxPage && (this.pullDownRefresh = false)
          resolve()
        })
      })
    },
    // 建立websocket通信
    createWebsocket() {
      const URL = `${_.websocketPort}/chat-Refresh-websocket/web/${
        this.query.chatId
      }/${this.query.userId}`

      this.websocket = new WebSocket(URL)

      this.websocket.onopen = () => {
        this.onWebsocketMessage()
      }

      this.toScroll()
    },
    // 接受websocket通知消息
    onWebsocketMessage() {
      this.websocket.onmessage = res => {
        if (res.data) {
          const data = JSON.parse(res.data)
          this.messages.push(data.data)
          this.toScroll()
        }
      }
    },
    // 发送消息
    sendMessage() {
      if (!this.message) return
      const message = {
        type: 1,
        message: String(this.message)
      }
      this.websocket.send(JSON.stringify(message))
      this.message = ''
    },
    // 滚动
    toScroll() {
      setTimeout(() => {
        this.$refs.scroll && this.$refs.scroll.scrollToEnd()
      }, 50)
    },
    // 解决输入法遮挡输入框的问题
    handleInputFix() {
      setTimeout(() => {
        this.$refs.input.scrollIntoView(true)
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.qwui-chat_container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
  .qwui-chat_content {
    background-color: #f7f8fa;
    flex: 1;
    .qwui-chat_time {
      width: 100%;
      height: 24px;
      text-align: center;
      font-size: 12px;
      line-height: 24px;
      color: #a2a4a7;
      margin: 10px 0;
    }
    .qwui-chat_section {
      width: 100%;
      height: auto;
    }
  }
  .qwui-chat_message {
    width: 100%;
    height: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    .qwui-chat_input {
      flex: 1;
      height: 35px;
      font-size: 14px;
      margin: 8px 15px;
      padding: 0;
      background-color: #f7f8fa;
      border-radius: 5px;
    }
    .qwui-chat_send {
      width: 72px;
      height: 35px;
      margin-right: 15px;
      line-height: 35px;
      background-color: #5077aa;
      color: #fff;
      font-size: 15px;
    }
  }
}
</style>
