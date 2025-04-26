import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const checkboxSx = {
  color: '#606161',
  '&.Mui-checked': {
    color: '#007bff',
  },
};
const labelSx = {
  fontSize: '14px',
  color: '#606161',
};

const MultiCheckbox = ({ options, state, onChange, id }) => {
  const handleChange = (e) => {
    const val = e.target.name;
    const currentValues = state[id] || [];

    if (currentValues.includes(val)) {
      onChange(id, currentValues.filter((item) => item !== val));
    } else {
      onChange(id, [...currentValues, val]);
    }
  };

  return (
    <div className="py-1 flex flex-col">
      <FormGroup row>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                sx={checkboxSx}
                onChange={handleChange}
                name={option.value}
                size="small"
                checked={state[id]?.includes(option.value) || false}
              />
            }
            label={<div style={labelSx}>{option.label}</div>}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default MultiCheckbox;
