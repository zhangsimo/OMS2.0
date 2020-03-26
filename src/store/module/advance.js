export default {
  state: {
    claimedSearch: {
      suppliers: "",
      reciprocalAccountName: "",
      amount: 0,
      amountType: 0,
    },
    /**
     * 带入核销结算的选中认领数据
     */
    claimedSelectionList: [],
    /**
     * 标记(1 资金认领核销(选择的月结对账单) 2 预收款核销 3 预收款支出认领 4 预付款核销 5 预付款收回认领) 
     * 注：资金认领核销页面选择的未核销对账单类型如果是预收款，对应预收款核销；如果是预付款，对应预付款核销
     */
    sign: "",
    accountNo: "",
  },
  getters: {
      getClaimedSearch(state) {
        let obj = {};
        for (let key in state.claimedSearch) {
            if(!!state.claimedSearch[key]) {
                obj[key] = state.claimedSearch[key]
            }
        }
        return obj;
      },
      // 核销结算数据
      gettlementData(state) {
        let list = state.claimedSelectionList.map(el => {
          let item = {
            amt: el.incomeMoney == 0 ? el.paidMoney : el.incomeMoney,
            account: el.accountCode,
            incomeMoney: el.incomeMoney,
            paidMoney: el.paidMoney,
            ownStoreId: el.shopId,
            ownStoreName: el.shopName,
            accountBank: el.bankName,
            accountBankNo: el.accountName,
            accountName: el.accountName,
            subjectName: el.mateAccountName,
            mateAccountCode: el.mateAccountCode,
            transRemark: el.tradingNote,
          };
          return item;
        })
        return {
          accountNo: state.accountNo,
          sign: state.sign,
          list,
        }
      }
  },
  mutations: {
    setClaimedSearch(state, searchContent) {
      state.claimedSearch = searchContent;
    },
    setClaimedSelectionList(state, list = []) {
      state.claimedSelectionList = list;
    },
    setSign(state, { type, accountNo }) {
      state.sign = type;
      state.accountNo = accountNo;
    }
  },
  actions: {}
};
