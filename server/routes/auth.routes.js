const {Router} = require( 'express')
const authCtrl = require( '../controllers/auth.controllers')

const router = Router()
router.route('/auth/signin')
    .post(authCtrl.signin)
router.route('/auth/signout')
    .get(authCtrl.signout)

module.exports = router