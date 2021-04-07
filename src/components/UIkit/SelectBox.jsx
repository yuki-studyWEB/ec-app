import React from 'react'
import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    formControl: {
        marginBottom: 16,
        minWidth: 128,
        width: '100%'
    }
})

const SelectBox = (props) => {
    const classes = useStyles()

    return (
        <FormControl className={classes.formControl}>
            <InputLabel>{props.label}</InputLabel>
            <Select
                required={props.required}
                value={props.value}
                onChange={(event) => props.select(event.target.value)} //selectで選択した値が変わったらその値を元にselect(setState関数)を実行、stateを変更する。
            >
                {props.options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    ) //<Select>は要はHTMLのselectタグのようになる。
}

export default SelectBox
