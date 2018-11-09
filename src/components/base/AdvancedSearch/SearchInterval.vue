<template>
    <div class="interval">
        <input
            class="SS_input"
            type="text"
            placeholder="请输入"
            v-model="searchValue[field.key[0]]"
            @change="from">
        <span class="SS_blank">~</span>
        <input
            class="SS_input"
            type="text"
            placeholder="请输入"
            v-model="searchValue[field.key[1]]"
            @change="to">
    </div>
</template>

<script>
    export default {
        name: 'intervalField',
        props: ['field', 'searchValue', 'setting'],
        methods: {
            from() {
                if(this.field.callBack) { 
                    this.field.callBack.from();
                }
            },
            to() {
                if(this.field.callBack) {
                    this.field.callBack.to();
                }
            }
        }
    }
</script>

<style scoped>
.interval {
    display: flex;
}
.interval .SS_input {
    flex: 4.5;
}
.interval .SS_blank {
    flex: 0.5
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
.SS_blank {
    display: inline-block;
    line-height: 36px;
    width: 10%;
    text-align: center;
}
</style>
