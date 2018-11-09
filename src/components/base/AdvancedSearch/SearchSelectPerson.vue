<template>
    <div class="selectPerson ">
        <span class="SS_input SS_arrow ellipsis" @click="selectPerson"><span class="default" v-show="!userName">请选择</span>{{userName}}</span>
    </div>
</template>

<script>
    export default {
        name: 'selectPersonField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                users: [],
                userName: ''
            }
        },
        created() {
            if(this.field.userRestriction) {
                dataBase.selectConfig.selectList.users.userRestriction = this.field.userRestriction;
            }
            this.init();
        },
        methods: {
            init() { // 根据高级搜索的缓存初始化数据
                if(this.searchValue[this.key]) {
                    this.users = this.searchValue[this.key];   
                }
                dataBase.selectConfig.signIndex = 'users';
                dataBase.selectConfig.selectList.users.userSelected = this.users;
                this.setUserName()
            },
            reset() {
                this.users = {};
                dataBase.selectConfig.selectList.users.userSelected = [];
                this.userName = '';
            },
            selectPerson() {
                var _this = this;
                dataBase.selectConfig.show = true;
                dataBase.selectConfig.signIndex = 'users';
                dataBase.selectConfig.selectList.users.userSelected = this.users;
                dataBase.selectConfig.selectList.users.callBack.confirm = function(id, data) {
                    _this.users = data.user.data;
                    _this.searchValue[_this.key] = data.user.data;
                    _this.setUserName();
                };
            },
            setUserName() {
                let userName = '',
                    users = this.users;
                if(users && Array.isArray(users)) {
                    users.forEach((item, index) => {
                        userName += item.personName;
                        if(index != users.length - 1) {
                            userName += ' , ';
                        }
                    });
                }
                this.userName = userName;
            }
        },
        watch: {
            searchValue: {
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
.SS_input {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 36px;
    padding: 0 20px 0 5px;
    box-sizing: border-box;
    outline: none;
    border: none;
    line-height: 36px;
    border-radius: 2px;
    font-size: 14px;
    color: #333;
    background-color: #fff;
}
.ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
