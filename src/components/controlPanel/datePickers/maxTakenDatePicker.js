import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Checkbox from "@material-ui/core/Checkbox";
import DispatchContext from "../../../context/dispatchContext";
import { SET_MAX_TAKEN_DATE } from "../../../context/rootReducer";

export default function MaxTakenDatePicker(props) {
  const dispatch = useContext(DispatchContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checked, setChecked] = useState(false);

  const handleCheckBox = event => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      dispatch({
        type: SET_MAX_TAKEN_DATE,
        maxTakenDate: format(selectedDate, "yyyy-MM-dd") //sql format readable by humans and flickr API
      });
    } else {
      dispatch({
        type: SET_MAX_TAKEN_DATE,
        maxTakenDate: null
      });
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    dispatch({
      type: SET_MAX_TAKEN_DATE,
      maxTakenDate: format(date, "yyyy-MM-dd") //sql format
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          // minDate={"2000,1,1"}
          style={{ marginLeft: "0.5rem" }}
          disabled={!checked}
          margin="normal"
          id="date-picker-dialog"
          label="max taken date"
          format="dd/MM/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
      <Checkbox
        style={{ alignSelf: "flex-end", marginLeft: "1rem" }}
        checked={checked}
        onChange={handleCheckBox}
        value="max taken date"
        color="primary"
        inputProps={{
          "aria-label": "maximum taken date"
        }}
      />
    </div>
  );
}
