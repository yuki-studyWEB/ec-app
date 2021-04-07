import React from 'react'
import TextField from '@material-ui/core/TextField'

const TextInput = (props) => {
    return (
        <TextField
            InputLabelProps={props.InputLabelProps}
            fullWidth={props.fullWidth} //boolean型を受け取る。true幅マックス、false適切な幅
            label={props.label}
            margin="dense"
            multiline={props.multiline} //boolean型を受け取る。true複数行、false一行
            required={props.required} //boolean型を受け取る。その項目が必須項目かどうか。
            rows={props.rows}
            value={props.value}
            type={props.type}
            onChange={props.onChange} //入力した項目が変わった時に親のコンポーネントにその変更を伝えるための関数を実行する。
            onKeyPress={props.onKeyPress}
            inputProps={props.inputProps}
            id={props.id}
            name={props.name}
            onKeyUp={props.onKeyUp}
            onBlur={props.onBlur}
            defaultValue={props.defaultValue}
            variant={props.variant}
        />
    )
}

export default TextInput
