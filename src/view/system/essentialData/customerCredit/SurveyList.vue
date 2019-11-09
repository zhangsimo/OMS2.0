<template>
    <Form :label-width="100" ref="form" class="list">
      <div class="mb10">
        工商注册信息
      </div>
      <FormItem label='注册名称:' >
        <Input v-model='data.contactor' style="width: 650px" ></Input>
      </FormItem>
      <Row>
        <Col span="8">
          <FormItem label='注册号:' >
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='公司特质:' >
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label='法定代表人:' >
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='经营期限:' >
            <DatePicker :value="data.contactor" format="yyyy/MM/dd"  style="width: 180px"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='注册资本(万):' >
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label='至' >
            <DatePicker :value="data.contactor" format="yyyy/MM/dd"  style="width: 180px"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label='成立日期:' >
            <DatePicker :value="data.contactor" format="yyyy/MM/dd"  style="width: 180px"></DatePicker>
          </FormItem>
          <FormItem label='登记状态:' >
            <Select v-model="data.sureCost" style="width:180px" >
              <Option v-for="item in costList" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="注册地址:">
        <Input v-model='data.contactor' style="width: 650px" ></Input>
      </FormItem>
      <FormItem label="经营地址:">
        <Input v-model='data.contactor' style="width: 650px" ></Input>
      </FormItem>
      <FormItem label="经营范围:">
        <Input v-model='data.contactor' style="width: 650px" ></Input>
      </FormItem>
      <Row>
        <Col span="12">
          <FormItem label="经营执照扫描:">
            <Input v-model='data.contactor' style="width: 150px;float: left" ></Input>
            <Upload style="float: left;line-height: 29px;margin-left: 10px" action="//jsonplaceholder.typicode.com/posts/" accept="image/png">
              <Button class="uploadbtn">上传</Button>
            </Upload>
            <a href="" class="download">下载</a>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="购物合同扫描:">
            <Input v-model='data.contactor' style="width: 150px;float: left" ></Input>
            <Upload style="float: left;line-height: 29px;margin-left: 10px" action="//jsonplaceholder.typicode.com/posts/" accept="image/png">
              <Button class="uploadbtn">上传</Button>
            </Upload>
            <a href="" class="download">下载</a>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="备注:">
        <Input v-model='data.contactor' style="width: 650px" ></Input>
      </FormItem>
      <Row>
        <Col span="8">
          <FormItem label="法人电话:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
          <FormItem label="授权采购员:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem label="身份证号码:">
            <Input v-model='data.contactor' style="width: 380px" ></Input>
          </FormItem>
          <FormItem label="采购员电话:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
      </Row>
      <div class="mb10 mt20">
        结算约定情况
      </div>
      <Row>
        <Col span="8">

        </Col>
        <Col span="8">
          <FormItem label="回购方式:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="约定对账日期:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="回款日期:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="滚动借款周期:">
            <Input v-model='data.contactor' style="width: 180px" ></Input>
          </FormItem>
        </Col>
        <Col span="16">
          <FormItem label="调整原因:">
            <Input v-model='data.contactor' style="width: 380px" ></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
</template>

<script>
    export default {
        name: "SurveyList",
        props:{
            data:''
        },
        data(){
            return {
                costList:[]
            }
        }
    }
</script>

<style scoped>
.download {
  display: inline-block;
  padding: 0 10px;
  line-height: 28px;
  box-sizing: border-box;
  margin-left: 10px;
  border: 1px #ddd solid;
}
.uploadbtn:hover {
  color: #03a9f4;
}
.list>>>.ivu-form-item {
  margin-bottom: 10px;
}
</style>
