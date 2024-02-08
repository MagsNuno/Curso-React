import './Profile.css';

import { uploads } from '../../utils/config';

// Components
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs';

// Hooks
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// Redux
import { getUserDetails } from '../../slices/userSlice';
import { publishPhoto, resetMessage, getUserPhotos } from '../../slices/photoSlice';


const Profile = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const { user, loading } = useSelector((state) => state.user);
    const { user: userAuth } = useSelector((state) => state.auth);

    const { photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto } = useSelector((state) => state.photo);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");

    // New form and edit form refs
    const newPhotoForm = useRef();
    const editPhotoForm = useRef();


    const handleFile = (e) => {
        const image = e.target.files[0];
        setImage(image);
    }


    const submitHandle = (e) => {
        e.preventDefault();

        const photoData = [
            title,
            image
        ]

        // Build form data
        const formData = new FormData();
        const photoFormData = Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]));

        formData.append("photo", photoFormData);

        dispatch(publishPhoto(formData));
        setTitle(" ");

        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }


    // Load user data
    useEffect(() => {
        dispatch(getUserDetails(id));
        dispatch(getUserPhotos(id));
    }, [dispatch, id])

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div id='profile'>
            <div className="profile-header">
                {user.profileImage && (
                    <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
                )}
                <div className="profile-description">
                    <h2>{user.name}</h2>
                    <p>{user.bio}</p>
                </div>
            </div>
            {id === userAuth._id && (
                <>
                    <div className="new-photo" ref={newPhotoForm}>
                        <h3>Share one of your moments</h3>
                        <form onSubmit={submitHandle}>
                            <label>
                                <span>Title for the image</span>
                                <input type="text" placeholder='Insert a title' onChange={(e) => setTitle(e.target.value)} value={title || ""} />
                            </label>
                            <label>
                                <span>Image: </span>
                                <input type="file" onChange={handleFile} />
                            </label>
                            {!loadingPhoto && <input type="submit" value="Post" />}
                            {loadingPhoto && (<input type="submit" value="Wait..." disabled />)}
                        </form>
                    </div>
                    {errorPhoto && <Message msg={errorPhoto} type="error" />}
                    {messagePhoto && <Message msg={messagePhoto} type="success" />}
                </>
            )}
            <div className="user-photos">
                <h2>Posted images</h2>
                <div className="photos-container">
                    {photos && photos.map((photo) => (
                        <div className="photo" key={photo._id}>
                            {photo.image && (
                                <img
                                    src={`${uploads}/photos/${photo.image}`}
                                    alt={photo.title}
                                />)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile