import { MouseEvent } from 'react';
import { Button, Col, FormFeedback, Input, InputGroup, InputProps, Label } from 'reactstrap';
import { VisibilityOff, Visibility } from '@styled-icons/material';

const CustomInput = ({ label, error, showPassword, isPassword, handleClickShowPassword, handleMouseDownPassword, inputProps }: TextFieldProps) => {
  return (
    <InputGroup className="w-100">
      <Col>
        <Label for={inputProps?.id}>{label}</Label>
        {isPassword && (
          <InputGroup>
            <Input {...inputProps} invalid={!!error} />
            <Button
              aria-label={showPassword ? 'Show password' : 'Hide password'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              className="btn-addon right"
            >
              {showPassword ? <Visibility className="icon" /> : <VisibilityOff className="icon" />}
            </Button>
            {!!error && <FormFeedback invalid={!!error}>{error}</FormFeedback>}
          </InputGroup>
        )}
        {!isPassword && inputProps?.type !== 'password' && <Input {...inputProps} invalid={!!error} />}
        {!isPassword && !!error && <FormFeedback invalid={!!error}>{error}</FormFeedback>}
      </Col>
    </InputGroup>
  );
};

type TextFieldProps = {
  label: string;
  error: string;
  showPassword?: boolean;
  isPassword?: boolean;
  handleClickShowPassword?: () => void;
  handleMouseDownPassword?: (event: MouseEvent<HTMLButtonElement>) => void;
  inputProps: InputProps;
};

export { CustomInput };
