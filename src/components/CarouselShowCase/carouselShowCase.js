import React from "react";
import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import { makeStyles, useMediaQuery } from "@material-ui/core/";

import { green } from "@material-ui/core/colors";

import SLIDE1 from "../../assets/SLIDE1.png";
import SLIDE2 from "../../assets/SLIDE2.png";
import SLIDE3 from "../../assets/SLIDE3.png";

const useStyles = makeStyles(theme => ({
  content: {
    maxHeight: "700px"
  },
  slide_text: {
    maxWidth: "90%"
  },
  slide_text_mobile: {
    paddingTop: "8px"
  },
  slide_title: {
    whiteSpace: "initial",
    lineHeight: "23px",
    fontSize: "22px"
  },
  image: {
    maxWidth: "100%"
  }
}));

const CarouselShowCase = props => {
  const classes = useStyles();
  const smScreen = useMediaQuery("(max-width:450px)");

  return (
    <div
      style={{ position: "relative", width: "100%", height: 65 }}
      className="wrapper"
    >
      <AutoRotatingCarousel
        mobile={smScreen}
        autoplay={true}
        interval={3500}
        label="Get Started"
        open={props.open}
        onClose={props.closeCarousel}
        onStart={props.closeCarousel}
        style={{ position: "absolute", color: "orange" }}
        // classes={{ content: classes.content }}
      >
        <Slide
          media={
            <img
              src={SLIDE1}
              alt="Flickr Api plus Maps"
              className={classes.image}
            />
          }
          mediaBackgroundStyle={{ backgroundColor: green[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: green[700] }}
          title="Query Flickr's photos with one click"
          subtitle="World Gallery is a Web App that lets you query Flickr public photos by the location that they were taken."
        />

        <Slide
          media={
            <img
              src={SLIDE3}
              alt="Results are pinned on the Map"
              className={classes.image}
            />
          }
          mediaBackgroundStyle={{ backgroundColor: green[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: green[700] }}
          title="Results are pinned on the spot they where taken*"
          subtitle={`*On average a photo taken with a camera with a GPS or a smartphone will have an error of 5-15 meters.
              No spatial accuracy can be guaranteed for photos where geolocation was set explicitly.`}
        />

        <Slide
          media={
            <img
              src={SLIDE2}
              alt="Powered by Google Geocoding API, Place Autocomplete and Google Maps"
              className={classes.image}
            />
          }
          mediaBackgroundStyle={{ backgroundColor: green[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: green[700] }}
          title="Geolocation search for easy localization"
          subtitle={`Powered by Google's Geocoding and Location Autocomplete to quickly center the desired
           country, city, landmark, establishment or address on the map.`}
        />
      </AutoRotatingCarousel>
    </div>
  );
};

export default CarouselShowCase;
