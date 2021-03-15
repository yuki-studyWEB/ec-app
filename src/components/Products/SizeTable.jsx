import React from 'react';
import {IconButton, Table, TableBody, TableCell, TableContainer, TableRow} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";


const useStyles = makeStyles({
    iconCell: {
        padding: '0 5px 0 0',
        height: 48,
        width: 48
    }
});

const SizeTable = (props) => {
    const classes = useStyles();
    const sizes = props.sizes;


    return (
        <TableContainer>
            <Table>
                <TableBody>
                    {sizes.length > 0 &&(
                        sizes.map((size,index) =>(
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {size.size}
                                </TableCell>
                                <TableCell>
                                    残り{size.quantity}点
                                </TableCell>
                                <TableCell　className={classes.iconCell}>
                                    {size.quantity > 0 ?(
                                        <IconButton onClick={() => props.addProduct(size.size)}>
                                            <ShoppingCartIcon />
                                        </IconButton>
                                    ) : (
                                        <div>売切れ</div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SizeTable