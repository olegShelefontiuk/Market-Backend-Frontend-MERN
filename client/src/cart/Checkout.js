import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import {makeStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import auth from './../auth/auth-helper'
import cart from './cart-helper.js'
// import config from "../../../config/config";
// import {StripeProvider} from "react-stripe-elements/src";
import {Elements} from 'react-stripe-elements'
import PlaceOrder from './PlaceOrder'
// import config from "config/config"



const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 90px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: '24px 16px 8px 0px',
    color: theme.palette.openTitle
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: "20px",
  },
  addressField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "45%"
  },
  streetField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "93%"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "90%"
  }
}))

export default function Checkout (){
  const classes = useStyles()
  const user = auth.isAuthenticated().user
  const [values, setValues] = useState({
    checkoutDetails: {
      products: cart.getCart(),
      customer_name: user.name,
      customer_email:user.email,
      delivery_address: { street: '', city: '', state: '', zipcode: '', country:''}
    },
    error: ''
  })

  const handleCustomerChange = name => event => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails[name] = event.target.value || undefined
    setValues({...values, checkoutDetails: checkoutDetails})
  }

  const handleAddressChange = name => event => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails.delivery_address[name] = event.target.value || undefined
    setValues({...values, checkoutDetails: checkoutDetails})
  }

    return (
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          ????????????????
        </Typography>
        <TextField id="name" label="Name" className={classes.textField} value={values.checkoutDetails.customer_name} onChange={handleCustomerChange('customer_name')} margin="normal"/><br/>
        <TextField id="email" type="email" label="Email" className={classes.textField} value={values.checkoutDetails.customer_email} onChange={handleCustomerChange('customer_email')} margin="normal"/><br/>
        <Typography type="subheading" component="h3" className={classes.subheading}>
            ???????????????? ??????????
        </Typography>
        <TextField id="street" label="????????????" className={classes.streetField} value={values.checkoutDetails.delivery_address.street} onChange={handleAddressChange('street')} margin="normal"/><br/>
        <TextField id="city" label="??????????" className={classes.addressField} value={values.checkoutDetails.delivery_address.city} onChange={handleAddressChange('city')} margin="normal"/>
        <TextField id="state" label="??????????????" className={classes.addressField} value={values.checkoutDetails.delivery_address.state} onChange={handleAddressChange('state')} margin="normal"/><br/>
        <TextField id="zipcode" label="???????????????? ????????????" className={classes.addressField} value={values.checkoutDetails.delivery_address.zipcode} onChange={handleAddressChange('zipcode')} margin="normal"/>
        <TextField id="country" label="????????????" className={classes.addressField} value={values.checkoutDetails.delivery_address.country} onChange={handleAddressChange('country')} margin="normal"/>
        <br/> {
            values.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                {values.error}</Typography>)
          }

          {/*  <StripeProvider apiKey={config.stripe_test_secret_key}>*/}
          {/*<Elements>*/}
          {/*  <PlaceOrder checkoutDetails={values.checkoutDetails} />*/}
          {/*</Elements>*/}
          {/*  </StripeProvider>*/}

      </Card>)
}