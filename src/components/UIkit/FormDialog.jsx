import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from './TextInput';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    modal: {
        maxWidth: 650,
        width: '100%',
        margin: 'auto'
    }
})

const FormDialog = (props) => {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [description, setDescription] = useState("")
    

    const inputName = useCallback((event) => {
        setName(event.target.value)
    },[setName]); //TextInputのonChangeイベントに作用して動く
    //引数eventは変更があった対象、jsのイベントリスナーと一緒。入力された内容を随時更新する。

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    },[setEmail]);

    const inputDescription = useCallback((event) => {
        setDescription(event.target.value)
    },[setDescription]);

    const submitForm = () => {
        const validateEmailFormat = (email) => {
            const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(email)
        }

        const validateRequiredInput = (...args) => {
            let isBlank = false;
            for (let i = 0; i < args.length; i=(i+1)|0) {
                if (args[i] === "") {
                    isBlank = true;
                }
            } //name,email,descriptionが空白かどうか
            return isBlank
        };

        const isBlank = validateRequiredInput(name, email, description)
        const isValidEmail = validateEmailFormat(email)

        if (isBlank) {
            alert('必須入力欄が空白です。')
            return false
        } else if (!isValidEmail) {
            alert('メールアドレスの書式が異なります。')
            return false
        } else {
            const payload = {
                text: 'お問い合わせがありました\n' +
                    'お名前：' + name + '\n' +
                    'Email：' + email + '\n' +
                    'お問い合わせ内容：\n' + description
            };

            const url = "https://hooks.slack.com/services/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"

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(() => {
                alert('送信が完了いたしました。後日ご連絡お返しいたします。')
                setName("")
                setEmail("")
                setDescription("")
                return props.handleClose()
            })
        }
    }

    return(
    <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true} maxWidth={'sm'}
    >
        <DialogTitle id="alert-dialog-title">お問い合わせフォーム</DialogTitle>
        <DialogContent>
            <TextInput 
                label={"お名前(必須)"} multiline={false} rows={1} variant="outlined"
                value={name} type={"text"} onChange={inputName} fullWidth={true}
            /><br/>
            <TextInput 
                label={"メールアドレス(必須)"} multiline={false} rows={1} variant="outlined"
                value={email} type={"email"} onChange={inputEmail} fullWidth={true}
            /><br/>
            <TextInput 
                label={"お問い合わせ内容(必須)"} multiline={true} rows={5} variant="outlined"
                value={description} type={"text"} onChange={inputDescription} fullWidth={true}
            />
        </DialogContent>
        <DialogActions>
        <Button onClick={props.handleClose} color="primary">
            キャンセル
        </Button>
        <Button onClick={submitForm} color="primary" autoFocus>
            送信する
        </Button>
        </DialogActions>
    </Dialog>
    )
}

export default FormDialog