import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import ImageWrapper from "../imageWrapper/imageWrapper";
import ImageMenu from "../imageWrapper/imageMenu";
import LightBoxHeader from "../lightboxComponents/lightboxHeader";
import LightBoxViewRenderer from "../lightboxComponents/lightboxViewRenderer";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Typography } from "@material-ui/core";

const navButtonStyles = base => ({
  ...base,
  background: "rgba(255, 255, 255, 0.2)",
  "&:hover, &:active": {
    boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)",
    background: "rgba(255, 255, 255, 0.3)"
  },
  "&:active": {
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.14)",
    transform: "scale(0.96)"
  }
});

const ImageGrid = ({
  photos,
  responseDetails,
  direction,
  imageToggleFavorites,
  setAppBarHide,
  columns,
  hiddenPhotos
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  React.useEffect(() => {
    //debugging
    console.log("IMAGE GRID: some props Caused Rerender!!!!!");
  }, [
    photos,
    responseDetails,
    direction,
    imageToggleFavorites,
    setAppBarHide,
    columns,
    hiddenPhotos
  ]);

  console.log("IMAGEGRID UPDATED!");
  const openLightbox = useCallback(
    (event, { photo, index }) => {
      setAppBarHide(true);
      setCurrentImage(index);
      setViewerIsOpen(true);
    },
    [setAppBarHide]
  );

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
    setAppBarHide(false);
  };

  /** ImageMenu */
  const [anchorEl, setAnchorEl] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const handleOpenMenuClick = (data, event) => {
    setPhotoData(data);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**Wrapper around ImageWrapper */
  const imageRenderer = useCallback(
    props => {
      return (
        <ImageWrapper
          key={props.key}
          margin={"2px"}
          index={props.index}
          photo={props.photo}
          left={props.left}
          top={props.top}
          imageToggleFavorites={imageToggleFavorites}
          direction={props.direction}
          openLightbox={props.onClick}
          handleOpenMenuClick={handleOpenMenuClick}
        />
      );
    },
    [imageToggleFavorites]
  );

  return (
    <div>
      <Typography variant="h3" component="h1" style={{ marginTop: "1.9rem" }}>
        Results:
      </Typography>
      <Typography variant="subtitle1" component="h2" gutterBottom>
        {photos.length === 0
          ? `Sorry could not find any photos in that particular area`
          : `Displaying ${photos.length} of total ${responseDetails.totalPhotos} photos found...`}
      </Typography>
      {hiddenPhotos.length > 0 && (
        <Typography variant="subtitle2" component="p" gutterBottom>
          ({hiddenPhotos.length}) photos from blocked users are hidden.
        </Typography>
      )}

      {photos.length > 0 && (
        <Gallery
          photos={photos}
          direction={direction}
          renderImage={imageRenderer}
          onClick={openLightbox}
          // the above onClick is an optional react-photo-gallery prop
          // It receives the arguments -> event and an object containing the index,
          // Photos obj originally sent and the next and previous photos in the gallery if they exist
        />
      )}
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              imageToggleFavorites={imageToggleFavorites}
              components={{
                Header: LightBoxHeader,

                View: LightBoxViewRenderer
              }}
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
              styles={{
                navigationPrev: navButtonStyles,
                navigationNext: navButtonStyles
              }}
            />
          </Modal>
        ) : null}
      </ModalGateway>
      <ImageMenu
        anchorEl={anchorEl}
        handleOpenMenuClick={handleOpenMenuClick}
        handleMenuClose={handleMenuClose}
        photoData={photoData}
      />
    </div>
  );
};

export default React.memo(ImageGrid);
