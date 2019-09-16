import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography
} from "@material-ui/core/";

import { getPhotoGeoLocation } from "../../requests/flikr";
/***
 * Add Expand Photo
 * Add Pin On Map
 * Typography??? Remove?
 */

const useStyles = makeStyles({
  card: {
    maxWidth: 345
  }
});

export default function ImgMediaCard(props) {
  const classes = useStyles();

  const handlePinOnMapClick = id => {
    getPhotoGeoLocation(id).then(res => {
      // console.log(props.src);
      const result = {
        position: res,
        thumbnail: props.src,
        title: props.imgTitle,
        id: props.photoId
      };
      console.log(result);
      return props.pinPhotoOnMap(result);
    });
  };

  const handleImageClick = () => {
    console.log("image was clicked");
    /***ADD LOGIC TO EXPAND THE IMAGE */
  };

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={props.imgTitle}
          height="140"
          src={props.src}
          title={props.imgTitle}
          onClick={handleImageClick}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.imgTitle ? props.imgTitle : "untitled image"}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          color="primary"
          title="The pin will appear on the map based on where the place the photo was taken"
          onClick={handlePinOnMapClick.bind(this, props.photoId)}
        >
          Pin on the map
        </Button>
        <Button
          size="small"
          color="primary"
          href={`https://www.flickr.com/people/${props.user}`}
          target="_blank"
          title="Open Flickr profile of the user who took the picture"
        >
          Go to owners profile
        </Button>
      </CardActions>
    </Card>
  );
}
