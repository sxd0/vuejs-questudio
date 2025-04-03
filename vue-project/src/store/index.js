import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    questions: [],
    users: [],
    tags: [],
    currentUser: {
      id: 1,
      username: 'user',
      email: 'user@example.com',
      reputation: 150
    },
    loading: false,
    error: null
  },
  getters: {
    getQuestionById: (state) => (id) => {
      return state.questions.find(question => question.id === parseInt(id))
    },
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    getTagById: (state) => (id) => {
      return state.tags.find(tag => tag.id === id)
    },
    getQuestionsByTag: (state) => (tagId) => {
      return state.questions.filter(question => 
        question.tags && question.tags.includes(tagId)
      )
    }
  },
  mutations: {
    SET_QUESTIONS(state, questions) {
      state.questions = questions
    },
    SET_USERS(state, users) {
      state.users = users
    },
    SET_TAGS(state, tags) {
      state.tags = tags
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchData({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/data/main.json')
        const data = response.data

        if (data.questions) commit('SET_QUESTIONS', data.questions)
        if (data.users) commit('SET_USERS', data.users)
        if (data.tags) commit('SET_TAGS', data.tags)
        
        commit('SET_ERROR', null)
      } catch (error) {
        console.error('Error loading data:', error)
        commit('SET_ERROR', 'Failed to load data. Please try again later.')
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
})