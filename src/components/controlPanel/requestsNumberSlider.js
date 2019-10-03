import React from "react";
import { makeStyles, Input, Typography, Slider } from "@material-ui/core/";
// import Typography from "@material-ui/core/Typography";
// import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  input: {
    marginLeft: "1rem",
    marginBottom: "1rem",
    maxWidth: "4rem"
  }
});

export default function RequestNumberSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    // props.setSearchRadius(newValue);
    // Do smth to global state/store
  };

  const handleInputChange = event => {
    let val = parseInt(event.target.value);
    if (!Number.isNaN(val) && typeof val == "number") {
      setValue(val === "" ? "" : Number(val));
      // Do smth to global state/store
    }
  };

  const handleBlur = () => {
    if (value <= 10) {
      setValue(10);
    } else if (value <= 100) {
      setValue(Math.trunc(value / 10) * 10);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <>
      <Typography align="center" gutterBottom>
        Number of photos to return per page
      </Typography>

      <div className={classes.root}>
        <Slider
          value={value}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          step={10}
          min={10}
          max={100}
          style={{ width: "75%", marginRight: "0.5rem", marginLeft: "0.5rem" }}
        />
        <Input
          className={classes.input}
          value={value}
          type="number"
          margin="dense"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 10,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider"
          }}
        />
      </div>
    </>
  );
}
