export default {
    state:{
        loanId: "",
        guestId: "",
        financeAccountCashList: [],
        claimType: "",
    },
    mutations:{
        setLoanId(state, data) {
            state.loanId = data;
        },
        setGuestId(state, data) {
            state.guestId = data;
        },
        setFinanceAccountCashList(state, data) {
            state.financeAccountCashList = data;
        },
        setClaimType(state, data) {
            state.claimType = data;
        }
    }
  }
  