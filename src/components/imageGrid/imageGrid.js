import React from "react";
import Gallery from "react-photo-gallery";

import ImageWrapper from "../imageWrapper/imageWrapper";

const ImageGrid = ({ photos, title, direction, pinPhotoOnMap }) => {
  // const imageRenderer = useCallback(
  //   ({ index, left, top, key, containerHeight, photo }) => (
  //     <SelectedImage
  //       selected={selectAll ? true : false}
  //       key={key}
  //       margin={'2px'}
  //       index={index}
  //       photo={photo}
  //       left={left}
  //       top={top}
  //     />
  //   ),
  //   [selectAll]
  // );
  // console.log(pinPhotoOnMap);

  //store pinPhotoOnMap so it can be accessed in imageRenderer
  const pinPhoto = pinPhotoOnMap;
  const imageRenderer = ({ index, left, top, key, containerHeight, photo }) => {
    return (
      <ImageWrapper
        key={key}
        margin={"2px"}
        index={index}
        photo={photo}
        left={left}
        top={top}
        pinPhotoOnMap={pinPhoto}
        direction={direction}
      />
    );
  };

  return (
    <div>
      <h2>{title}</h2>
      <Gallery
        photos={photos}
        direction={direction}
        renderImage={imageRenderer}
      />
    </div>
  );
};

export default ImageGrid;
