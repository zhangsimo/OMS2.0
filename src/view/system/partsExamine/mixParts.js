export const minxParts = {
  data(){
    return {
      columnsPart:[
        {
          title: '序号',
          minWidth: 50,
          type:'index'
        },
        {
          title: '配件信息',
          key: 'venderSkuNo',
          align: 'center',
          children: [
            {
              title: '所属体系',
              key: 'venderSkuNo',
              minWidth: 70,
            },
            {
              title: '申请分店',
              key: 'orgname',
              minWidth: 70,
            },
            {
              title: '配件编码',
              key: 'brandCode',
              minWidth: 70,
            },
            {
              title: '配件名称',
              key: 'name',
              minWidth: 70,
            },
            {
              title: '配件品质',
              key: 'qualityTypeName',
              minWidth: 70,
            },
          ]
        }
      ]
    }
  }
}
