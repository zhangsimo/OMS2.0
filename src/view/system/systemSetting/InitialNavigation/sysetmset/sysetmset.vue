<template>
  <main class="tenant-res">
    <!--上部-->
    <section class="oper-box">
      <div class="oper-top flex">
        <div class="wlf">
          <div class="db">
            <Button class="mr10" @click="save">
              <span class="center">
                <Icon custom="iconfont iconbaocunicon icons" />保存
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <!--上部-->
    <section class="con-box">
      <div class="set-warp">
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">销售单、销售出库配件选择tab切换成批次选择:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="trun">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">打印抬头显示:</p>
          </Col>
          <Col :span="12">
            <Input v-model="printHeader" placeholder="请输入打印抬头" style="width: 140px;" class="mr10" />
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">销售单、销售出库单打印内容:</p>
          </Col>
          <Col :span="12">
            <Input
              v-model="content"
              type="textarea"
              placeholder="请输入销售单、销售出库单打印内容"
              style="width: 240px;"
              class="mr10"
            />
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">打印单表格是否换行:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isrow">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">启用额度审批流程:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isQuota">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">业务员是否只可见自己的客户和订单:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isMe">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">业务员是否禁止可见采购价:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isWatch">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">是否开启分级提成:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isLv">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">是否开启采购计划审批:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isPPA">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">是否开启临时采购审批:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isTPA">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">是否开启门店外采审批:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isEAOM">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
        <Row class="row" type="flex" align="middle">
          <Col :span="12">
            <p class="end">是否开启调拨自动受理流程:</p>
          </Col>
          <Col :span="12">
            <RadioGroup v-model="isAuto">
              <Radio label="1">开启</Radio>
              <Radio label="0">关闭</Radio>
            </RadioGroup>
          </Col>
        </Row>
      </div>
    </section>
  </main>
</template>

<script>
import * as api from "_api/system/systemSetting/systemset";
const data = () => {
  return {
    setarr: [],
    // 0关闭 1开启
    trun: "", // 销售单、销售出库配件选择tab切换成批次选择
    printHeader: "", // 抬头
    content: "", // 销售单、销售出库单打印内容
    isrow: "", // 打印单表格是否换行
    isQuota: "", // 启用额度审批流程
    isMe: "", // 业务员是否只可见自己的客户和订单
    isWatch: "", // 业务员是否禁止可见采购价
    isLv: "", // 是否开启分级提成
    isPPA: "", // 是否开启采购计划审批
    isTPA: "", // 是否开启临时采购审批
    isEAOM: "", // 是否开启门店外采审批
    isAuto: "", // 是否开启调拨自动受理流程
  };
};

const mounted = function() {
  this.getset();
};

const methods = {
  // 获取
  async getset() {
    let res = await api.getSys({orgid: 1});
    if (res.code === 0) {
      this.setarr = res.data;
      this.setarr.forEach(el => {
        switch (el.keyidId) {
          case 3:
            this.isrow = el.keyidValue;
            break;
          case 8:
            this.isPPA = el.keyidValue;
            break;
          case 5:
            this.isMe = el.keyidValue;
            break;
          case 0:
            this.trun = el.keyidValue;
            break;
          case 9:
            this.isTPA = el.keyidValue;
            break;
          case 10:
            this.isEAOM = el.keyidValue;
            break;
          case 7:
            this.isLv = el.keyidValue;
            break;
          case 6:
            this.isWatch = el.keyidValue;
            break;
          case "2":
            this.content = el.keyidValue;
            break;
          case 4:
            this.isQuota = el.keyidValue;
            break;
          case 1:
            this.printHeader = el.keyidValue;
            break;
          case 11:
            this.isAuto = el.keyidValue;
            break;
          default:
            return;
        }
      });
    }
  },
  // 保存
  async save() {
    this.setarr = this.setarr.map(el => {
      switch (el.keyidName) {
        case 3:
          el.keyidValue = this.isrow;
          break;
        case 8:
          el.keyidValue = this.isPPA;
          break;
        case 5:
          el.keyidValue = this.isMe;
          break;
        case 0:
          el.keyidValue = this.trun;
          break;
        case 9:
          el.keyidValue = this.isTPA;
          break;
        case 10:
          el.keyidValue = this.isEAOM;
          break;
        case 7:
          el.keyidValue = this.isLv;
          break;
        case 6:
          el.keyidValue = this.isWatch;
          break;
        case "2":
          el.keyidValue = this.content;
          break;
        case 4:
          el.keyidValue = this.isQuota;
          break;
        case 1:
          el.keyidValue = this.printHeader;
          break;
        case 11:
          el.keyidValue = this.isAuto;
          break;
        default:
          break;
      }
      return el;
    });
    let res = await api.saveSys(this.setarr)
    if(res.code === 0) {
      this.$Message.success('保存成功');
      this.getset();
    }
  }
};

export default {
  name: "systemset",
  data,
  mounted,
  methods
};
</script>

<style lang="less" scoped>
@import url("../../../../lease/tenantres/icon");
.set-warp {
  .row {
    margin: 20px 0;
  }
  .end {
    text-align: right;
    padding-right: 20px;
  }
}
</style>
