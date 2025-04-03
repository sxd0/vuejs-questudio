import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    questions: [],
    users: [],
    tags: [],
    currentUser: {
      id: 1,
      username: 'johndoe',
      email: 'john@example.com',
      reputation: 150,
      is_visible: true
    },
    loading: false,
    error: null,
    notifications: [],
    bookmarks: [],
    searchHistory: [],
    darkMode: true,
    userPreferences: {
      questionsPerPage: 5,
      notificationsEnabled: true,
      emailNotifications: false
    }
  },
  
  getters: {
    // Поиск вопроса по ID
    getQuestionById: (state) => (id) => {
      return state.questions.find(question => question.id === parseInt(id))
    },
    
    // Поиск пользователя по ID
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    
    // Поиск тега по ID
    getTagById: (state) => (id) => {
      return state.tags.find(tag => tag.id === id)
    },
    
    // Получение вопросов по тегу
    getQuestionsByTag: (state) => (tagId) => {
      return state.questions.filter(question => 
        question.tags && question.tags.includes(tagId)
      )
    },
    
    // Получение ответов на конкретный вопрос
    getAnswersByQuestionId: (state) => (questionId) => {
      const question = state.questions.find(q => q.id === questionId)
      return question?.answers || []
    },
    
    // Получение топ пользователей по репутации
    getTopUsers: (state) => (limit = 5) => {
      return [...state.users]
        .sort((a, b) => b.reputation - a.reputation)
        .slice(0, limit)
    },
    
    // Получение популярных тегов (по количеству использований)
    getPopularTags: (state) => (limit = 10) => {
      // Создаем map для подсчета использований тегов
      const tagCounts = {}
      
      state.questions.forEach(question => {
        if (question.tags) {
          question.tags.forEach(tagId => {
            tagCounts[tagId] = (tagCounts[tagId] || 0) + 1
          })
        }
      })
      
      // Сортируем теги по количеству использований
      return state.tags
        .map(tag => ({
          ...tag,
          count: tagCounts[tag.id] || 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    },
    
    // Поиск вопросов по строке запроса
    searchQuestions: (state) => (query) => {
      if (!query) return state.questions
      
      const lowerQuery = query.toLowerCase()
      return state.questions.filter(question => 
        question.title.toLowerCase().includes(lowerQuery) || 
        question.body.toLowerCase().includes(lowerQuery)
      )
    },
    
    // Получение вопросов с принятыми ответами
    getQuestionsWithAcceptedAnswers: (state) => {
      return state.questions.filter(q => 
        q.answers && q.answers.some(a => a.is_accepted)
      )
    },
    
    // Получение общего количества вопросов
    getTotalQuestions: (state) => {
      return state.questions.length
    },
    
    // Получение общего количества ответов
    getTotalAnswers: (state) => {
      return state.questions.reduce((total, q) => 
        total + (q.answers?.length || 0), 0
      )
    },
    
    // Получение процента вопросов с ответами
    getAnsweredPercentage: (state, getters) => {
      const totalQuestions = getters.getTotalQuestions
      if (totalQuestions === 0) return 0
      
      const questionsWithAnswers = state.questions.filter(q => 
        q.answers && q.answers.length > 0
      ).length
      
      return Math.round((questionsWithAnswers / totalQuestions) * 100)
    },
    
    // Проверка, добавлен ли вопрос в закладки
    isBookmarked: (state) => (questionId) => {
      return state.bookmarks.includes(questionId)
    }
  },
  
  mutations: {
    // Установка списка вопросов
    SET_QUESTIONS(state, questions) {
      state.questions = questions
    },
    
    // Установка списка пользователей
    SET_USERS(state, users) {
      state.users = users
    },
    
    // Установка списка тегов
    SET_TAGS(state, tags) {
      state.tags = tags
    },
    
    // Установка статуса загрузки
    SET_LOADING(state, status) {
      state.loading = status
    },
    
    // Установка ошибки
    SET_ERROR(state, error) {
      state.error = error
    },
    
    // Добавление нового вопроса
    ADD_QUESTION(state, question) {
      state.questions.unshift(question)
    },
    
    // Обновление существующего вопроса
    UPDATE_QUESTION(state, updatedQuestion) {
      const index = state.questions.findIndex(q => q.id === updatedQuestion.id)
      if (index !== -1) {
        state.questions.splice(index, 1, updatedQuestion)
      }
    },
    
    // Добавление ответа к вопросу
    ADD_ANSWER(state, { questionId, answer }) {
      const question = state.questions.find(q => q.id === questionId)
      if (question) {
        if (!question.answers) {
          question.answers = []
        }
        question.answers.push(answer)
      }
    },
    
    // Принятие ответа на вопрос
    ACCEPT_ANSWER(state, { questionId, answerId }) {
      const question = state.questions.find(q => q.id === questionId)
      if (question && question.answers) {
        // Сначала снимаем пометку со всех ответов
        question.answers.forEach(a => {
          a.is_accepted = false
        })
        
        // Затем помечаем выбранный ответ
        const answer = question.answers.find(a => a.id === answerId)
        if (answer) {
          answer.is_accepted = true
        }
      }
    },
    
    // Увеличение/уменьшение голосов
    UPDATE_VOTE(state, { id, type, isQuestion }) {
      let item
      
      if (isQuestion) {
        item = state.questions.find(q => q.id === id)
      } else {
        // Ищем ответ среди всех вопросов
        for (const question of state.questions) {
          if (question.answers) {
            item = question.answers.find(a => a.id === id)
            if (item) break
          }
        }
      }
      
      if (item) {
        if (type === 'up') {
          item.vote_count++
        } else if (type === 'down') {
          item.vote_count--
        }
      }
    },
    
    // Инкремент просмотров вопроса
    INCREMENT_VIEWS(state, questionId) {
      const question = state.questions.find(q => q.id === questionId)
      if (question) {
        question.views++
      }
    },
    
    // Добавление/удаление закладки
    TOGGLE_BOOKMARK(state, questionId) {
      const index = state.bookmarks.indexOf(questionId)
      if (index === -1) {
        state.bookmarks.push(questionId)
      } else {
        state.bookmarks.splice(index, 1)
      }
    },
    
    // Добавление элемента в историю поиска
    ADD_SEARCH_HISTORY(state, query) {
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query)
        // Ограничиваем историю 10 последними запросами
        if (state.searchHistory.length > 10) {
          state.searchHistory.pop()
        }
      }
    },
    
    // Очистка истории поиска
    CLEAR_SEARCH_HISTORY(state) {
      state.searchHistory = []
    },
    
    // Добавление нового уведомления
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift({
        id: Date.now(),
        read: false,
        timestamp: new Date().toISOString(),
        ...notification
      })
      
      // Ограничиваем количество уведомлений
      if (state.notifications.length > 30) {
        state.notifications.pop()
      }
    },
    
    // Отметка уведомления как прочитанное
    MARK_NOTIFICATION_READ(state, notificationId) {
      const notification = state.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    },
    
    // Отметка всех уведомлений как прочитанные
    MARK_ALL_NOTIFICATIONS_READ(state) {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    
    // Установка пользовательских настроек
    UPDATE_USER_PREFERENCES(state, preferences) {
      state.userPreferences = {
        ...state.userPreferences,
        ...preferences
      }
    },
    
    // Переключение темной темы
    TOGGLE_DARK_MODE(state) {
      state.darkMode = !state.darkMode
    }
  },
  
  actions: {
    // Загрузка данных из JSON-файла
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
        commit('SET_ERROR', 'Не удалось загрузить данные. Пожалуйста, попробуйте позже.')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    // Создание нового вопроса
    createQuestion({ commit, state }, questionData) {
      return new Promise((resolve) => {
        // Имитация задержки сети
        setTimeout(() => {
          const newQuestion = {
            id: Math.max(...state.questions.map(q => q.id)) + 1,
            author_id: state.currentUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            views: 0,
            is_closed: false,
            is_visible: true,
            is_accepted: false,
            post_type: 'question',
            vote_count: 0,
            answers: [],
            ...questionData
          }
          
          commit('ADD_QUESTION', newQuestion)
          
          // Добавляем уведомление о создании вопроса
          commit('ADD_NOTIFICATION', {
            type: 'question_created',
            title: 'Вопрос создан',
            message: `Ваш вопрос "${newQuestion.title}" был успешно опубликован.`
          })
          
          resolve(newQuestion)
        }, 800)
      })
    },
    
    // Создание нового ответа
    createAnswer({ commit, state, getters }, { questionId, answerData }) {
      return new Promise((resolve) => {
        // Имитация задержки сети
        setTimeout(() => {
          const question = getters.getQuestionById(questionId)
          
          if (question) {
            const newAnswer = {
              id: Math.max(...state.questions.flatMap(q => q.answers?.map(a => a.id) || [0])) + 1,
              author_id: state.currentUser.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              views: 0,
              is_closed: false,
              is_visible: true,
              is_accepted: false,
              post_type: 'answer',
              vote_count: 0,
              parent_id: questionId,
              ...answerData
            }
            
            commit('ADD_ANSWER', { questionId, answer: newAnswer })
            
            // Добавляем уведомление о создании ответа
            commit('ADD_NOTIFICATION', {
              type: 'answer_created',
              title: 'Ответ опубликован',
              message: `Ваш ответ на вопрос "${question.title}" был успешно опубликован.`
            })
            
            resolve(newAnswer)
          } else {
            resolve(null)
          }
        }, 600)
      })
    },
    
    // Голосование за вопрос или ответ
    vote({ commit, state }, { id, type, isQuestion }) {
      return new Promise((resolve) => {
        commit('UPDATE_VOTE', { id, type, isQuestion })
        
        // Находим элемент, за который проголосовали
        let item
        let authorId
        let title
        
        if (isQuestion) {
          item = state.questions.find(q => q.id === id)
          if (item) {
            authorId = item.author_id
            title = item.title
          }
        } else {
          // Ищем ответ
          for (const question of state.questions) {
            if (question.answers) {
              const answer = question.answers.find(a => a.id === id)
              if (answer) {
                item = answer
                authorId = answer.author_id
                title = `ответ на вопрос "${question.title}"`
                break
              }
            }
          }
        }
        
        // Если нашли автора и это не текущий пользователь - добавляем уведомление
        if (authorId && authorId !== state.currentUser.id) {
          commit('ADD_NOTIFICATION', {
            type: 'vote',
            title: 'Новый голос',
            message: `Пользователь проголосовал за ваш ${isQuestion ? 'вопрос' : 'ответ'} "${title}".`
          })
        }
        
        resolve(true)
      })
    },
    
    // Принятие ответа
    acceptAnswer({ commit, state, getters }, { questionId, answerId }) {
      return new Promise((resolve) => {
        const question = getters.getQuestionById(questionId)
        const answer = question?.answers?.find(a => a.id === answerId)
        
        if (question && answer) {
          commit('ACCEPT_ANSWER', { questionId, answerId })
          
          // Если автор ответа не текущий пользователь - добавляем уведомление
          if (answer.author_id !== state.currentUser.id) {
            const author = getters.getUserById(answer.author_id)
            commit('ADD_NOTIFICATION', {
              type: 'answer_accepted',
              title: 'Ответ принят',
              message: `Ваш ответ на вопрос "${question.title}" был принят как лучший.`
            })
          }
          
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    
    // Просмотр вопроса
    viewQuestion({ commit }, questionId) {
      commit('INCREMENT_VIEWS', questionId)
    },
    
    // Добавление/удаление закладки
    toggleBookmark({ commit, state }, questionId) {
      commit('TOGGLE_BOOKMARK', questionId)
      
      const isBookmarked = state.bookmarks.includes(questionId)
      const question = state.questions.find(q => q.id === questionId)
      
      if (question) {
        commit('ADD_NOTIFICATION', {
          type: 'bookmark',
          title: isBookmarked ? 'Вопрос добавлен в закладки' : 'Вопрос удален из закладок',
          message: isBookmarked 
            ? `Вопрос "${question.title}" добавлен в закладки.`
            : `Вопрос "${question.title}" удален из закладок.`
        })
      }
      
      return isBookmarked
    },
    
    // Поиск вопросов
    searchQuestions({ commit, getters }, query) {
      if (query && query.trim().length > 2) {
        commit('ADD_SEARCH_HISTORY', query.trim())
      }
      
      return getters.searchQuestions(query)
    },
    
    // Обновление пользовательских настроек
    updateUserPreferences({ commit }, preferences) {
      commit('UPDATE_USER_PREFERENCES', preferences)
    },
    
    // Переключение темного режима
    toggleDarkMode({ commit }) {
      commit('TOGGLE_DARK_MODE')
    }
  }
})