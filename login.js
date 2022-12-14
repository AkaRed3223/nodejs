const express = require('express')
const router = express.Router()

module.exports = () => {
  const signUpRouter = new SignUpRouter()
  router.post('/signup', ExpressRouterAdapter.adapt(signUpRouter))
}

class ExpressRouterAdapter {
  static adapt (signUpRouter) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await signUpRouter.route(httpRequest)
      res.status(httpResponse.statusCode).body(httpResponse.body)
    }
  }
}

// signup-router
class SignUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SignUpUseCase().signUp(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

// signup-usecase
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().add(email, password)
    }
  }
}

// add-account-repo
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
