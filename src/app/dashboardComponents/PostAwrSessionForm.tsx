'use client';

import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import TextEditor from '../components/TextEditor'

const PostForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState('');
  const [heading, setHeading] = useState('');



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  return (
    <div className="postFormWrapper">
      {/* Left Column */}
      <div className="leftColumn">
        <div>
          <label className="formLabel">Heading</label>
          <input
            type="text"
            className="textInput"
            placeholder="Enter title..."
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
        </div>

        <div>
          <label className="formLabel">Add pictures</label>
          <label className="addPhotoBtn">
            Add Photo
            <FaPlus className="text-xs" />
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="imageUploadWrapper">
          {images.map((img, i) => (
            <div key={i} className="imagePreview">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-full h-full object-cover rounded"
              />
              <div className="removeBtn" onClick={() => removeImage(i)}>
                <FaTimes size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="rightColumn">
        <label className="formLabel">Content</label>
        <TextEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
};

export default PostForm;
