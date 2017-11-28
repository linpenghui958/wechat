<template lang="pug">
.container
  .user(v-if='user')
    .user-header
      .user-header-text {{ user.nickname }}
      img(:src="user.avatar")
    .user-address
      cell(title='收货地址' iconName='place')
      .user-content {{ user.address }}
    .user-phone
      cell(title='电话' iconName='phone_iphone')
      .user-content {{ user.phoneNumber }}
    .user-name
      cell(title='姓名' iconName='account_box')
      .user-content {{ user.name }}
    .user-order(v-if='user.orders && user.orders.length > 0')
      cell(title='我的订单' iconName='list')
      .user-order-item(v-for='(item, index) in user.orders', :key='index')
        img(:src='item.image')
        .user-order-intro
          .title {{item.title}}
          .content {{item.intro}}
        .user-order-price
          span ¥{{item.price}}
</template>

<script>
import cell from '~/components/cell.vue'
import { mapState } from 'vuex'

export default {
  head () {
    return {
      title: '个人中心'
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {},
  beforeCreate () {
    this.$store.dispatch('fetchUserAndOrders')
  },
  components: {
    cell
  }
}
</script>

<style lang="sass" scoped src='~/static/sass/user.sass'></style>
