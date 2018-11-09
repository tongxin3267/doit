<template>
  <div class="selectDepartment">
        <span
          class="SS_input SS_arrow"
          @click="selectUserOrDepartment"><span class="default" v-show="!nameStr">请选择</span>{{nameStr}}</span>
  </div>
</template>

<script>
  export default {
    props: ['field', 'searchValue', 'setting'],
    data() {
      return {
        key: this.field.key,
        depts: [], // 部门
        nameStr: '' // 选中的部门和选中的人的组合字符串
      }
    },
    created () {
      this.init();
    },
    methods: {
      init() {
        let searchValue = this.searchValue[this.key];
        dataBase.selectConfig.signIndex = 'depts';
        dataBase.selectConfig.selectList.depts.deptSelectedShow = true;
        if(searchValue) {
          this.depts = searchValue.depts || [];
        }
        this.setNameStr();
      },
      reset() {
        this.depts = [];
        this.setNameStr();
      },
      selectUserOrDepartment() {
        var _this = this;
        _this.init();
        dataBase.selectConfig.show = true;
        dataBase.selectConfig.selectList.depts.deptSelected = this.depts;
        dataBase.selectConfig.selectList[dataBase.selectConfig.signIndex].deptRestriction = this.field.deptRestriction || '500';
        dataBase.selectConfig.selectList.depts.callBack.confirm = function(id, data) {
          _this.depts = data.dept.data;
          _this.searchValue[_this.key] = {
            depts: data.dept.data
          }
          _this.setNameStr();
        }
      },
      setNameStr() {
        let deptName = '';
        if(this.depts.length != 0) {
          this.depts.forEach((item, index) => {
            deptName += item.deptFullName;
            if(index != this.depts.length - 1) {
              deptName += ' , ';
            }
          });
        }

        this.nameStr = deptName;
      }
    },
    watch: {
      searchValue:{
        handler(val) {
          if(!val[this.key]) {
            this.reset();
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .SS_input {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 36px;
    padding: 0 5px;
    box-sizing: border-box;
    outline: none;
    border: none;
    line-height: 36px;
    border-radius: 2px;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .default {
    color: #bbb;
  }
  .SS_arrow::after {
    content: "";
    position: absolute;
    color: #999999;
    right: 15px;
    top: 50%;
    width: 6px;
    height: 12px;
    transform: translateY(-50%);
    background: url(../../../assets/images/qwui-others_arrow.png) no-repeat;
    background-size: contain;
  }
</style>
