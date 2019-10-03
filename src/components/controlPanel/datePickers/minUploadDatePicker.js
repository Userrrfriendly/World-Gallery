import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { getUnixTime, fromUnixTime, format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
// import StateContext from "../../../context/stateContext";
import DispatchContext from "../../../context/dispatchContext";
import { SET_MIN_UPLOAD_DATE } from "../../../context/rootReducer";

export default function MinUploadDatePicker(props) {
  // const store = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  //Flickr creation date: February 10, 2004
  const [selectedDate, setSelectedDate] = useState(new Date(2004, 1, 1, 1));
  const [checked, setChecked] = useState(false);

  const handleCheckBox = event => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      dispatch({
        type: SET_MIN_UPLOAD_DATE,
        // minUploadDate: getUnixTime(selectedDate)
        minUploadDate: format(selectedDate, "yyyy-MM-dd") //sql format readable by humans and flickr API
      });
    } else {
      dispatch({
        type: SET_MIN_UPLOAD_DATE,
        minUploadDate: null
      });
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    dispatch({
      type: SET_MIN_UPLOAD_DATE,
      // minUploadDate: getUnixTime(date) //works but is unreadable
      minUploadDate: format(date, "yyyy-MM-dd") //sql format
    });
  };

  /** //debugging
   window.GETUNIX = getUnixTime;
  window.FROMUNIX = fromUnixTime;
  window.FORMAT = format;
 */

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          minDate={"2000,1,1"}
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          id="date-picker-dialog"
          label="min upload date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
      <Checkbox
        // classes={{ root: { alignSelf: "flex-end" } }}
        style={{ alignSelf: "flex-end", marginLeft: "1rem" }}
        checked={checked}
        onChange={handleCheckBox}
        value="min upload date"
        color="primary"
        inputProps={{
          "aria-label": "minimum upload date"
        }}
      />
    </div>
  );
}
