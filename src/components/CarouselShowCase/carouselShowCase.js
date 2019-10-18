import React from "react";
import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import { makeStyles } from "@material-ui/core/";

import { red, blue, green } from "@material-ui/core/colors";
// const { red, blue, green } = require("@material-ui/core/colors");
import stoneHengePoster from "../../assets/1stonehedge111.jpg";
import stonehenge from "../../assets/stonehenge111.mp4";
import RNG from "../../assets/rng.jpg";
import RNGVIDEO from "../../assets/stonehenge11.mp4";
import Autocomplete from "../../assets/test/autocomplete.mp4";
import AutocompleteIMG from "../../assets/test/parthenon.jpg";

console.log(stonehenge);
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
  }
}));

const CarouselShowCase = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  return (
    <div
      style={{ position: "relative", width: "100%", height: 65 }}
      className="wrapper"
    >
      {/* <Button onClick={() => setOpen(true)}>Open carousel</Button> */}

      <AutoRotatingCarousel
        // mobile={true}
        autoplay={false}
        label="Get started"
        open={open}
        onClose={() => setOpen(false)}
        onStart={() => setOpen(false)}
        style={{ position: "absolute", color: "orange" }}
        // classes={{ content: classes.content }}
      >
        <Slide
          media={
            <video
              width="100%"
              autoPlay={true}
              muted={true}
              loop={true}
              poster={stoneHengePoster}
            >
              <source src={stonehenge} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          }
          mediaBackgroundStyle={{ backgroundColor: red[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: red[600] }}
          title="Wellcome to World Gallery"
          subtitle="A Web App that let's you query Flickr's public photos by the location that they were taken."
        />
        <Slide
          media={
            <video
              width="100%"
              autoPlay={true}
              muted={true}
              loop={true}
              poster={AutocompleteIMG}
            >
              <source src={Autocomplete} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          }
          mediaBackgroundStyle={{ backgroundColor: blue[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: blue[600] }}
          title="Geolocation search for easy localization"
          subtitle={`Powered by Google's Geocoding and Location Autocomplete to quickly center the desired
           country, city, landmark, establishment or address on the map.`}
        />
        <Slide
          media={
            // <img
            //   src="http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png"
            //   alt=""
            // />
            <video
              width="100%"
              autoPlay={true}
              loop={true}
              muted={true}
              poster={RNG}
            >
              <source src={RNGVIDEO} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          }
          mediaBackgroundStyle={{ backgroundColor: green[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: green[600] }}
          title="Query Flickr's photos with one click"
          subtitle={`Just press the 'Search Photos' button to search for photos that were taken inside the map extents`}
        />
        <Slide
          media={
            <img
              src="http://www.icons101.com/icon_png/size_256/id_80975/GoogleInbox.png"
              alt=""
            />
          }
          mediaBackgroundStyle={{ backgroundColor: blue[400] }}
          classes={{
            textMobile: classes.slide_text_mobile,
            text: classes.slide_text,
            title: classes.slide_title
          }}
          style={{ backgroundColor: blue[600] }}
          title="Results are pinned on the spot they where taken*"
          subtitle={`*On average a photo taken with a camera with a GPS or a smartphone will have an error of 5-15 meters.
              No spatial accuracy can be guaranteed for photos were geolocation was set explicitly.`}
        />
      </AutoRotatingCarousel>
    </div>
  );
};

export default CarouselShowCase;
