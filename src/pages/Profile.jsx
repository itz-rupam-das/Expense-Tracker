import { useState, useEffect, useRef } from 'react';
import { LogOut, Edit2, Check, X, Upload } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { supabase } from '../supabaseClient';
import './Profile.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight
    )
}

export default function Profile() {
    const { user, signOut } = useAuth();
    const { settings, updateSettings } = useExpenses();

    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        avatarUrl: '',
        bio: ''
    });

    useEffect(() => {
        if (settings.userProfile) {
            setFormData(settings.userProfile);
        }
    }, [settings.userProfile]);

    const handleSave = () => {
        updateSettings({ userProfile: formData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(settings.userProfile || { name: '', avatarUrl: '', bio: '' });
        setImageSrc('');
        setIsEditing(false);
    };

    const handleSelectImage = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImageSrc(reader.result?.toString() || ''),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 1));
    };

    const getCroppedImg = async () => {
        const image = imgRef.current;
        if (!image || !completedCrop) return null;

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const pixelRatio = window.devicePixelRatio;
        canvas.width = completedCrop.width * pixelRatio;
        canvas.height = completedCrop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) reject(new Error('Canvas remains empty'));
                else {
                    blob.name = 'cropped.jpeg';
                    resolve(blob);
                }
            }, 'image/jpeg', 0.95);
        });
    };

    const confirmCropAndUpload = async () => {
        if (!completedCrop || !imgRef.current || !user) return;

        try {
            setIsUploading(true);
            const croppedBlob = await getCroppedImg();
            if (!croppedBlob) return;

            // 1. Delete the old avatar
            if (formData.avatarUrl) {
                try {
                    const url = new URL(formData.avatarUrl);
                    const pathParts = url.pathname.split('/avatars/');
                    if (pathParts.length > 1) {
                        const oldFileName = decodeURIComponent(pathParts[1]);
                        const { error: deleteError } = await supabase.storage
                            .from('avatars')
                            .remove([oldFileName]);
                        if (deleteError) console.warn("Failed to delete old avatar:", deleteError);
                    }
                } catch (err) {
                    console.warn("Error parsing old avatar URL:", err);
                }
            }

            // 2. Upload the new avatar
            const fileName = `${user.id}-${Math.random()}.jpeg`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, croppedBlob);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            setFormData({ ...formData, avatarUrl: data.publicUrl });
        } catch (error) {
            console.error(error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setIsUploading(false);
            setImageSrc('');
        }
    };

    const displayName = settings.userProfile?.name || user?.email || 'User';
    const displayAvatar = settings.userProfile?.avatarUrl;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="page-container" id="profile-page">
            <h1 className="page-title">
                <span className="gradient-text">Profile</span>
            </h1>
            <p className="page-subtitle">Manage your personal information</p>

            <div className="profile-wrapper">
                <div className="user-card glass-card fade-in">
                    {!isEditing ? (
                        <>
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)} aria-label="Edit Profile">
                                <Edit2 size={18} />
                                <span>Edit</span>
                            </button>

                            <div className="user-avatar-large">
                                {displayAvatar ? (
                                    <img src={displayAvatar} alt="Avatar" className="avatar-img" />
                                ) : (
                                    initial
                                )}
                            </div>

                            <h3 className="user-email">{displayName}</h3>
                            {settings.userProfile?.name && <p className="user-member-email">{user?.email}</p>}

                            <div className="user-bio-display">
                                {settings.userProfile?.bio ? (
                                    <p>{settings.userProfile.bio}</p>
                                ) : (
                                    <p className="empty-bio">No bio added yet.</p>
                                )}
                            </div>

                            <p className="user-member">Expense Tracker User</p>

                            <button onClick={signOut} className="btn-primary logout-btn-large">
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="profile-edit-form">
                            <h3 className="edit-title">Edit Profile</h3>

                            <div className="preview-top-container">
                                <div className="user-avatar-large">
                                    {formData.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt="Avatar" className="avatar-img" />
                                    ) : (
                                        initial
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="input-label">Display Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label">Avatar Image</label>
                                {!imageSrc ? (
                                    <div className="avatar-upload-container">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="avatar-upload"
                                            className="file-input-hidden"
                                            onChange={handleSelectImage}
                                            disabled={isUploading}
                                        />
                                        <label htmlFor="avatar-upload" className="btn-secondary upload-btn">
                                            <Upload size={16} />
                                            {isUploading ? 'Uploading...' : 'Choose Image'}
                                        </label>
                                    </div>
                                ) : (
                                    <div className="cropper-container">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            aspect={1}
                                            circularCrop
                                        >
                                            <img
                                                ref={imgRef}
                                                alt="Crop me"
                                                src={imageSrc}
                                                onLoad={handleImageLoad}
                                                className="img-to-crop"
                                            />
                                        </ReactCrop>
                                        <div className="cropper-actions">
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setImageSrc('')}
                                                disabled={isUploading}
                                            >
                                                <X size={16} /> Cancel Crop
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={confirmCropAndUpload}
                                                disabled={isUploading || !completedCrop}
                                            >
                                                <Check size={16} /> {isUploading ? 'Uploading...' : 'Confirm Upload'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="input-label">Bio Details</label>
                                <textarea
                                    className="input-field bio-textarea"
                                    placeholder="Tell us a little about yourself..."
                                    rows="3"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <div className="edit-actions">
                                <button className="btn-secondary" onClick={handleCancel}>
                                    <X size={16} /> Cancel
                                </button>
                                <button className="btn-primary" onClick={handleSave}>
                                    <Check size={16} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
