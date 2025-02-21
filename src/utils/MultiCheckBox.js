import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Define custom styles for the checkboxes
const useStyles = makeStyles({
  checkbox: {
    '& .MuiCheckbox-root': {
      color: '#606161', // Default color
    },
    '& .Mui-checked': {
      color: '#007bff', // Color when checked
    },
  },
  label: {
    fontSize: '14px',
    color: '#606161',
  },
});

const MultiCheckbox = ({ options, state, onChange, id }) => {
  const classes = useStyles();

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
                className={classes.checkbox}
                onChange={handleChange}
                name={option.value}
                size="small"
                checked={state[id]?.includes(option.value) || false}
              />
            }
            label={
              <div className={classes.label}>
                {option.label}
              </div>
            }
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default MultiCheckbox;
