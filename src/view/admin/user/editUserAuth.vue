<template>
  <div>
    <section v-for='child in auth' class="pb10">
      <h5 class="mb10">
        <span>{{child.title}}</span>
        <RadioGroup v-model='child.value' class="fr">
          <Radio label="允许"></Radio>
          <Radio label="禁止"></Radio>
          <Radio label="默认"></Radio>
        </RadioGroup>
      </h5>
      <ul class="ivu-tree">
        <li v-for='item in child.arr' class="ivu-tag-li">
          <span>{{item.title}}</span>
          <RadioGroup v-model='item.value' class="fr">
            <Radio label="允许"></Radio>
            <Radio label="禁止"></Radio>
            <Radio label="默认"></Radio>
          </RadioGroup>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
  export default {
    props: {
      menu: Object,
      rule: {
        type: Object,
        default () {
          return {required: true, message: '不能为空', trigger: 'blur'}
        }
      }
    },
    data () {
      return {
        level1: [
          {value: 'oos', id: '12'}
        ],
        auth: [
          {
            title: 'RF端',
            value: '',
            arr: [
              {
                title: '收货任务',
                value: ''
              },
              {
                title: '上架任务',
                value: ''
              },
              {
                title: '质检任务',
                value: ''
              },
              {
                title: '拣货任务',
                value: ''
              }
            ]
          },
          {
            title: 'PC端出库管理',
            arr: [
              {
                title: '出库任务',
                value: ''
              },
              {
                title: '分拣清单',
                value: ''
              },
              {
                title: '拣货管理',
                value: ''
              },
              {
                title: '装箱复核',
                value: ''
              }
            ]
          }
        ]
      }
    },
    computed: {
      rules () {
        return {
          title: this.rule,
          name: this.rule,
          url: this.rule,
          discription: this.rule,
          father: this.rule,
        }
      }
    },
    methods: {
      cancel () {
        this.$emit('cancel')
      },
      handleSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('ok', this.data)
          }
        })
      },
    }
  }
</script>
