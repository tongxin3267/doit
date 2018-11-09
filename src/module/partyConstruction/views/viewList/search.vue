<template lang="html">
  <div class="qwui-search_box">
    <div class="qwui-content">
      <div class="qwui-type">
        <span v-if="type === 1"
          @click="toggleShow(true)"
        >已阅</span>
        <span v-else
          @click="toggleShow(true)"
        >未阅</span>

        <div class="qwui-select_type"
          tabindex="0"
          v-if="show"
          v-focus
          @blur="toggleShow(false)"
        >
          <a href="javascript: void(0)"
            @click="changeType(1)"
          >已阅</a>
          <a href="javascript: void(0)"
            @click="changeType(2)"
          >未阅</a>
        </div>
      </div>
      <div class="qwui-input">
        <div class="qwui-input_box">
          <input type="search" name="name" v-model="name" placeholder="搜索姓名"
            @keyup.enter="search"
          >
          <a href="javascript: void(0)" class="qwui-btn_clear" @click="clear"></a>
          <a href="javascript: void(0)" class="qwui-btn_search" @click="search"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 1,
      name: '',
      show: false
    }
  },
  methods: {
    changeType (type) {
      this.show = false;
      this.type = type;
      this.search();
    },
    search () {
      this.show = false;
      this.$emit('read-search', {
        name: this.name,
        type: this.type
      });
    },
    clear () {
      this.name = '';
    },
    toggleShow (show) {
      this.show = show;
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::-ms-clear {
  display: none;
}

::-ms-reveal {
  display: none;
}

.qwui-search_box {
  line-height: 30px;
  background-color: #f0f0f0;

  .qwui-content {
    position: relative;
    margin: 7px 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    line-height: 27px;
    font-size: 14px;

    .qwui-type,
    .qwui-input {
      display: inline-block;
      text-align: center;
    }

    .qwui-type {
      position: relative;
      z-index: 10;
      width: 80px;
      color: #666;

      &::after {
        content: '▼';
        margin-left: 8px;
      }
    }

    .qwui-select_type {
      position: absolute;
      top: 34px;
      padding: 0 5px;
      line-height: 34px;
      background-color: white;
      border: 1px solid #ddd;
      outline: none;

      a {
        display: block;
        width: 70px;
        color: inherit;
        text-align: center;
        border-bottom: 1px solid #ddd;

        &:last-child {
          border-bottom: none;
        }
      }

      &::before {
        content: "";
        display: block;
        position: absolute;
        top: -10px;
        right: 16px;
        width: 0px;
        height: 0px;
        border: 5px solid transparent;
        border-bottom-color: #ddd;
      }
    }

    .qwui-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: left;
      font-size: 0;

      .qwui-input_box {
        padding-left: 80px;
        padding-right: 38px;
      }

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 6px;
        left: 70px;
        width: 1px;
        height: 17px;
        background-color: #ddd;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 6px;
        right: 30px;
        width: 1px;
        height: 17px;
        background-color: #ddd;

      }

      input {
        width: 100%;
        line-height: inherit;
      }

      .qwui-btn_clear {
        display: block;
        position: absolute;
        top: 7px;
        right: 36px;
        width: 14px;
        height: 14px;
        background: {
          image: url(../../img/ic_del.png);
          color: white;
          size: 100% 100%;
          position: center center;
          repeat: no-repeat;
        }
      }

      .qwui-btn_search {
        display: block;
        position: absolute;
        top: 7px;
        right: 9px;
        width: 14px;
        height: 14px;
        background: {
          image: url(../../img/ic_search.png);
          color: white;
          size: 100% 100%;
          position: center center;
          repeat: no-repeat;
        }
      }
    }
  }
}

</style>
