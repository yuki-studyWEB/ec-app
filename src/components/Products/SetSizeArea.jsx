import React, {useCallback, useEffect, useState} from 'react';
import {TextInput} from "../UIkit";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {Checkbox, FormControlLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import { SelectSizeBox } from '../UIkit';

const useStyles = makeStyles((theme)=>({
    checkIcon: {
        float: 'right'
    },
    iconCell: {
        padding: 0,
        width: 48,
        height: 48
    },
    boxMargin: {
        padding: '0 15px'
    },
    others: {
        width: '30%',
        [theme.breakpoints.down('sm')]:{
            width: 'auto'
        },
        display: 'inline-block',
        verticalAlign: 'bottom',
        textAlign: 'center',
        marginBottom: 12,
        marginRight: 40
    }
}))

//props.sizes,props.setSizes
const SetSizeArea = (props) => {
    const classes = useStyles();

    const [index, setIndex] = useState(0),
          [size, setSize] = useState(""),
          [checked, setChecked] = useState(false),
          [quantity, setQuantity] = useState(0);
    const sizeList = [];
    console.log(sizeList)
    switch(props.category){
        case "shoes":
        for(let i=22; i < 29.5; i+=0.5){
            const num = i
            const shoesize = num.toFixed(1);
            sizeList.push(shoesize)
        }
        break;
        case "others":
        sizeList.push('FREE');
        break;
        default:
        sizeList.push('SS','S','M','L','LL');
        break;
    }
    console.log(sizeList)
    //onChangeイベント ...値が変更された時
    const inputSize = useCallback((event) =>{
        setSize(event.target.value)
    },[setSize]);
    const inputQuantity = useCallback((event) =>{
        setQuantity(event.target.value)
    },[setQuantity]);

    const addSize = (index, size, quantity) =>{
        if (size === "" || quantity === 0) {
            //Required input is blank
            return false
        } else {
            //現在のsizesのlength(配列の数)とローカルのindexが一緒であれば新規作成
            if (index === props.sizes.length){
                props.setSizes(prevState => [...prevState,{size: size,quantity: quantity}])
                setIndex(index + 1)
                setSize("")
                setQuantity(0)
            } else {
                //ローカルindexがeditSize()で上書き変更された時、既に登録されたサイズ編集
                const newSizes = props.sizes
                newSizes[index] = {size: size, quantity: quantity}
                props.setSizes(newSizes)
                setIndex(newSizes.length)
                setSize("")
                setQuantity(0)
            }

        }
    }

    //index(i),size(item.size),quantity(item.quantity)
    const editSize = (index, size, quantity) => {
        setIndex(index)
        setSize(size)
        setQuantity(quantity)
    }

    const deleteSize = (deleteIndex) => {
        const newSizes = props.sizes.filter((item, i) => i !== deleteIndex);
        props.setSizes(newSizes)
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
        
    };

    useEffect(() => {
        setIndex(props.sizes.length)
    },[props.sizes.length]);
    //編集の場合、既にsizesの配列があるため、それを反映する処理
    //useMemoは関数の結果を保持

    return(
        <div>
            <TableContainer className={classes.boxMargin} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>サイズ</TableCell>
                            <TableCell>数量</TableCell>
                            <TableCell className={classes.iconCell} />
                            <TableCell className={classes.iconCell} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.sizes.length > 0 &&(
                            props.sizes.map((item,i) => (
                                <TableRow key={item.size}>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <IconButton className={classes.iconCell} onClick={() => editSize(i, item.size, item.quantity)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton className={classes.iconCell} onClick={() => deleteSize(i)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div>
                    {checked ? (
                        <TextInput
                            fullWidth={false} label={"size"} multiline={false} required={true}
                            onChange={inputSize} rows={1} value={size} type={"text"}
                        />
                    ):(
                        <>
                        {sizeList.length !== 1 ?(
                            <SelectSizeBox
                                label={"size"} required={true} options={sizeList} select={setSize} value={size}
                            />
                        ):(
                            <p className={classes.others}>{sizeList[0]}</p>
                        )}
                        </>
                    )}
                    <TextInput
                        fullWidth={false} label={"quantity"} multiline={false} required={true}
                        onChange={inputQuantity} rows={1} value={quantity} type={"number"}
                    />
                </div>
                <div className='abreastContents space-between'>
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        name="checked"
                        color="primary"
                    />
                    }
                    label="サイズを手入力"
                />
                <IconButton className={classes.checkIcon} onClick={() => addSize(index,size,quantity)}>
                    <CheckCircleIcon />
                </IconButton>
                </div>
            </TableContainer>
        </div>
    )

}

export default SetSizeArea