<template>
  <label>
    <input type="checkbox" @change="$emit('change', checkVal)" v-model="checkVal">
    <div class="qwui-onOff_choose"
         :class="{'qwui-onOff_on': value, 'qwui-onOff': !value}">
    <span class="qwui-onOff_off"
          :class="{'active': value}">
    </span>
    </div>
  </label>
</template>

<script>
  export default {
    name: "switchBtn",
    props: {
      value: [Number,Boolean]
    },
    computed: {
      checkVal: {
        get() {
          return this.value
        },
        set(val) {
          val = val ? 1 : 0
          this.$emit('input', val)
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  [type="checkbox"] {display: none}
</style>
