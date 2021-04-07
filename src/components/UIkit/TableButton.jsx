import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: theme.palette.grey['200'],
        color: '#333',
        fontWeight: 400,
        fontSize: 16,
        height: 48,
        marginTop: 16,
        width: 125,
        '&:hover': {
            backgroundColor: theme.palette.grey['300']
        }
    }
}))

const TableButton = (props) => {
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

export default TableButton
