import React from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function HideResultsSwitch(props) {
  const [checked, setChecked] = React.useState(false);

  const handleSwitchChange = event => {
    setChecked(event.target.checked);
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
