const {Router} = require("express")
const productCtrl = require('../controllers/product.controllers')
const shopCtrl = require('../controllers/shop.controllers')
const userCtrl = require('../controllers/user.controllers')
const authCtrl = require('../controllers/auth.controllers')
const router = Router()

router.route('/api/products/by/:shopId')
    .post(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.create)
    .get(productCtrl.listByShop)


router.route('/api/product/image/:productId')
    .get(productCtrl.photo, productCtrl.defaultPhoto)
router.route('/api/product/defaultphoto')
    .get(productCtrl.defaultPhoto)

router.route('/api/product/:shopId/:productId')
    .put(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.update)
    .delete(authCtrl.requireSignin, shopCtrl.isOwner, productCtrl.remove)

router.route('/api/products/:productId')
    .get(productCtrl.read)

router.route('/api/products/latest')
    .get(productCtrl.listLatest)

router.route('/api/products/related/:productId')
    .get(productCtrl.listRelated)

router.route('/api/products/categories')
    .get(productCtrl.listCategories)

router.route('/api/products')
        .get(productCtrl.list)

router.param('shopId', shopCtrl.shopByID)
router.param('userId', userCtrl.userByID)
router.param('productId', productCtrl.productByID)

module.exports = router