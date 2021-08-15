const {Router} = require("express")

const userCtrl = require('../controllers/user.controllers')
const authCtrl = require('../controllers/auth.controllers')
const router = Router()

router.route('/api/users/')
    .get(userCtrl.list)
    .post(userCtrl.create)

// router.route('/api/users/photo/:userId')
//     .get(userCtrl.photo, userCtrl.defaultPhoto)
// router.route('/api/users/defaultphoto')
//     .get(userCtrl.defaultPhoto)



router.route('/api/users/findpeople/:userId')
    .get(authCtrl.requireSignin, userCtrl.findPeople)

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/stripe_auth/:userId')
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.stripe_auth, userCtrl.update)



router.param('userId', userCtrl.userByID)

module.exports = router