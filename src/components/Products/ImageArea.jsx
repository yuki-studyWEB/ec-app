import React, { useCallback } from 'react'
import IconButton from '@material-ui/core/IconButton'
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate'
import { makeStyles } from '@material-ui/styles'
import { storage } from '../../firebase/index'
import ImagePreview from './ImagePreview'

const useStyles = makeStyles({
    icon: {
        height: 48,
        width: 48
    }
})

const ImageArea = (props) => {
    const classes = useStyles()

    const deleteImage = useCallback(
        async (id) => {
            const ret = window.confirm('この画像を削除しますか？')
            if (!ret) {
                return false
            } else {
                const newImages = props.images.filter((image) => image.id !== id)
                props.setImages(newImages)
                return storage.ref('images').child(id).delete()
            }
        },
        [props.images]
    )

    const uploadImage = useCallback(
        (event) => {
            const file = event.target.files
            let blob = new Blob(file, { type: 'image/jpeg' })
            //そのままcloudStorageに保存することはできないので、画像ファイルをBlobというオブジェクトに変えてあげる。

            //Generate random 16 digits strings（同名のファイルがクラウドストレージで存在することを避ける）
            const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            const N = 16
            const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
                .map((n) => S[n % S.length])
                .join('')
            //16桁の文字列をランダム生成(Array.fromで文字列から配列を生成しそれをjoin()で16桁の文字列に連結してあげている。
            //getRandomValuesで16桁の適当な値を作って、それをmapメソッドで配列にして最後join('')で文字列にしてる。

            const uploadRef = storage.ref('images').child(fileName)
            // imagesというクラウドストレージ上のディレクトリのなかの上記で生成したファイルを指している。中身カラ
            const uploadTask = uploadRef.put(blob)
            // put()　画像アップロード、putメソッドで渡せる。

            uploadTask.then(() => {
                //getDownloadURL()アップロードが完了したファイルのダウンロードできるURLを取得
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    const newImage = { id: fileName, path: downloadURL }
                    props.setImages((prevState) => [...prevState, newImage]) //更新前のstateを使える！setState((prevstate => [...prevState, newImage])) 末尾にnewImageを追加。
                }) //setImageはprops.imageのuseState関数、newImageを見て分かる通りidとpathを持つ連想配列を持つ。
            })
        },
        [props.setImages]
    )

    return (
        <div>
            <div className="p-grid__list-images">
                {props.images.length > 0 &&
                    props.images.map((image) => (
                        <ImagePreview delete={deleteImage} id={image.id} path={image.path} key={image.id} />
                    ))}
            </div>
            <div className="u-text-right">
                <span>商品画像を登録する</span>
                <IconButton className={classes.icon}>
                    <label>
                        <AddPhotoAlternateIcon />
                        <input
                            className="u-display-none"
                            type="file"
                            id="image"
                            onChange={(event) => uploadImage(event)}
                        />
                    </label>
                </IconButton>
            </div>
        </div>
    )
}

export default ImageArea
