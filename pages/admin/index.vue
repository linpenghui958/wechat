<template lang="pug">
.content
  h3 登录成功 {{user.email}}
</template>
<script type="text/scmascript-6">
import { mapState } from 'vuex'
export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '后台管理界面'
    }
  },
  computed: mapState([
      'user'
    ])
  
}
</script>


<style lang='sass', src='../../static/sass/admin.sass', scoped/>
