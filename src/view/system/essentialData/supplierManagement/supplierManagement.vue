<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div slot="left" class="demo-split-pane1">
        <SupplierClassification :data="list" :treeDiagramList="treeList" @getNewTree="getNewList"></SupplierClassification>
      </div>
      <div slot="right" class="demo-split-pane">
        <SupplierData :treeDiagramList="list"></SupplierData>
      </div>
    </Split>
  </div>
</template>
<script>
  import SupplierClassification from "./SupplierClassification";
  import SupplierData from "./SupplierData";
  import {getSupplierTreeList} from '@/api/system/essentialData/supplierManagement'
    export default {
        components:{
            SupplierClassification,
            SupplierData,
        },
        data () {
            return {
                split1: 0.2,
                list:[],
                treeList:[]
            }
        },
        created(){
            this.getList()
        },
        methods:{
            getList(){
                getSupplierTreeList().then( res => {
                    if (res.code == 0){
                        this.list = res.data
                        let leverOne = res.data.filter( item => item.lever ==1)
                        leverOne.map( item => {
                            item.children =[]
                            item.code = item.id
                            this.list.forEach( el => {
                                if (item.id == el.parentId){
                                    item.children.push(el)
                                }
                            })
                        })

                        this.treeList = leverOne
                    }
                })
            },
            getNewList(){
                this.getList()
            }
        }
    }
</script>
<style>
  .demo-split{
    height: 100%;
    background-color: #fff;
    border: 1px solid #dcdee2;
  }
  .demo-split-pane1{
    padding: 10px;
    height: 100%;
  }
  .demo-split-pane{
    height: 100%;
  }
</style>
