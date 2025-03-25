import { ImageAdd01Icon } from "hugeicons-react"
import { useState } from "react"
import { api, urlStorage } from "../../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import './ProductImages.css'

export function ProductImages({ images, thumbnails, setImages, setThumbnails, handleEdit, position, setPosition }) {

    const { Products } = api

    const products = new Products()
    const { id } = useParams()

    const [newImage, setNewImage] = useState(null)

    async function addNewImage(e) {
        e.preventDefault()

        const formData = new FormData()

        formData.append('new_image', e.target[0].files[0])

        const response = await toast.promise(products.updateImage({ id, data: formData, type: 'add' }), {
            pending: 'Subiendo imagen...',
            success: 'Imagen subida correctamente',
            error: 'Error, no se pudo subir la imagen'
        })

        const { images, thumbnails } = response.product

        setImages(JSON.parse(images))
        setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])
        setNewImage(null)
    }

    async function deleteImage() {

        const response = await toast.promise(products.deleteImage({ id, index: position }), {
            pending: 'Eliminando imagen...',
            success: 'Imagen eliminada correctamente',
            error: 'Error, no se pudo eliminar la imagen'
        })

        const { images, thumbnails } = response.product

        setImages(JSON.parse(images))
        setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])
        setNewImage(null)
        setPosition(null)
    }


    return (
        <div className="container-images">
            <div className="container-thumbnails">
                {images.length <= 4 &&
                    <form onSubmit={addNewImage} className="form-add-image">
                        <span>
                            <ImageAdd01Icon
                                size={32}
                            />
                            Nueva foto
                        </span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => setNewImage(e.target.files[0])}
                        />
                        {newImage &&
                            <div className="container-main-image">
                                <img src={URL.createObjectURL(newImage)} />
                                <div>
                                    <button type="reset" className="btn" onClick={() => {
                                        setNewImage(null)
                                        setPosition(null)
                                    }}>Cancelar</button>
                                    <button type="submit" className="btn btn-regular">Subir imagen</button>
                                </div>
                            </div>
                        }
                    </form>
                }
                {thumbnails.map((e, i) => (
                    <img
                        key={i}
                        src={`${urlStorage}/${e}`}
                        // src={`https://api.bazarrshop.com/storage/${e}`}
                        style={position === i ? { outline: '1px solid #3d6caa' } : {}}
                        onClick={() => setPosition(i)}
                    />
                ))}
            </div>
            {!newImage &&
                position !== null &&
                <div className="container-main-image">
                    <img
                        src={`${urlStorage}/${images[position]}`}
                    // src={`https://api.bazarrshop.com/storage/${images[position]}`}
                    />
                    <div>
                        <button onClick={() => handleEdit('img')} className="btn">Cambiar foto</button>
                        {images.length > 1 && <button onClick={deleteImage} className="btn btn-error-regular"> Eliminar foto</button>}
                    </div>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setPosition(null)} />
                </div>
            }
        </div>
    );
}