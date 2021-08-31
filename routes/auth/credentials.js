const router = require('express').Router();
const { getCredentials } = require('../../controllers/credentials')

router.get('/getCredentials', (req, res) => {

  let authId = req.query.authId

  getCredentials(authId).then(cret => {
    if (cret && cret.credentials) {
      res.json(JSON.parse(cret.credentials))
    }
    else {
      res.json('not found')
    }
  })
})


module.exports = router