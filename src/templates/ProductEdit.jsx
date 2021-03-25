import React,{useCallback,useState, useEffect} from 'react'
import { TextInput, SelectBox,PrimaryButton } from '../components/UIkit';
import {ImageArea,SetSizeArea} from '../components/Products/';
import {useDispatch} from 'react-redux';
import {saveProduct} from '../reducks/products/operations';
import {push} from 'connected-react-router';
import {db} from "../firebase/index";

const ProductEdit = () => {
    const dispatch = useDispatch();
    let id = window.location.pathname.split('/edit')[1];
    const URLparam = window.location.search;
    // 0:"",1"id" split()[1] 1を返す
    if(id !== ""){
        id = id.split('/')[1]
    }

    const[name, setName] = useState(""),
         [description, setDescription] = useState(""),
         [categories, setCategories] = useState([]),
         [category, setCategory] = useState(""),
         [gender, setGender] = useState(""),
         [images, setImages] = useState([]),
         [price, setPrice] = useState(""),
         [keyword, setKeyword] = useState(""),
         [sizes, setSizes] = useState([]);

    //onChangeイベント
    const inputName = useCallback((event)=>{
       setName(event.target.value) 
    },[setName])
    const inputDescription = useCallback((event)=>{
       setDescription(event.target.value) 
    },[setDescription])
    const inputPrice = useCallback((event)=>{
       setPrice(event.target.value) 
    },[setPrice])
    const inputKeyword = useCallback((event)=>{
       setKeyword(event.target.value) 
    },[setKeyword])

    const genders = [
        {id: "all", name: "全て"},
        {id: "male", name: "メンズ"},
        {id: "female", name: "レディース"},
    ]

    useEffect(() => {
        if(id !== ""){
            db.collection('products').doc(id).get() //idのオブジェクトを入手
                .then(snapshot => {
                const data = snapshot.data();
                    setImages(data.images);
                    setName(data.name);
                    setDescription(data.description);
                    setCategory(data.category);
                    setGender(data.gender);
                    setPrice(data.price);
                    setKeyword(data.keyword);
                    setSizes(data.sizes);
                }) //setStateでstateを先ほど入手したdataに更新してあげる。
        }
    },[id]);
    //商品IDが変わらない限り、mounting以降動かない

    useEffect(() => {
        db.collection('categories')
            .orderBy('order', 'asc')
            .get()
            .then(snapshots =>{
                const list = [];
                snapshots.forEach(snapshot =>{
                    const data = snapshot.data()
                    list.push({
                        id: data.id,
                        name: data.name
                    })
                })
                setCategories(list)
            }) 
    },[])

    return(
        <section>
            <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
            <div className="c-section-container">
                <ImageArea images={images} setImages={setImages}/>
                <TextInput
                    fullWidth={true} label={"商品名"} multiline={false} required={true}
                    onChange={inputName} rows={1} value={name} type={"text"}
                />
                <TextInput
                    fullWidth={true} label={"商品説明"} multiline={true} required={true}
                    onChange={inputDescription} rows={5} value={description} type={"text"}
                />
                <SelectBox
                    label={"カテゴリー"} required={true} options={categories} select={setCategory} value={category}
                />
                <SelectBox
                    label={"性別"} required={true} options={genders} select={setGender} value={gender}
                />
                <TextInput
                    fullWidth={true} label={"価格"} multiline={false} required={true}
                    onChange={inputPrice} rows={1} value={price} type={"number"}
                />
                <TextInput
                    fullWidth={true} label={"検索キーワード（任意）"} multiline={false} required={false}
                    onChange={inputKeyword} rows={1} value={keyword} type={"keyword"}
                />
                <div className="module-spacer--small" />
                <SetSizeArea sizes={sizes} setSizes={setSizes} category={category}/>
                <div className="module-spacer--small" />
                <div className="center">
                    <PrimaryButton
                        label={"商品状態を保存"}
                        onClick={() => dispatch(saveProduct(id, name, description, category, gender, price, images, keyword, sizes))}
                    />
                    <div className="module-spacer--small" />
                    <p onClick={() => dispatch(push('/' + URLparam)) } className="textButton">
                        買い物に戻る
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ProductEdit