<template>
    <div class="select SS_arrow">
        <select v-model="selected">
            <option v-for="option in field.value"
                    :value="option.value" 
                    :key="option.value">{{option.text}}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'selectField',
    props: ['field', 'searchValue', 'setting'],
    data() {
        return {
            label: this.field.label,
            key: this.field.key,
            selected: ''
        }
    },
    created () {
        this.selected = this.searchValue[this.key] || this.field.value[0].value
    },
    methods: {
        reset() {
            this.selected = this.field.value[0].value;
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
        },
        selected(val) {
            this.searchValue[this.key] = val;
        }
    }
}
</script> 

<style scoped>
.select {
    position: relative;
    width: 100%;
}
.select select {
    width: 100%;
    padding-left: 5px;
    border: none;
    line-height: 36px;
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

