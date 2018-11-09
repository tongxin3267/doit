<template>
    <div class="advancedSearch">
        <div @click="advancedShow = !advancedShow" class="text">点击展开高级搜索</div>
        <input type="text" v-model="cacheSearchValue['searchValue.text']" class="text-input">
        <advancedSearch
            @search="search"
            @close="searchClose"
            :setting="setting"
            :cache-search-value="cacheSearchValue"
            v-show="advancedShow"
        ></advancedSearch>
        <search-adress></search-adress>    
        <user-choose :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user-choose>
    </div>
</template>

<script>
import advancedSearch from '@/components/base/AdvancedSearch/index'
import userChoose from '../../../components/base/user_or_dept_select'
import SearchAdress from '@/components/base/AdvancedSearch/SearchAddress'

let DIYdate = [] // DIYdate: 二维数组, DIYdate.length: 有多少列

{
    let YEAR = [],
        SEASON = [{ text: '一季度', value: '1'}, { text: '二季度', value: '2'}, { text: '三季度', value: '3'}, { text: '四季度', value: '4'}]
    for(let i = 1949; i <= 2050; i++) {
        /*
        *   数组存放对象, 对象格式一定是：
        *   {
        *       text: xxx年  展示的文字,
        *       value: xxx   对应的值
        *   }
        *
        */
        YEAR.push( { text: i + '年', value: i } )
    }
    DIYdate = [YEAR, SEASON];
}

export default {
    name: 'demo',
    components: {
        advancedSearch,
        userChoose,
        SearchAdress
    },
    data() {
        return {
            dataBase: dataBase,
            setting: [
                {
                    label: '单行文本（text）',
                    key: 'searchValue.text',
                    type: 'text',
                    placeholder: '请输入',
                    callBack: this.textChange
                },
                {
                    label: '双向单行文本（interval）',
                    key: ['searchValue.intervalLeft', 'searchValue.intervalRight'],
                    type: 'interval',
                    callBack: {
                        from: this.intervalFrom,
                        to: this.intervalTo
                    }
                },
                {
                    label: '单选按钮（radio）',
                    key: 'searchValue.radio',
                    type: 'radio',
                    value: [{ text: '默认选中的按钮', value: 'default', callBack: this.radioCheck}, { text: '没啥用的按钮', value: 'useless'}, { text: '带有relativeLabel属性的关联复选框的按钮', value: 'relative'}]
                },
                {
                    label: '被关联的复选框（checkbox）',
                    key: 'searchValue.checkbox',
                    type: 'checkbox',
                    value: [{ text: '高', value: '1'}, { text: '富', value: '2'}, { text: '帅', value: '3'}]
                },
                {
                    label: '下拉框（select）',
                    key: 'searchValue.select',
                    type: 'select',
                    value: [{ text: '下拉框1', value: '1'}, { text: '下拉框2', value: '2'}, { text: '下拉框3', value: '3'}]
                },
                {
                    label: '默认年月日的日期（date）',
                    key: ['searchValue.startTime', 'searchValue.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD' //用来控制日期展示的格式以及返回的数据格式

                },
                {
                    label: 'DIY的日期（date）',
                    key: ['searchValue.startTime', 'searchValue.endTime'],
                    type: 'date',
                    dateType: 'DIY',
                    dateValue: DIYdate
                },
                {
                    label: '选人（selectPerson）',
                    key: 'searchValue.selectPerson',
                    type: 'selectPerson'
                },
                {
                    label: '选部门（selectDepartment）',
                    key: 'searchValue.selectDepartment',
                    type: 'selectUserOrDepart'
                },
                {
                    label: '选择区域(address)',
                    key: 'searchValue.address',
                    type: 'address'
                }
            ],
            cacheSearchValue: JSON.parse(sessionStorage.getItem('searchValue')) || {},
            advancedShow: false
        }
    },
    methods: {
        searchClose() {
            this.advancedShow = false;
        },
        search(searchValue) {
            this.advancedShow = true;
            sessionStorage.setItem('searchValue', JSON.stringify(searchValue));
            console.log('高级搜索的结果: ');
            console.log(searchValue);
        },
        close() {
            this.advancedShow = false;
        },
        radioCheck() {
            console.log('radioCheck')
        },
        textChange() {
            console.log('textChange')
        },
        intervalFrom() {
            console.log('intervalFrom')
        },
        intervalTo() {
            console.log('intervalTo')
        }
    }

}
</script>

<style scoped>
.qwui-btn_tab {
    display: flex;
    padding: 8px 15px;
}
.qwui-btn {
    position: relative;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    cursor: pointer;
}
.qwui-btn.qwui-btn_primary {
    color: rgba(255,255,255,1);
    background: rgba(47,125,205,1);
}
.text {
    width: 100%;
    line-height: 32px;
    font-size: 16px;
    text-align: center;
}
.text-input {
    width: 100%;
    height: 32px;

}
</style>


