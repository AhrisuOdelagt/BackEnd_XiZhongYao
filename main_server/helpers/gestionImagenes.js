import { v2 as cloudinary } from "cloudinary";

// Inserción de imágenes
async function uploadImg(path, product){
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(path, async (error, result) => {
                if(error){
                    reject(error);
                }
                else{
                    resolve(result);
                    // Agregar el public_id al string de imágenes del producto
                    product.imagenProducto = result.public_id;
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

// Inserción de imágenes (Doctor)
async function uploadImgDoc(path, doctor){
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(path, async (error, result) => {
                if(error){
                    reject(error);
                }
                else{
                    resolve(result);
                    // Agregar el public_id al string de imágenes del producto
                    doctor.imagenDoctor = result.public_id;
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

// Eliminar imágenes
async function removeImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
    }
}

export {
    uploadImg,
    removeImage,
    uploadImgDoc
}
