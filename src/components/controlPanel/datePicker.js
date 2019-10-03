import "date-fns";
import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";

export default function DatePicker(props) {
  //Flickr creation date: February 10, 2004
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checked, setChecked] = useState(false);

  const handleCheckBox = event => {
    // setState({ ...state, [name]: event.target.checked });
    setChecked(event.target.checked);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          // minDate={}
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          id="date-picker-dialog"
          label={props.label}
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
        value={`use ${props.label}`}
        color="primary"
        inputProps={{
          "aria-label": props.label
        }}
      />
    </div>
  );
}
