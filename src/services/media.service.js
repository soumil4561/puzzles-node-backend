const { uploadImage } = require('./cloudinary.service')

const uploadPostMedia = async (file, postID) => {
    const uploadedImage = await uploadImage(postID, file);
    return uploadedImage;
}

module.exports = {
    uploadPostMedia
}
