const {Router} = require("express")
const shopCtrl = require('../controllers/shop.controllers')
const userCtrl = require('../controllers/user.controllers')
const authCtrl = require('../controllers/auth.controllers')
const router = Router()


router.route('/api/shops')
    .get(shopCtrl.list)

router.route('/api/shops/by/:userId')
    .post(authCtrl.requireSignin,authCtrl.hasAuthorization, userCtrl.isSeller, shopCtrl.create)
    .get(authCtrl.requireSignin, authCtrl.hasAuthorization, shopCtrl.listByOwner)

router.route('/api/shops/:shopId')
    .get(shopCtrl.read)
    .delete(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.remove)
    .put(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.update)

router.route('/api/shops/logo/:shopId')
    .get(shopCtrl.photo, shopCtrl.defaultPhoto)

router.route('/api/shops/defaultphoto')
    .get(shopCtrl.defaultPhoto)



router.param('shopId', shopCtrl.shopByID)
router.param('userId', userCtrl.userByID)

module.exports = router