import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import ImageWrapper from "../imageWrapper/imageWrapper";
import Carousel, { Modal, ModalGateway } from "react-images";
import { makeStyles, IconButton } from "@material-ui/core";
import {
  Close,
  Fullscreen,
  FullscreenExit,
  MyLocationRounded
} from "@material-ui/icons";
import { getPhotoGeoLocation } from "../../requests/flikr";

const useStyles = makeStyles(theme => ({
  header_container: {
    position: "absolute",
    top: "1px",
    width: "100vw",
    display: "flex",
    zIndex: "2000",
    justifyContent: "space-between", //"flex-end", to align btns to the right
    transition: "opacity 300ms",
    opacity: "1"
  },
  lightbox_btn: {
    color: "#fff",
    background: "rgba(255, 255, 255, 0.2)",
    margin: "2px",
    border: "1px solid #00000024",
    "&:hover": {
      boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)",
      background: "rgba(255, 255, 255, 0.3)"
    }
  },
  hide_on_idle: {
    opacity: "0"
  }
}));

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

const CustomHeader = props => {
  //most props like carouselProps, interactionIsIdle etc are passed by default props react-photo-gallery
  // console.log(props);
  const classes = useStyles();
  const handlePinOnMapClick = id => {
    getPhotoGeoLocation(id).then(res => {
      const result = {
        position: res,
        thumbnail: props.data.src,
        title: props.data.title,
        id: props.data.photoId
      };
      return props.carouselProps.pinPhotoOnMap(result);
    });
  };
  return props.isModal ? (
    <div
      className={
        props.interactionIsIdle
          ? classes.header_container + " " + classes.hide_on_idle
          : classes.header_container
      }
    >
      <IconButton
        aria-label="Pin photo on map"
        className={classes.lightbox_btn}
        onClick={handlePinOnMapClick.bind(this, props.data.photoId)}
      >
        <MyLocationRounded />
      </IconButton>

      <div className={classes.btn_container_right}>
        <IconButton
          aria-label="toggle fullscreen"
          className={classes.lightbox_btn}
          edge="start"
          onClick={props.modalProps.toggleFullscreen}
        >
          {props.modalProps.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>

        {!props.modalProps.isFullscreen && (
          <IconButton
            aria-label="Close"
            className={classes.lightbox_btn}
            edge="start"
            onClick={props.modalProps.onClose}
          >
            <Close />
          </IconButton>
        )}
      </div>
    </div>
  ) : null;
};

const ImageGrid = ({
  photos,
  title,
  direction,
  pinPhotoOnMap,
  setAppBarHide
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback(
    (event, { photo, index }) => {
      setAppBarHide(true);
      // console.log(event);
      // console.log(photo, index);
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
        //It receives the arguments -> event and an object containing the index,
        //Photos obj originally sent and the next and previous photos in the gallery if they exist
      />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              pinPhotoOnMap={pinPhoto}
              components={{ Header: CustomHeader }}
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
    </div>
  );
};

export default ImageGrid;
