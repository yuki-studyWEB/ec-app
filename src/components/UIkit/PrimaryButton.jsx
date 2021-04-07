import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    button: {
        backgroundColor: '#6492bc',
        color: '#fff',
        fontSie: 16,
        height: 48,
        marginTop: 16,
        width: 256,
        '&:hover': {
            backgroundColor: '#5a83a9'
        }
    }
})

const PrimaryButton = (props) => {
    const classes = useStyles()

    return (
        <Button
            className={classes.button}
            variant="contained"
            onClick={() => props.onClick()}
            disabled={props.disabled}
        >
            {props.label}
        </Button>
    )
}

export default PrimaryButton
