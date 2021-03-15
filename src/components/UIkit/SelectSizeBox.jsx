import React from 'react'
import {InputLabel, MenuItem, FormControl, Select} from "@material-ui/core"
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme)=>({
    formControl: {
        marginBottom: 16,
        minWidth: 40,
        width: "25%",
        bottom: '-5px',
        [theme.breakpoints.up('sm')]: {
            marginRight: 60
        },
        [theme.breakpoints.down('sm')]: {
            marginRight: 40
        }
    }
}))

const SelectSizeBox = (props) => {
    const classes = useStyles();
    return(
        <FormControl className={classes.formControl}>
            <InputLabel shrink>{props.label}</InputLabel>
            <Select
                required={props.required} value={props.value}
                autoWidth
                onChange={(event) => props.select(event.target.value)}//selectで選択した値が変わったらその値を元にselect(setState関数)を実行、stateを変更する。
            >
                {props.options.map((option,index) => (
                    <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )//<Select>は要はHTMLのselectタグのようになる。
}

export default SelectSizeBox