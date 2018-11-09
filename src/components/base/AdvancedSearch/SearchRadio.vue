<template>
    <ul class="radio clearfix">
        <li class="SS_option" :class="{active: index == currIndex}"
            v-for="(item, index) in field.value"
            :key="item.text" @click="checked(item, index)">{{item.text}}</li>
    </ul>
</template>

<script>
    export default {
        name: 'radioField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                currIndex: -1
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() { // 根据缓存初始化
                let index = this.field.noDefault ? -1 : 0, //noDefault: 是否不需要默认选中 true为不需要默认选中 false为需要默认选中 默认需要默认选中
                    searchValue = this.searchValue,
                    field = this.field;

                field.value.forEach((item, indx) => {
                    if(item.value == searchValue[field.key]) {
                        index = indx;
                    }
                })
                this.currIndex = index;
            },
            checked(item, index) {
                this.currIndex = index;
                this.$set(this.searchValue, this.field.key, item.value)
                this.$emit('checkedRadio',this.currIndex,this.field.key, item.value)
                if(this.field.value[index].callBack) {
                    this.field.value[index].callBack();
                }
            },
            reset() {
                this.currIndex = this.field.showDefault ? -1 : 0;
            },
            showOrHideRelativeLabel(newVal, oldVal) {
                let hideLabel = [], // 需要隐藏的label
                    showLabel = [], // 需要显示的label
                    field = this.field,
                    searchValue = this.searchValue,
                    setting = this.setting

                if(field.value[oldVal] && field.value[oldVal].relativeLabel) {
                    hideLabel = field.value[oldVal].relativeLabel;
                }
                if(field.value[newVal] && field.value[newVal].relativeLabel) {
                    showLabel = field.value[newVal].relativeLabel;
                }
                setting.forEach((item, index) => {
                    index ++; // index从1开始，而不是从0开始
                    showLabel.forEach(indx => {
                        if(index == indx) {
                            item.show = true;
                        }
                    })
                    hideLabel.forEach(indx => {
                        if(index == indx) {
                            if(Array.isArray(item.key)) {
                                item.key.forEach((itm) => {
                                     Reflect.deleteProperty(searchValue, itm)
                                })
                            } else {
                                Reflect.deleteProperty(searchValue, item.key)
                            }
                            item.show = false;
                        }
                    })
                });
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
            },
            currIndex(newVal, oldVal) {
                if(newVal == -1) {
                    return
                }
                this.showOrHideRelativeLabel(newVal, oldVal);
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
    background: #fff;
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




