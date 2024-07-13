const { uploadImage } = require('./cloudinary.service')

const uploadPostMedia = async (file, postID) => {
    const uploadedImage = await uploadImage(postID, file);
    return uploadedImage.sercure_url;
}

module.exports = {
    uploadPostMedia
}
