<template lang="html">
  <div class="qwui-view-list">
    <qw-search-box class="qwui-search_box"
      @read-search="search"
    ></qw-search-box>

    <ul class="qwui-people" v-scroll="loadMore">
      <qw-view-list-person
        class="qwui-person"
        v-for="person in people"
        :key="person.userId"
        :avator="person.headPic"
        :name="person.personName"
        :date="person.createTime"
      ></qw-view-list-person>
    </ul>

    <p class="qwui-more_tips">
      <span v-if="loading">正在加载更多</span>
      <span v-else-if="people.length === 0">没有找到搜索结果</span>
      <span v-else>已经没有了</span>
    </p>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import QwSearchBox from './search';
import QwViewListPerson from './person';

const _ = window._;

const TIMEOUT = 1000;

const ReadUrl = _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!getDynamicReadPager.action';
const UnReadUrl = _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!getUnreadPager.action';

// 封装Ajax
Vue.use({
  install (vue, options) {
    let ajax = async (description, settings) => {
      let timer = setTimeout(() => {
        _.showLoading('正在' + description);
      }, TIMEOUT);

      let res = await axios(settings);

      clearTimeout(timer);

      _.hideLoading();

      if (res.code === '0') {
        return Promise.resolve(res);
      } else {
        _.alert('提示', res.desc);
        console.error(res.desc);
      }
    };

    ajax.get = async (description, url, settings) => {
      return await ajax(description, {
          url,
          method: 'get',
          ...settings
        });
    };

    ajax.post = async (description, url, data, settings) => {
      return await ajax(description, {
          url,
          data,
          method: 'post',
          ...settings
        });
    };

    vue.prototype.$ajax = ajax;
  }
});

let vm = {
  components: {
    QwSearchBox,
    QwViewListPerson
  },
  data () {
    return {
      page: 1,
      maxPage: 1,
      people: [],
      name: '',
      type: 1,
      loading: false
    }
  },
  computed: {
    hasMore () {
      return this.page < this.maxPage;
    }
  },
  methods: {
    async search_ajax ({name, type, page=1}) {
      if (this.loading) {
        return;
      } else {
        this.loading = true;
      }

      let url = '';

      if (type === 1) {
        url = ReadUrl;
      } else if (type === 2) {
        url = UnReadUrl;
      }

      let res = await this.$ajax.post(
          '搜索人员',
          url, {
            id: this.$route.query.id,
            groupId: this.$route.query.id,
            pageSize: 20,
            currentPage: page,
            keyWord: name
          }
        );

      this.name = name;
      this.type = type;
      this.page = res.data.currPage;
      this.maxPage = res.data.maxPage;

      this.loading = false;
      return res.data;
    },
    async search ({name, type}) {
      let data = await this.search_ajax({name, type});

      this.people = data.pageData || [];
    },
    async loadMore () {
      if (!this.hasMore) {
          return;
      }

      let data = await this.search_ajax({
          name: this.name,
          type: this.type,
          page: this.page + 1
        });

      for (let person of data.pageData) {
        this.people.push(person);
      }
    }
  },
  async created () {
    if (this.$route.query.id) {
      await this.search({
          name: '',
          type: 1
        });
    } else {
      _.alert('提示', '异常访问');
    }
  },
  directives: {
    scroll: {
      bind (el, {value}) {
        let timer = new Date(0);

        window.onscroll = () => {
          let sHeight = document.documentElement.scrollTop,
            wHeight = document.documentElement.clientHeight,
            dHeight=document.documentElement.offsetHeight;

          if (dHeight - sHeight - wHeight < 200) {
            if (new Date() - timer > 100) {
              timer = new Date();
              value();
            }
          }
        }
      }
    }
  }
}

export default vm;
</script>

<style lang="scss" scoped>
.qwui-search_box {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}

.qwui-people {
  margin-top: 43px;

  .qwui-person {
    border-top: 1px solid #dfdfdd;

    &:last-child {
      border-bottom: 1px solid #dfdfdd;
    }
  }
}

.qwui-more_tips {
  text-align: center;
  line-height: 60px;
  font-size: 14px;
}
</style>
