import React, { useContext } from "react";
import { makeStyles, Input, Typography, Slider } from "@material-ui/core/";
import QueryContext from "../../context/QueryContext/queryContext";
import DispatchQueryContext from "../../context/QueryContext/dispatchQueryContext";
import { SET_MAX_RESULTS_PER_PAGE } from "../../context/QueryContext/queryReducer";

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
  const store = useContext(QueryContext);
  const dispatch = useContext(DispatchQueryContext);

  const handleSliderChange = (event, newValue) => {
    dispatch({
      type: SET_MAX_RESULTS_PER_PAGE,
      resultsPerPage: newValue
    });
  };

  const handleInputChange = event => {
    let val = parseInt(event.target.value);
    if (!Number.isNaN(val) && typeof val == "number") {
      dispatch({
        type: SET_MAX_RESULTS_PER_PAGE,
        resultsPerPage: val
      });
    }
  };

  const handleBlur = () => {
    const value = store.resultsPerPage;
    if (value <= 10) {
      dispatch({
        type: SET_MAX_RESULTS_PER_PAGE,
        resultsPerPage: 10
      });
    } else if (value <= 250) {
      dispatch({
        type: SET_MAX_RESULTS_PER_PAGE,
        resultsPerPage: Math.trunc(value / 10) * 10
      });
    } else if (value > 250) {
      dispatch({
        type: SET_MAX_RESULTS_PER_PAGE,
        resultsPerPage: 250
      });
    }
  };

  return (
    <>
      <Typography align="center" gutterBottom>
        Number of photos to return per page
      </Typography>

      <div className={classes.root}>
        <Slider
          value={store.resultsPerPage}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          step={10}
          min={10}
          max={250}
          style={{ width: "75%", marginRight: "0.5rem", marginLeft: "0.5rem" }}
        />
        <Input
          className={classes.input}
          value={store.resultsPerPage}
          type="number"
          margin="dense"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 10,
            max: 250,
            type: "number",
            "aria-labelledby": "input-slider"
          }}
        />
      </div>
    </>
  );
}
