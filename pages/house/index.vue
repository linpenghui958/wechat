<template lang="pug">
.container
  .focusHouse-media
    img(v-if='house.cname', :src='imageCDN + house.cname + ".jpg?imageView2/0/format/jpg/q/75|imageslim"')
    .focusHouse-text
      .words {{ house.words }}
      .name {{ house.name }}

  .focusHouse-body
    .focusHouse-item-title {{ house.cname }}
    .focusHouse-item-body {{ house.intro }}

    .focusHouse-item-title 主要角色
    .focusHouse-item-body(v-for='(item, index) in house.swornMembers', :key='index')
      .swornMembers
        img(:src='imageCDN + item.character.profile + "?imageView2/0/format/jpg/q/75|imageslim"'
        , @click='showCharacter(item)')
        .swornMembers-body
          .name {{ item.character.cname }}
          .introduction {{ item.text }}

    .focusHouse-item-section(v-for='(item, index) in house.sections', :key='index')
      .focusHouse-item-title {{ item.title }}
      .focusHouse-item-body(v-for='text in item.content') {{ text }}
</template>

<script>
import { mapState } from 'vuex'
export default {
  head () {
    return {
      title: '家族详情'
    }
  },
  computed: {
    ...mapState({
      'house': 'currentHouse',
      'imageCDN': 'imageCDN'
    })
  },
  methods: {
    showCharacter(item) {
      this.$router.push({
        path: '/character',
        query: {
          id: item.character._id
        }
      })
    }
  },
  beforeCreate () {
    let id = this.$route.query.id
    this.$store.dispatch('showHouse', id)
  }
}
</script>
<style scoped lang='sass' src='../../static/sass/house.sass'></style>

