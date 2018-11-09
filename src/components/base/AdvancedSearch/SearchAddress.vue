<template>
    <div class="address">
        <div class="box">
            <x-address
                ref="xAddress"
                title=''
                @on-hide="hide"
                v-model="value"
                :list="addressData"
                placeholder="请选择地址"
                :show.sync="showAddress"></x-address>
        </div>
    </div>
</template>

<script>
import { XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'

export default {
    name: 'addressField',
    props: ['field', 'searchValue', 'setting'],
    components: {
        XAddress,
    },
    data () {
        return {
            title: '默认为空',
            value: [],
            addressData: ChinaAddressV4Data,
            showAddress: false
        }
    },
    methods: {
        init() {
            if(!this.searchValue[this.key]) {
                return
            }
            this.value = this.searchValue[this.key].value;
        },
        reset() {
            this.value = [];
            setTimeout(() => {
                this.$set(this.$refs.xAddress.$children[0], 'tempValue', ["110000","110100","110101"]);
            },500);  
        },
        doShowAddress () {
            this.showAddress = true
            setTimeout(() => {
                this.showAddress = false
            }, 2000)
        },
        getName (value) {
            return value2name(value, ChinaAddressV4Data)
        },
        hide() {
            // this.searchValue[this.field.key] = this.value;
            let searchValue = {
                text: this.getName(this.value),
                value: this.value
            }
            this.searchValue[this.field.key] = searchValue;
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
<style>
.address {
    width: 100%;
    background-color: #fff;
    cursor: pointer;
}
.address .vux-popup-picker-select {
    text-align: left !important;
}
.address .box {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    padding-left: 5px;
}
</style>

