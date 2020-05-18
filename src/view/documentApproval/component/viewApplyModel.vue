<template>
  <Modal
    v-model="model"
    title="客户信用调查"
    width="1200px"
  >
      <survey-list :data="mainData"></survey-list>
    <div slot='footer'></div>
  </Modal>
</template>

<script>
	import SurveyList from "../../system/essentialData/customerCredit/SurveyList";
  import {findCreditDetail} from "../../../api/documentApproval/documentApproval/documentApproval";
  export default {
		name: "applyModelView",
    components: {SurveyList},
    data(){
		  return {
        model:false,
        mainData:{}
      }
    },
    methods:{
		  init(row){
        this.model = true;
        this.getCreditDetail(row)
      },
      async getCreditDetail(row){
        let rep = await findCreditDetail({'code':row.applyNo});
        if(rep.code==0){
          this.mainData = rep.data||{};
        }
      },
    }
	}
</script>

<style scoped>

</style>
