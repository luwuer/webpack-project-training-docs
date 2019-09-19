export default {
  state: {
    userName: 'admin',
    userAge: 18
  },
  mutations: {
    setUserName(state, userInfo) {
      state.userName = userInfo.name
    },
    setUserAge(state, userInfo) {
      state.userAge = userInfo.age
    }
  },
  actions: {
    setUserInfo({ commit }) {
      // The real userInfo should to fetch api of your server
      let userInfo = {
        name: 'luwuer',
        age: 15
      }

      commit('setUserName', userInfo)
      commit('setUserAge', userInfo)
    }
  }
}