<template lang="pug">
.cell
  span {{ title }}
  span(v-if='content && !iconName') {{ content }}
  i.material-icon(v-else) {{ iconName }}
</template>

<script>
export default {
  props: {
    title: String,
    content: Number,
    iconName: String
  }
}
</script>

<style lang="scss"  rel="stylesheet/sass">
@import '~static/sass/color';
@import '~static/sass/mixin';
.cell{
  width: 100%;
  > *{
    vertical-align: middle;
    display: inline-block;
  }
  span{
    width: 50%;
    font-size: 1.5;
    text-align: left;
  }
  .material-icon{
    width: 50%;
    text-align: right;
    color: gray;
  }
}    
</style>
