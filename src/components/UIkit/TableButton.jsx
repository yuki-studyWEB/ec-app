import React from 'react';
import Button from '@material-ui/core/Button'
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    button:{
        backgroundColor: "#4dd0e1",
        color: "#333",
        fontSie: 16,
        height: 48,
        marginTop:16,
        width:145,
        '&:hover': {
            backgroundColor: "#45bbcb",
        }
    }
})

const TableButton = (props) => {
    const classes = useStyles();

    return(
        <Button className={classes.button} variant="contained" onClick={() => props.onClick()} disabled={props.disabled}> 
            {props.label}
        </Button>
    )
}

export default TableButton