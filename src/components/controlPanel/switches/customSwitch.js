import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function SwitchButton(props) {
  const checked = !props.checked;

  const handleSwitchChange = event => {
    props.callback();
  };

  return (
    <FormGroup row style={{ justifyContent: "left" }}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleSwitchChange}
            value={checked}
          />
        }
        label={props.label}
      />
    </FormGroup>
  );
}
