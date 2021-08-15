import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'
import cart from './../cart/cart-helper'
import Badge from "@material-ui/core/Badge";
import CartIcon from "@material-ui/icons/ShoppingCart";

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return {color: '#f57c00'}
  else
    return {color: '#fffde7'}
}
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return {color: '#fffde7', backgroundColor: '#f57c00', marginRight:10}
  else
    return {color: '#616161', backgroundColor: '#fffde7', border:'1px solid #f57c00', marginRight:10}
}
const Menu = withRouter(({history}) => (
  <AppBar position="fixed" style={{zIndex:12343455}}  >
    <Toolbar >
      <Typography variant="h6" color="inherit">
        БазарВокзал
      </Typography>
      <div>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        {/*<Link to="/users">*/}
        {/*  <Button style={isActive(history, "/users")}>Користувачі</Button>*/}
        {/*</Link>*/}
        <Link to="/cart">
          <Button style={isActive(history, "/cart")}>
            Корзина
            <Badge color="secondary" invisible={false} badgeContent={cart.itemTotal()} style={{'marginLeft': '7px'}}>
              <CartIcon />
            </Badge>
          </Button>
        </Link>
      </div>
      <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Реєстрація
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Ввійти
            </Button>
          </Link>

        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          {auth.isAuthenticated().user.seller && (<Link to="/seller/shops"><Button style={isPartActive(history, "/seller/")}>Мої Магазини</Button></Link>)}
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>Моя Сторінка</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Вихід</Button>
        </span>)
      }
      </span></div>
    </Toolbar>
  </AppBar>
))

export default Menu
