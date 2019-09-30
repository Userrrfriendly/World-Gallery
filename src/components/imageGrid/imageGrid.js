import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import ImageWrapper from "../imageWrapper/imageWrapper";
import ImageMenu from "../imageWrapper/imageMenu";

import Carousel, { Modal, ModalGateway } from "react-images";
import { makeStyles, IconButton, Typography } from "@material-ui/core";
import {
  Close,
  Fullscreen,
  FullscreenExit,
  MyLocationRounded
} from "@material-ui/icons";
// import { getPhotoGeoLocation } from "../../requests/flikr";
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

const ViewRenderer = props => {
  /** https://github.com/jossmac/react-images/issues/300 */
  const overScanCount = 1;
  const { data, getStyles, index, currentIndex } = props;
  const { alt, src } = data;

  return Math.abs(currentIndex - index) <= overScanCount ? (
    <div style={getStyles("view", props)}>
      <img
        alt={alt || `Image ${index}`}
        src={src}
        style={{
          height: "auto",
          maxHeight: "100vh",
          maxWidth: "100%",
          userSelect: "none"
        }}
      />
    </div>
  ) : null;
};

const CustomHeader = props => {
  /*most props like carouselProps, interactionIsIdle etc are passed by default props react-photo-gallery*/
  const classes = useStyles();
  // const handlePinOnMapClick = id => {
  //   getPhotoGeoLocation(id).then(res => {
  //     const result = {
  //       position: res,
  //       thumbnail: props.data.src,
  //       title: props.data.title,
  //       id: props.data.photoId,
  //       thumbWidth: props.data.width_t
  //     };
  //     // return props.carouselProps.pinPhotoOnMap(result);
  //     return props.carouselProps.pinPhotoOnMap(result);
  //   });
  // };

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
        // onClick={handlePinOnMapClick.bind(this, props.data.photoId)}
        onClick={props.carouselProps.addImgToFavorites.bind(this, props.data)}
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
  responseDetails,
  direction,
  // pinPhotoOnMap,
  addImgToFavorites,
  setAppBarHide,
  columns,
  hiddenPhotos
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  React.useEffect(() => {
    console.log("IMAGE GRID SMTH UPDATED!!!!!");
  }, [
    photos,
    responseDetails,
    direction,
    // pinPhotoOnMap,
    addImgToFavorites,
    setAppBarHide,
    columns,
    hiddenPhotos
  ]);

  console.log("IMAGEGRID!##%$#@!");
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
          // pinPhotoOnMap={pinPhotoOnMap}
          addImgToFavorites={addImgToFavorites}
          direction={props.direction}
          openLightbox={props.onClick}
          handleOpenMenuClick={handleOpenMenuClick}
        />
      );
    },
    // [pinPhotoOnMap]
    [addImgToFavorites]
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
          // pinPhotoOnMap={pinPhotoOnMap}
          addImgToFavorites={addImgToFavorites}
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
              // pinPhotoOnMap={pinPhotoOnMap}
              addImgToFavorites={addImgToFavorites}
              components={{
                Header: CustomHeader,

                View: ViewRenderer
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
