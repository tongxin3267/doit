<template>
    <transition name="slide">
        <div class="advancedSearch">
            <div class="SS_header">
                <div
                    class="SS_close"
                    @click="close"></div>
                <div class="text-center">{{heading}}</div>
            </div>
            <slot name="header" refs="slotHeader"></slot>
            <div
                class="SS_main"
                :style="{height: mainHeight}">
                <div
                    class="SS_form-group"
                    v-for="(field, index) in setting"
                    :key="index"
                    v-show="show(field.show)">
                <label class="SS_control-label mb5">{{ field.label }}</label>
                <component
                    :is="field.type + 'Field'"
                    :field="field"
                    :search-value.sync='searchValue'
                    :setting='setting' @checkedRadio="checkedRadio"></component>
                </div>
            </div>
            <slot name="footer" refs="slotFooter"></slot>
            <div class="SS_footer qwui-btn_tab">
                <span
                    class="qwui-btn qwui-btn_default"
                    @click="reset">重置</span>
                <span
                    class="qwui-btn qwui-btn_primary"
                    @click="search">确定</span>
            </div>
        </div>
    </transition>
</template>

<script>
import checkboxField from './SearchCheckbox'
import dateField from './SearchDate'
import radioField from './SearchRadio'
import textField from './SearchText'
import selectUserOrDepartField from './SearchSelectUserOrDepart'
import selectDepartField from './SearchSelectDepart'
import selectPersonField from './SearchSelectPerson'
import selectField from './SearchSelect'
import intervalField from './SearchInterval'
import addressField from './SearchAddress'
export default {
    name: 'QwAdvancedSearch',
    components: {
        checkboxField,
        dateField,
        textField,
        radioField,
        selectUserOrDepartField,
        selectPersonField,
        selectDepartField,
        selectField,
        intervalField,
        addressField
    },
    props: {
        setting: { // 配置
            type: Array,
            required: true
        },
        heading: { // 标题
            type: String,
            default() {
                return '高级搜索'
            }
        },
        cacheSearchValue: Object // 缓存高级搜索时，需要传入的searchValue
    },
    data() {
        return {
            searchValue: {}
        }
    },
    computed: {
        mainHeight() {
            let height = window.innerHeight - 45 - 60 - 15 + 'px';
            return height;
        }
    },
    methods: {
        checkedRadio(index,key,value){
            this.$emit('checkedRadio', index, key, value)
        },
        search() { // 搜索
            this.close();
            this.$emit('search', this.searchValue)
        },
        reset() { // 重置
            this.searchValue = {}
            this.$emit('reset')
        },
        close() { // 关闭
            this.$emit('close')
        },
        show(show) { // 判断是否查询条件显示
            return show == undefined ? true : show;
        }
    },
    watch: {
        'cacheSearchValue': {
            handler() {
                this.searchValue = this.cacheSearchValue;
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped>
.advancedSearch {
    position: fixed;
    top: 0;
    z-index: 11;
    width: 100%;
    background-color: #f5f5f5;
    margin-bottom:
}
.SS_header {
    position: relative;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    background: #fff;
    padding-left: 45px;
}
.SS_header:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e6e6e6;
}
.qwui-btn {
    position: relative;
    display: block;
    flex: 1;
    box-sizing: border-box;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
}
.qwui-btn.qwui-btn_default {
    margin-right: 15px;
    color: rgba(51,51,51,1);
    background: rgba(251,250,252,1);
}
.qwui-btn.qwui-btn_primary {
    color: rgba(255,255,255,1);
    background: rgba(47,125,205,1);
}
.qwui-btn:after{
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  border: 1px solid #e5e5e5;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
  border-radius: 10px;
}
.SS_close {
    float: right;
    width: 45px;
    height: 100%;
    text-align: center;
    cursor: pointer;
}
.SS_close::after {
    background: url(../../../assets/images/CSSSprites.png) no-repeat;
    content: '';
    width: 13px;
    height: 13px;
    position: absolute;
    background-position: -30px 0;
    top: 15px;
    right: 15px;
}
.SS_main {
    padding: 0 15px;
    overflow: auto;
    margin-bottom: 15px
}
.SS_footer {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
}
@media screen and (min-width: 1024px){
    .SS_footer {
        width: 740px;
    }
}
.SS_footer .qwui-btn {
    cursor: pointer;
}
.text-center {
    text-align: center;
}
.SS_form-group {
    padding-top: 15px;
    font-size: 13px;
}
.SS_control-label {
    display: block;
    padding: 10px 0;
    color: #888;
}
.qwui-btn_tab{
    display: flex;
    padding: 8px 15px;
}
.slide-enter-active, .slide-leave-active {
    transition: all .2s ease;
}
.slide-enter, .slide-leave-to {
    transform: translateX(740px);
}
@media screen and (min-width: 1024px) {
    .advancedSearch {
        width: 740px;
        margin: auto;
    }
}

.weui-cell:before {
    content: none;
}
  .mb5{
    margin-bottom: 5px;
  }
</style>
