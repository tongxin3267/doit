<template>
  <div>
    <dynamic :originId="id" :originName="name"></dynamic>
  </div>
</template>
<script>
  import dynamic from '@/module/dynamic/views/index'
  export default {
    data() {
      return {
        id:this.$route.query.id,
        name:this.$route.query.name
      }
    },
    components:{dynamic}
  }
</script>
