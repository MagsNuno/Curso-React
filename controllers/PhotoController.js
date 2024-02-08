const Photo = require('../models/Photo');
const User = require('../models/User');

const mongoose = require('mongoose');


// INSERT A PHOTO, WITH USER RELATED TO IT
const insertPhoto = async (req, res) => {

    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser.id);

    // CREATE PHOTO
    const newPhoto = await Photo.create({
        image, 
        title,
        userId: user._id,
        userName: user.name
    });

    // IF PHOTO WAS CREATED SUCCESSFUL
    if(!newPhoto){
        res.status(422).json({
            errors: ["A problem has occurred, please try again later."]
        });
        return;
    }


    res.status(201).json(newPhoto);
};


// REMOVE PHOTO FROM DB
const deletePhoto = async (req, res) => {

    const {id} = req.params;
    const reqUser = req.user;

     try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        // CHECK IF PHOTO EXISTS
        if(!photo){
            res.status(404).json({
                errors: ["Photo not found!"]
            });
            return;
        }
    
        // CHECK IF PHOTO BELONGS TO USER
        if(!photo.userId.equals(reqUser._id)){
            res.status(422).json({
                errors: ["An error occurred, please try again later."]
            });
        }
    
        await Photo.findByIdAndDelete(photo._id);
    
        res.status(200).json({id: photo._id, message: "Photo deleted successfully!"});
    } catch (error) {
        res.status(404).json({
            errors: ["Photo not found!"]
        });
        return;
    }
    
};


// GET ALL PHOTOS
const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({})
      .sort([["createdAt", -1]])
      .exec();
  
    return res.status(200).json(photos);
};


// GET USER PHOTOS
const getUserPhotos = async (req, res) => {
    
    const {id} = req.params;
    const photos = await Photo.find({userId: id}).sort([["createdAt", -1]]).exec();
    return res.status(200).json(photos);

};


// GET PHOTO BY ID
const getPhotoById = async (req, res) => {

    const {id} = req.params;

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // CHECK IF PHOTOS EXISTS
    if(!photo){
        res.status(404).json({
            errors: ["Photo not found!"]
        });
        return;
    }

    res.status(200).json(photo);
};


// UPDATE PHOTO
const updatePhoto = async (req, res) => {

    const {id} = req.params;
    const {title} = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById({_id: id});

    // CHECK IF PHOTOS EXISTS
    if(!photo){
        res.status(404).json({
            errors: ["Photo not found!"]
        });
        return;
    }

    // CHECK IF PHOTOS BELONGS TO USER
    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({
            errors: ["An error ocurred. Please try again later."]
        });
        return;
    }

    if(title){
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({photo, message: "Photo saved successfully!"});
};


// LIKE FUNCTIONALITY
const likePhoto = async (req, res) => {

    const {id} = req.params;
    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // CHECK IF PHOTOS EXISTS
    if(!photo){
        res.status(404).json({
            errors: ["Photo not found!"]
        });
        return;
    }

    // CHECK IF USER ALREADY LIKED THE PHOTO
    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({
            errors: ["You've already liked this photo!"]
        });
        return;
    }

    // PUT USER ID IN LIKES ARRAY
    photo.likes.push(reqUser._id);
    photo.save();

    res.status(200).json({photoId: id, userId: reqUser._id, message:"The photo was liked!"});
};


// COMMENT A PHOTO
const commentPhoto = async (req, res) => {

    const {id} = req.params;
    const {comment} = req.body;
    const reqUser = req.user;

    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);

    // CHECK IF PHOTOS EXISTS
    if(!photo){
        res.status(404).json({
            errors: ["Photo not found!"]
        });
        return;
    }

    // PUT COMMENT IN THE ARRAY OF COMMENTS
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    }


    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({comment: userComment, message: "Comment was added successfully!"});
};  


// SEARCHING IMAGES
const searchPhotos = async (req, res) => {

    const {q} = req.query;
    const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);
};


module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}