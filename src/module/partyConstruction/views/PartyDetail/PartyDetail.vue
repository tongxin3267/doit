<template>
  <div>
    <dynamic belongAgent="partyconstruction" :isOpen="isOpen"></dynamic>
  </div>
</template>
<script>
  import dynamic from '@/module/dynamic/views/PartyDetail/PartyDetail'
  export default {
    props: {
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    components:{dynamic}
  }
</script>
