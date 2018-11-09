<template>
    <ul class="checkbox clearfix">
        <li class="SS_option" :class="isActive(option.text)"
            v-for="option in field.value"
            :key="option.text" @click="checked(option.text, option.value)">{{option.text}}</li>
    </ul>
</template>

<script>
    export default {
        name: 'checkboxField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                checkModel: {}
            }
        },
        created() {
            this.init();
        },
        methods: {
            // 根据缓存进行初始化
            init() {
                if(!this.searchValue[this.key]) {
                    return
                }
                let searchValue = this.searchValue[this.key].split(','),
                    fieldValue = this.field.value;

                for(let i = 0; i < searchValue.length; i++) {
                    for(let j = 0; j < fieldValue.length; j++) {
                        if(searchValue[i] == fieldValue[j].value) {
                            this.$set(this.checkModel, fieldValue[j].text, true);
                        }
                    }
                }
            },
            // 选中
            checked(text, value) {
                let _this = this,
                    valueArr = this.searchValue[this.key];

                if(!valueArr) {
                    valueArr  = [];
                } else {
                    if(valueArr.length == 1) {
                        valueArr = valueArr.split('')
                    } else {
                        valueArr = valueArr.split(',')
                    }
                }
                this.$set(this.checkModel, text, !this.checkModel[text])
                if(this.checkModel[text]) {
                    valueArr.push(value)
                } else {
                    valueArr.forEach((item, index) => {
                        if(value == item) {
                            valueArr.splice(index, 1)
                        }
                    })
                }
                this.searchValue[this.key] = valueArr + '';
            },
            // 是否被选中
            isActive(text) {
                return this.checkModel[text] ? 'active' : ''
            },
            // 重置
            reset() {
                this.checkModel = {}
            }
        },
        watch: {
            searchValue: {
                handler(val) {
                    if(!val[this.key]) {
                        this.reset()
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
.SS_option {
    float: left;
    padding: 0 15px;
    margin-right: 7px;
    height: 35px;
    line-height: 35px;
    color: #333;
    font-size: 14px;
    border: 1px #ddd solid;
    border-radius: 3px;
    margin-top: 5px;
    list-style: none;
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
}
.SS_option.active {
    position: relative;
    color: #0D68C6;
    border: 1px #0D68C6 solid;
}
.SS_option.active:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    background: url(../../../assets/images/icon-checked.png) no-repeat;
    background-size: 16px 16px;
}
</style>
