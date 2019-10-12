import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import ImageWrapper from "../imageWrapper/imageWrapper";
import ImageMenu from "../imageWrapper/imageMenu";

import { Typography } from "@material-ui/core";

const ImageGrid = ({
  photos,
  responseDetails,
  direction,
  imageToggleFavorites,
  columns,
  hiddenPhotos,
  openLightbox
}) => {
  React.useEffect(() => {
    //debugging
    console.log("IMAGE GRID: some props Caused Rerender!!!!!");
  }, [
    photos,
    responseDetails,
    direction,
    imageToggleFavorites,
    columns,
    hiddenPhotos
  ]);

  console.log("IMAGEGRID UPDATED!");

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
