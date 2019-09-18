import React from "react";
import { Fab, makeStyles } from "@material-ui/core";
import { MyLocationRounded } from "@material-ui/icons";
// import { MyLocationRounded, MoreVert } from "@material-ui/icons";
import { getPhotoGeoLocation } from "../../requests/flikr";

const useStyles = makeStyles(theme => ({
  pin_to_map_btn: {
    position: "absolute",
    bottom: "2px",
    left: "2px",
    backgroundColor: "#f500577a",
    "&:hover": {
      boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)"
    }
  },
  options_btn: {
    top: "2px",
    right: "2px",
    position: "absolute",
    backgroundColor: "#ffffff59",
    "&:hover": {
      backgroundColor: "#fff",
      boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.75)"
    }
  },
  image: {
    margin: "2px",
    display: "block"
  }
  // container: {
  //   // position: "relative",
  //   // width: "100%"
  //   position: "absolute",
  //   left: "left",
  //   top: "top"
  // }
}));

const ImageWrapper = ({
  index,
  photo,
  margin,
  direction,
  top,
  left,
  selected,
  pinPhotoOnMap,
  openLightbox
}) => {
  const classes = useStyles();

  const cont = {
    backgroundColor: "#eee",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative"
  };

  // console.log(photo);
  const handlePinOnMapClick = id => {
    getPhotoGeoLocation(id).then(res => {
      // console.log(props.src);
      const result = {
        position: res,
        thumbnail: photo.src,
        title: photo.title,
        id: photo.photoId
      };
      // console.log(result);
      // console.log(pinPhotoOnMap);
      return pinPhotoOnMap(result);
    });
  };

  //CONTAINER OVERRIDES FOR COLUMNT LAYOUT
  // position: "absolute",
  // left: left,
  // top: top
  console.log(direction);
  if (direction === "column") {
    cont.position = "absolute";
    cont.left = left;
    cont.top = top;
  }

  return (
    <div
      style={{
        margin,
        height: photo.height,
        width: photo.width,
        ...cont
        // position: "absolute",
        // left: left,
        // top: top
      }}
      className={classes.container}
    >
      <img
        {...photo}
        alt={photo.alt}
        className={classes.image}
        onClick={event => openLightbox.call(this, event, { index, photo })}
      />

      {/* <Fab
        size="small"
        aria-label="add"
        className={classes.options_btn}
      >
        <MoreVert />
      </Fab> */}

      <Fab
        size="small"
        color="secondary"
        aria-label="add"
        className={classes.pin_to_map_btn}
        onClick={handlePinOnMapClick.bind(this, photo.photoId)}
      >
        <MyLocationRounded />
      </Fab>
      <p>Image Title and stuff</p>
    </div>
  );
};

export default ImageWrapper;
