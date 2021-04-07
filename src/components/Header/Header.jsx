import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { AppBar, Toolbar } from '@material-ui/core'
import logo from '../../assets/img/icons/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { getIsSignedIn } from '../../reducks/users/selectors'
import { push } from 'connected-react-router'
import { HeaderMenus, ClosableDrawer } from './index'
import { resetSearchResult } from '../../reducks/products/operations'

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    },
    menuBar: {
        backgroundColor: '#fff',
        color: '#444'
    },
    toolBar: {
        margin: '0 auto',
        maxWidth: 1024,
        width: '100%',
        height: 85
    },
    iconButtons: {
        margin: '0 0 0 auto'
    },
    logo: {
        width: 200,
        cursor: 'pointer',
        marginLeft: 7
    }
})

const Header = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const isSignedIn = getIsSignedIn(selector)

    const [open, setOpen] = useState(false)
    const [reset, setReset] = useState(0)

    const handleDrawerToggle = useCallback(
        (event) => {
            if (event.type === 'keydown' || event.key === 'Tab' || event.key === 'Shift') {
                return
            }
            setOpen(!open)
        },
        [setOpen, open]
    )

    const resetData = () => {
        setReset(reset + 1)
        dispatch(resetSearchResult())
        dispatch(push('/'))
    }

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.menuBar}>
                <Toolbar className={classes.toolBar}>
                    <img src={logo} alt="Logo" className={classes.logo} onClick={resetData} />
                    {isSignedIn && (
                        <div className={classes.iconButtons}>
                            <HeaderMenus reset={reset} setReset={setReset} handleDrawerToggle={handleDrawerToggle} />
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {isSignedIn && (
                <ClosableDrawer
                    key={reset}
                    reset={reset}
                    setReset={setReset}
                    open={open}
                    onClose={handleDrawerToggle}
                />
            )}
        </div>
    )
}

export default Header
