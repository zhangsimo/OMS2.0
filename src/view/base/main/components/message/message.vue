

<template>
  <Dropdown class="message-con">
    <Badge count="3">
      <Icon type="ios-bell-outline" size="30"></Icon>
    </Badge>
    <DropdownMenu slot="list">
      <DropdownItem>未读消息　　<Badge count="10"></Badge></DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import './message.less'
export default {
    name: 'message_index',
    data () {
        return{

        }
    },
    methods: {

    },
    mounted () {

    },
    watch: {

    }
};
</script>

