import React, { useState } from "react";
import ImageUploading from "react-images-uploading";

const ImageUpload = (props) => {

  // Udviklet fælles i gruppen
  // Bruges til at uploade et billede på admin siden under "Tilføj produkt" 

  return (
    <div>
      <ImageUploading
        value={props.imageState}
        onChange={props.onImageChange}
        dataURLKey="data_url"
        acceptType={["jpg", "png"]}
      >
        {({ imageList, onImageUpload, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
          // write your building UI
          <div className="flex flex-col">
            <button
              className={`${isDragging ? "text-green" : null} gap-2 bg-primary rounded-lg p-2 text-white font-semibold`}
              onClick={onImageUpload}
              {...dragProps}
              type="button"
            >
              <i className="fa-solid fa-cloud-arrow-up text-lg"></i> Upload billede
            </button>
            {imageList.map((image, index) => (
              <div key={index} className="flex justify-between image-item mt-1">
                <p>{image.file.name}</p>
                <div className="image-item__btn-wrapper ">
                  {/* <button onClick={() => onImageUpdate(index)}>Update</button> */}
                  <button type="button" className="text-red font-semibold" onClick={() => onImageRemove(index)}>
                    Fjern billede
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUpload;
