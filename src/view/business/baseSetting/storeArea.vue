<template>
  <div>
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <span>查询条件：</span>
            <Select v-model="searchType" class="w120">
              <Option v-for="item in searchTypeArr" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <Input v-model="searchValue" :placeholder="placeh" class="w200 mr20" clearable></Input>
            <Button type="warning" @click="search" class="mr20">查询</Button>
          </div>
        </div>
      </div>
    </section>
    <section class="con-box">
      <Table size="small" :loading="loading" border :stripe="true" :columns="columns" :data="tbdata"></Table>
      <Page class-name="page-con" :current="page.num" :total="page.total" :page-size="page.size" @on-change="changePage"
            @on-page-size-change="changeSize" show-sizer show-total></Page>
    </section>

    <Modal v-model="modal" title="修改区域" width="400" height="500">

      <Tree v-if="refreshTree" ref="tree" style="max-height: 500px;overflow-y: auto" :data="areaTree" @on-check-change="checkChange"
            children-key="childs" show-checkbox :check-strictly="true" :load-data="loadAreaData"/>

      <div slot='footer'>
        <Button type='text' @click='modal = false'>取消</Button>
        <Button type='primary' @click='submit'>保存</Button>
      </div>
    </Modal>

  </div>
</template>

<script>

  import {queryAll, findAllArea, saveArea, deleteArea} from '_api/business/storeAreaApi'

  export default {
    name: "storeArea",
    data() {
      return {
        refreshTree: true,
        modal: false,
        searchValue: '',
        searchType: 'name',
        searchTypeArr: [
          {value: 'name', name: '门店名称'},
          {value: 'storeNo', name: '门店编码'}
        ],
        page: {
          num: 1,
          size: 10,
          total: 0
        },
        loading: false,
        columns: [
          {
            title: '操作',
            align: 'center',
            width: 120,
            key: '',
            render: (h, params) => {
              let areaSet = params.row.areaSet || []

              let areaIds = params.row.areaSet.map(item => item.id + '')

              if (areaSet.length == 0) {
                return h('span', {
                  class: 'pointer',
                  on: {
                    click: () => {
                      //let areaIds = ["310000000000", "310100000000", "310101000000", "310104000000", "320000000000", "320100000000", "320102000000", "320104000000"]
                      this.storeId = params.row.id
                      this.show(null)
                    }
                  }
                }, '绑定区域')
              } else {
                return h('span', {
                  class: 'pointer delete',
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '提示',
                        content: '确定要解除绑定吗？',
                        onOk: () => {
                          this.storeId = params.row.id
                          this.deleteArea(areaIds)
                        }
                      })
                    }
                  }
                }, '解除绑定')
              }
            }
          },
          {
            title: '门店',
            align: 'center',
            minWidth: 120,
            key: 'shortName'
          },
          {
            title: '门店编号',
            align: 'center',
            key: 'storeNo',
            minWidth: 120
          },
          {
            title: '服务区域',
            align: 'center',
            key: '',
            minWidth: 200,
            render: (h, params) => {
              let areaSet = params.row.areaSet || [], map = {}
              areaSet.map(item => {
                if (item.grade == '3') {
                  let tmp = map[item.parentId]
                  if (!tmp) {
                    tmp = map[item.parentId] = []
                  }
                  let name = item.name
                  let city = item.city
                  let province = item.province

                  if (tmp.indexOf(province) == -1) {
                    tmp.push(province)
                  }
                  if (tmp.indexOf(city) == -1) {
                    tmp.push(city)
                  }
                  if (tmp.indexOf(name) == -1) {
                    tmp.push(name)
                  }
                  map[item.parentId] = tmp
                }
              })

              if (Object.keys(map).length == 0) {
                return h('span', '')
              }

              let name = []
              for (let key in map) {
                let item = map[key]
                let tmp = item.shift()
                tmp += item.shift()
                tmp += '：' + item.shift()
                item.unshift(tmp)
                name.push(item.join('、'))
              }

              // let areaName = areaSet.map(item => item.fullName).join('，')
              return h('span', name.join('；'))
            }
          }
        ],
        storeId: '',
        tbdata: [],
        areaTree: [],
        areaTreeOData: [],
        areaTreeOData1: [],
        checks: [],
        areaIds: [],
        shortIds: [],
        tmpShortIds: [],
        stopLoading: null
      }
    },
    mounted() {
      findAllArea({id: '', grade: '1'}).then(res => {
        if (res.code === 0) {
          let tmp = res.data || []
          tmp.map(item => {
            item.title = item.name
            item.loading = false
            item.childs = []
          })
          this.areaTreeOData = tmp
        }
      })
      this.getList()
    },
    methods: {
      show(areaIds) {
        this.stopLoading = this.$loading()
        this.areaTree = []
        if (!areaIds || areaIds.length == 0) {

          this.areaTreeOData.map(item => {
            this.areaTree.push(Object.assign({}, item))
          })

          this.modal = true
          this.stopLoading && this.stopLoading()
          this.refreshTree = false
          this.$nextTick(() => {
            this.refreshTree = true
          })
          return
        }
        this.areaIds = []
        this.shortIds = []
        this.tmpShortIds = []

        this.areaTreeOData1 = this.areaTreeOData.concat([])

        this.areaIds = areaIds
        this.shortIds = areaIds.map(item => {
          item = [...item].reverse().join('') - 0 + ''
          item = [...item].reverse().join('')
          return item
        })

        this.tmpShortIds = this.shortIds.concat([])
        this.tmpShortIds = this.tmpShortIds.filter(item => item.length <= 4)

        this.getSecondData()
      },
      getSecondData() {
        if (this.tmpShortIds.length == 0) {
          this.modal = true
          this.areaTree = this.areaTreeOData1
          this.refreshTree = false
          this.$nextTick(() => {
            this.refreshTree = true
          })
          this.stopLoading && this.stopLoading()
          return
        }

        let areaId = ''
        for (let startId of this.tmpShortIds) {
          if (startId.length == 2) {
            let index = this.shortIds.indexOf(startId)
            areaId = this.areaIds[index]
            this.tmpShortIds.splice(this.tmpShortIds.indexOf(startId), 1)
            break
          }
        }

        if (!areaId) {
          for (let startId of this.tmpShortIds) {
            if (startId.length == 4) {
              let index = this.shortIds.indexOf(startId)
              areaId = this.areaIds[index]
              this.tmpShortIds.splice(this.tmpShortIds.indexOf(startId), 1)
              break
            }
          }
          if (!areaId) {
            return
          }
          this.getThirdData(areaId)
          return
        }

        this.loadAreaData({id: areaId}, data => {
          for (let firstNode of this.areaTreeOData1) {
            if (firstNode.id == areaId) {
              firstNode.childs = data
              firstNode.expand = true
              this.getSecondData()
              break
            }
          }
        })
      },
      getThirdData(areaId) {
        this.loadAreaData({id: areaId}, data => {
          this.areaTreeOData1.map(firstNode => {
            let secondNodes = firstNode.childs || []
            if (secondNodes.length > 0) {
              for (let secondNode of secondNodes) {
                if (secondNode.id == areaId) {
                  secondNode.expand = true
                  data.map(thirdNode => {
                    thirdNode.checked = this.areaIds.indexOf(thirdNode.id) != -1
                  })
                  secondNode.childs = data
                  this.getSecondData()
                  break
                }
              }
            }
          })
        })
      },
      checkChange(checks) {
        this.checks = checks
      },
      deleteArea(areaIds) {
        let data = {areaIds, storeId: this.storeId}
        let stop = this.$loading()
        deleteArea(data).then(res => {
          stop()
          if (res.code === 0) {
            this.getList()
          }
        }).catch(err => {
          stop()
        })
      },
      submit() {
        let areaIds = ''
        let nodes = this.$refs.tree.getCheckedNodes()//flatState
        // nodes = nodes.filter(item => item.node.checked || item.node.indeterminate).map(item => item.node)
        if (nodes.some(item => item.grade == '3')) {
          //nodes = nodes.filter(item => item.grade == '3')
          areaIds = nodes.map(item => item.id)
          // console.log(areaIds)
        } else {
          this.$Message.warning('请精确至区县级')
          return
        }

        let data = {
          areaIds,
          storeId: this.storeId
        }
        let stop = this.$loading()
        saveArea(data).then(res => {
          stop()
          if (res.code === 0) {
            this.getList()
            this.modal = false
          }
        }).catch(err => {
          stop()
        })

      },
      loadAreaData(item, callback) {
        findAllArea({id: item.id, grade: ''}).then(res => {
          if (res.code === 0) {
            let tmp = res.data || []
            tmp.map(item => {
              item.title = item.name
              if (item.grade != '3') {
                item.loading = false
                item.childs = []
              }
            })
            callback(tmp)
          }
        })
      },
      getList() {
        const params = {}
        let searchValue = this.searchValue.trim()
        if (searchValue) {
          params[this.searchType] = searchValue
        }

        params.page = this.page.num - 1
        params.size = this.page.size

        this.loading = true
        queryAll({params}).then(res => {
          this.loading = false
          if (res.code == 0) {
            this.tbdata = res.data.content || []
            this.page.total = res.data.totalElements
          }
        })
      },
      //分页
      changePage(p) {
        this.page.num = p
        this.getList()
      },
      changeSize(size) {
        this.page.num = 1
        this.page.size = size
        this.getList()
      },
      search() {
        this.page.num = 1
        this.getList()
      }
    },
    computed: {
      placeh() {
        let returnText = ""
        this.searchTypeArr.filter((item) => {
          if (item.value == this.searchType) {
            returnText = "请填写" + item.name
          }
        })
        return returnText
      }
    }
  }
</script>

<style scoped>

</style>
