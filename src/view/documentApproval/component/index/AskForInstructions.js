import moment from 'moment'
import upphoto from '../Upphoto'
import flowbox from '../Flow'
import {getAskSave} from '_api/documentApproval/AskForInstructions.js'
import {getThisAllList} from '@/api/documentApproval/documentApproval/documentApproval'

export default {
  name: "AskForInstructions",
  components: {
    upphoto,
    flowbox
  },
  props: {
    list: ''
  },
  data() {
    return {
      model: false, //模态框开关
      modelType: false, //模态框打开模式 0-新增 1-编辑 3-查看
      saveDis: false,//保存接口返回之前按钮不可点击
      formInline: {},//所有数据对象
      //表单校验
      ruleValidate: {
        topic: [
          {required: true, message: '主题为必填', trigger: 'blur'}
        ],
        applyAmt: [
          {required: true, message: '金额为必填', trigger: 'blur'},
          {pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '最多保留2为小数'}
        ],
        applyMatters: [
          {required: true, message: '申请事项为必填', trigger: 'blur'},
          // {pattern:/^.{0,500}$/,message: "字符长度最长为500"}
        ],
      },
      Pictures: {},//请求回来的图片地址状态
    }
  },
  mounted() {
  },

  methods: {
    //模态框打开111
    open() {
      this.formInline = {}
      this.$refs.upImg.uploadListModal = []
      this.$refs.upImg.uploadList = []
      this.$refs['formInline'].resetFields();
      this.model = true
      //判断模态框状态
      this.modelType = false
      if (this.list.type == 1) {
        let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user = this.$store.state.user.userData
        this.formInline.applicant = user.staffName
        this.formInline.deptName = user.groups.length > 0 ? user.groups[user.groups.length - 1].name : ''
        this.formInline.shopCode = user.currentCompany ? user.currentCompany.code : "";
        this.formInline.orgName = user.currentCompany ? user.currentCompany.shortName : "";
        this.formInline.applyTypeName = '请示申请'
        this.formInline.applyTime = date
      }
      if (this.list.type == 2) {
        this.getList()
      }
      if (this.list.type == 3 || this.list.type == 4) {
        this.getList()
        this.modelType = true
      }
    },

    //获取当前信息
    async getList() {
      let data = {}
      data.id = this.list.id || ''
      let res = await getThisAllList(data)
      if (res.code === 0) {
        this.$nextTick(() => {
          this.formInline = res.data
          this.Pictures = {
            voucherPictures: res.data.voucherPictures || [],
            billStatus: res.data.billStatus
          }
        })

      }
    },


    //获取到上传图片地址
    getImgList(row) {
      this.formInline.voucherPictures = row.list
    },
    //去除换行
    ClearBr(key) {
      key = key.replace(/<\/?.+?>/g, "");
      key = key.replace(/[\r\n]/g, "");
      return key;
    },
    //保存提交
    save(type) {

      this.$refs.formInline.validate(async (valid) => {
        if (valid) {
          if (this.ClearBr(this.formInline.applyMatters).trim().length < 0 || this.ClearBr(this.formInline.applyMatters).trim()=="") {
            this.$Message.error("申请事项必填")
            return
          }
          if (this.ClearBr(this.formInline.applyMatters).trim().length > 501) {
            this.$Message.error("申请事项不可超过500字符")
            return
          }
          this.formInline.step = type
          this.saveDis = true;
          let res = await getAskSave(this.formInline)
          if (res.code == 0) {
            this.saveDis = false;
            this.$Message.success('操作成功')
            this.model = false
            this.$emit("updateD")
          } else {
            this.saveDis = false;
          }
        } else {
          this.$Message.error('带*必填');
        }
      })


    }


  }
}
