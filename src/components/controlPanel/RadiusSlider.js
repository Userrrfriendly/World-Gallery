import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  input: {
    marginLeft: "1rem",
    marginBottom: "1rem"
  }
});

export default function RadiusSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(3);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    props.setSearchRadius(newValue);
  };

  return (
    <>
      <Typography align="center" gutterBottom>
        Search Area Radius in Km
      </Typography>

      <div className={classes.root}>
        <Slider
          value={value}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          step={0.5}
          min={0.5}
          max={30}
          style={{ width: "75%", marginRight: "0.5rem", marginLeft: "0.5rem" }}
        />
        <Typography>{value + ` km`}</Typography>
      </div>
    </>
  );
}
