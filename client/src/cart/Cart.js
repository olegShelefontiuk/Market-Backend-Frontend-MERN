import React, {useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import CartItems from "./CartItems";
import Checkout from "./Checkout";
// import {StripeProvider} from "react-stripe-elements/src";
// import config from "config/config"

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: 30,
    }
}))

export default function Cart () {
    const classes = useStyles()
    const [checkout, setCheckout] = useState(false)

    const showCheckout = val => {
        setCheckout(val)
    }
    return(
        <div className={classes.root}>
            <Grid container spacing={8}>
                <Grid item xs={6} sm={6}>
                    <CartItems checkout={checkout}
                               setCheckout={showCheckout}/>
                </Grid>
                {checkout && <Grid item xs={6} sm={6}>

                    <Checkout/>

                </Grid> }
            </Grid>
        </div>

    )
}