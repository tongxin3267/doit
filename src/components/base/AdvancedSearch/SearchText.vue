<template>
    <div class="text">
        <input
            class="SS_input"
            type="text"
            :placeholder="field.placeholder"
            v-model="searchValue[field.key]"
            @change="change">
    </div>
</template>

<script>
export default {
    name: 'textField',
    props: ['field', 'searchValue'],
    methods: {
        change() {
            if(this.field.callBack) {
                this.field.callBack();
            }
        }
    }
}
</script>

<style scoped>
.text .SS_input {
    width: 100%;
}
.SS_input {
    display: inline-block;
    width: 45%;
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
}
</style>


