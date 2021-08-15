const User = require('../models/user.model')
const extend = require('lodash/extend')
const errorHandler = require('../helpers/dbErrorHandler')
const config = require( '../../config/config')
const request = require('request')
const stripe = require('stripe')



const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const list = async (req, res) => {
    try {
        let users = await User.find().select('name about email updated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}


const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const photo = (req, res, next) => {
    if(req.profile.photo.data){
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}
const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd()+require('../../client/src/assets/images/profile-pic.png'))
}

//
const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const addFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}})
        next()
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const addFollower = async (req, res) => {
    try{
        let result = await User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    }catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeFollowing = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}})
        next()
    }catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const removeFollower = async (req, res) => {
    try{
        let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        res.json(result)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const findPeople = async (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    try {
        let users = await User.find({ _id: { $nin : following } }).select('name')
        res.json(users)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const isSeller = (req, res, next) => {
    const isSeller = req.profile && req.profile.seller
    if(!isSeller){
        return res.status('403').json({error: "User is not seller"})
    }
    next()
}

const stripe_auth = (req, res, next) => {
    request({
        url: "https://connect.stripe.com/oauth/token",
        method: "POST",
        json: true,
        body: {client_secret: config.stripe_test_secret_key,code:req.body.stripe, grant_type:'authorization_code'}
    }, (error, response, body) => {
        //update user
        if(body.error){
            return res.status('400').json({
                error: body.error_description
            })
        }
        req.body.stripe_seller = body
        next()
    })
}
const createCharge = (req, res, next) => {
    if(!req.profile.stripe_seller){
        return res.status('400').json({
            error: "Please connect your Stripe account"
        })
    }
    myStripe.tokens.create({
        customer: req.order.payment_id,
    }, {
        stripeAccount: req.profile.stripe_seller.stripe_user_id,
    }).then((token) => {
        myStripe.charges.create({
            amount: req.body.amount * 100, //amount in cents
            currency: "uah",
            source: token.id,
        }, {
            stripeAccount: req.profile.stripe_seller.stripe_user_id,
        }).then((charge) => {
            next()
        })
    })
}
const stripeCustomer = (req, res, next) => {
    if(req.profile.stripe_customer){
        //update stripe customer
        myStripe.customers.update(req.profile.stripe_customer, {
            source: req.body.token
        }, (err, customer) => {
            if(err){
                return res.status(400).send({
                    error: "Could not update charge details"
                })
            }
            req.body.order.payment_id = customer.id
            next()
        })
    }else{
        myStripe.customers.create({
            email: req.profile.email,
            source: req.body.token
        }).then((customer) => {
            User.update({'_id':req.profile._id},
                {'$set': { 'stripe_customer': customer.id }},
                (err, order) => {
                    if (err) {
                        return res.status(400).send({
                            error: errorHandler.getErrorMessage(err)
                        })
                    }
                    req.body.order.payment_id = customer.id
                    next()
                })
        })
    }
}



module.exports = {create,
    userByID,
    read,
    list,
    remove,
    update,
    photo,
    defaultPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    isSeller,
    stripe_auth,
    stripeCustomer,
    createCharge

}