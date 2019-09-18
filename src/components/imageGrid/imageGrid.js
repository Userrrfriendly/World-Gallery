import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import ImageWrapper from "../imageWrapper/imageWrapper";
import Carousel, { Modal, ModalGateway } from "react-images";

const ImageGrid = ({ photos, title, direction, pinPhotoOnMap }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    console.log(event);
    console.log(photo, index);
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  //store pinPhotoOnMap so it can be accessed in imageRenderer
  const pinPhoto = pinPhotoOnMap;
  const imageRenderer = useCallback(
    ({ index, left, top, key, containerHeight, photo, onClick }) => {
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
          openLightbox={onClick}
        />
      );
    },
    [direction, pinPhoto]
  );

  return (
    <div>
      <h2>{title}</h2>
      <Gallery
        photos={photos}
        direction={direction}
        renderImage={imageRenderer}
        onClick={openLightbox}
        //the above onClick is an optional react-photo-gallery prop
        //It receives the arguments event and an object containing the index,
        //Photos obj originally sent and the next and previous photos in the gallery if they exist
      />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
};

export default ImageGrid;
