<template>
  <div>
    <label
      v-for="(value,key,index) in options"
      :for="value"
      class="qwui-border_bottom">
      <input type="checkbox"
             :key="key"
             :value="key"
             :id="value"
             v-model="checkedData"
             class="icon_check">
      {{value}}
    </label>
  </div>
</template>

<script>

  export default {
    name: "select-work-day",
    props: {
      show: false,
      options: []
    },
    data() {
      return {
        show:'',
        checkedData:[],
      }
    },
    computed: {

    },
    methods: {

    },
  }
</script>

<style scoped>
</style>
