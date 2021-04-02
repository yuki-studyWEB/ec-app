import React,{useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getUserId } from '../reducks/users/selectors';
import { TextInput,PrimaryButton } from '../components/UIkit';
import {addUserBaseData} from '../reducks/users/operations';
import {push} from 'connected-react-router';
import { db } from '../firebase';
import '../assets/style.css'


const ChangeUserBaseData = () => {
    const dispatch = useDispatch()
    
    const [userData, setUserData] = useState({lastName:"",firstName:"",lastKana:"",firstKana:"",postCodeH:"",postCodeF:"",address1:"",address2:"",address3:"",tel:""}),
          [password, setPassword] = useState(""),
          [dataInput, setDataInput] = useState(false);

    const selector = useSelector((state)=>state)
    const uid = getUserId(selector);

    useEffect(() =>{
        db.collection('users').doc(uid).get()
            .then(snapshot => {
                const data = snapshot.data();
                if (Object.keys(data).length > 6) { //signup時よりフィールド数が多い時。
                    const fullName = data.fullName.split("　");
                    const fullNameKana = data.fullNameKana.split("　");
                    const fullPostCode = data.fullPostCode.split("-");
                    const fulladdress = data.fulladdress.split("　");
                    setUserData({
                        ...userData,
                        lastName: fullName[0],
                        firstName: fullName[1],
                        lastKana: fullNameKana[0],
                        firstKana: fullNameKana[1],
                        postCodeH: fullPostCode[0],
                        postCodeF: fullPostCode[1],
                        address1: fulladdress[0],
                        address2: fulladdress[1],
                        address3: fulladdress[2],
                        tel: data.tel
                    });
                    setDataInput(true)

                } 

            })
    },[])

    useEffect(() =>{
        document.getElementById("lastName").value = userData.lastName;
        document.getElementById("firstName").value = userData.firstName;
        document.getElementById("lastKana").value = userData.lastKana;
        document.getElementById("firstKana").value = userData.firstKana;
        document.getElementById("postCodeH").value = userData.postCodeH;
        document.getElementById("postCodeF").value = userData.postCodeF;
        document.getElementById("address1").value = userData.address1;
        document.getElementById("address2").value = userData.address2;
        document.getElementById("address3").value = userData.address3;
        document.getElementById("tel").value = userData.tel;
    },[dataInput]);

    const handleChange = (e) => {
        const params = userData
        params[e.target.name] = e.target.value
        setUserData(params)
    } 
    const complementAddress = () => {
        const { AjaxZip3 } = window;
        AjaxZip3.zip2addr(
        'postCodeH',
        'postCodeF',
        'address1',
        'address2',
        'address3'
        );
    };

    const onBlurZipcode = () => {
        setUserData({
            ...userData,
            address1: document.getElementById('address1').value,
            address2: document.getElementById('address2').value,
            address3: document.getElementById('address3').value
        });
    };

    const inputPassword = useCallback((event) => {
        setPassword(event.target.value)
    },[setPassword]);



    return(
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">ユーザー情報の変更</h2>
            <div className="module-spacer--small" />
            <div className="abreastContents">
                <TextInput
                    fullWidth={true} label={"苗字"} multiline={false} require={true}
                    rows={1} type={"text"} onChange={e => handleChange(e)} name="lastName" id="lastName"
                    InputLabelProps={{ shrink: true }}
                />
                <TextInput
                    fullWidth={true} label={"名前"} multiline={false} require={true}
                    rows={1} type={"text"} onChange={e => handleChange(e)} name="firstName" id="firstName"
                    InputLabelProps={{ shrink: true }}
                />
            </div>
            <div className="abreastContents">
                <TextInput
                    fullWidth={true} label={"苗字(カナ)"} multiline={false} require={true}
                    rows={1} type={"text"} onChange={e => handleChange(e)} name="lastKana" id="lastKana"
                    InputLabelProps={{ shrink: true }}
                />
                <TextInput
                    fullWidth={true} label={"名前(カナ)"} multiline={false} require={true}
                    rows={1} type={"text"} onChange={e => handleChange(e)} name="firstKana" id="firstKana"
                    InputLabelProps={{ shrink: true }}
                />
            </div>
            <div className="abreastContents">
                <TextInput
                    fullWidth={false} label={"郵便番号"} multiline={false} require={true}
                    rows={1} type={"text"} onChange={e => handleChange(e)} name="postCodeH" id="postCodeH"
                    inputProps={{ maxLength: 3 }}
                    InputLabelProps={{ shrink: true }}
                />
                -
                <TextInput
                    fullWidth={false} label={" "} multiline={false} require={true}
                    rows={1} type={"text"} onChange={e => handleChange(e)} name="postCodeF" id="postCodeF"
                    onKeyUp={complementAddress} onBlur={onBlurZipcode}
                    inputProps={{ maxLength: 4 }}
                    InputLabelProps={{ shrink: true }}
                />
            </div>
            <TextInput
                fullWidth={true} label={"都道府県"} multiline={false} require={true}
                rows={1} type={"text"} onChange={e => handleChange(e)} name="address1" id='address1'
                InputLabelProps={{ shrink: true }}
            />
            <TextInput
                fullWidth={true} label={"郡市区"} multiline={false} require={true}
                rows={1} type={"text"} onChange={e => handleChange(e)} name="address2" id='address2'
                InputLabelProps={{ shrink: true }}
            />
            <TextInput
                fullWidth={true} label={"それ以降の住所"} multiline={false} require={true}
                rows={1} type={"text"} onChange={e => handleChange(e)} name="address3" id='address3'
                InputLabelProps={{ shrink: true }}
            />
            <TextInput
                fullWidth={true} label={"電話番号"} multiline={false} require={false}
                rows={1} type={"tel"} onChange={e => handleChange(e)} name="tel" id="tel"
                InputLabelProps={{ shrink: true }}
            />

            <TextInput
                fullWidth={true} label={"パスワード"} multiline={false} require={true}
                rows={1} value={password} type={"password"} onChange={inputPassword}
                InputLabelProps={{ shrink: true }}
            />
            <div className="module-spacer--extra-extra-small" />
            <div className="center">
                <PrimaryButton
                    label={"ユーザー名を変更する"}
                    onClick={() => dispatch(addUserBaseData(userData,password))}
                />
                <div className="module-spacer--medium" />
                <p onClick={()=>dispatch(push('/user/mypage'))} className="textButton">
                    変更せず戻る
                </p>
            </div>
        </div>
    )
}

export default ChangeUserBaseData