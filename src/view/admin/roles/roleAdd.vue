<template>
  <div>
    <ul>
      <li class="oos-form-item">
        <label for="" class="oos-label">角色名</label>
        <div class="oos-form-con">
          <input type="text" v-model='data.name'>
        </div>
      </li>
      <li class="oos-form-item">
        <label for="" class="oos-label">roleName</label>
        <div class="oos-form-con">
          <input type="text" v-model='data.role'>
        </div>
      </li>
      <li class="oos-form-item">
        <label for="" class="oos-label">角色名</label>
        <div class="oos-form-con">
          <input type="text" v-model='data.name'>
        </div>
      </li>
      <li class="oos-form-item">
        <label for="" class="oos-label">权限</label>
        <div class="oos-form-con">
          <Tree :data='auth'></Tree>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      data: Object
    },
    data () {
      return {
        auth: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
</script>
