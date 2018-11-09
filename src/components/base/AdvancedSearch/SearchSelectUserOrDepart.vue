<template>
    <div class="selectUserOrDepartment">
        <span
            class="SS_input SS_arrow"
            @click="selectUserOrDepartment"><span class="default" v-show="!nameStr">请选择</span>{{nameStr}}</span>
    </div>
</template>

<script>
    export default {
        name: 'selectDepartmentField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                depts: [], // 部门
                users: [], // 人员
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
                    this.users = searchValue.users || [];
                    this.depts = searchValue.depts || [];
                }
                this.setNameStr();
            },
            reset() {
                this.users = [];
                this.depts = [];
                this.setNameStr();
            },
            selectUserOrDepartment() {
                var _this = this;
                _this.init();
                dataBase.selectConfig.show = true;
                dataBase.selectConfig.selectList.depts.deptSelected = this.depts;
                dataBase.selectConfig.selectList.depts.userSelected = this.users;
                dataBase.selectConfig.selectList.depts.callBack.confirm = function(id, data) {
                    _this.depts = data.dept.data;
                    _this.users = data.user.data;
                    _this.searchValue[_this.key] = {
                        depts: data.dept.data,
                        users: data.user.data
                    }
                    _this.setNameStr();
                }
            },
            setNameStr() {
                let deptName = '',
                    userName = '';
                if(this.depts.length != 0) {
                    this.depts.forEach((item, index) => {
                        deptName += item.deptFullName;
                        if(index != this.depts.length - 1) {
                            deptName += ' , ';
                        }
                    });
                }
                if(this.users.length != 0) {
                    this.users.forEach((item, index) => {
                        userName += item.personName;
                        if(index != this.users.length - 1) {
                            userName += ' , ';
                        }
                    })
                }

                this.nameStr = deptName + (deptName && userName ? ' , ' : '') + userName;
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
