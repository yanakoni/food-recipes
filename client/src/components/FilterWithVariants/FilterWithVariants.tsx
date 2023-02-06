import { useEffect, useState } from 'react';
import { ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputProps, Label, Row } from 'reactstrap';
import { CaretDownFill } from '@styled-icons/bootstrap/CaretDownFill';
import { Loader } from '../Loader/Loader';
import './FilterWithVariants.scss';

const FilterWithVariants = ({ variants, label, inputProps, onVariantSelect, isLoading }: FilterWithVariantsProps) => {
  const [filteredVariants, setFilteredVariants] = useState<string[]>([]);
  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    // set variants
    setFilteredVariants(
      variants.filter((variant) => {
        // if user input is empty or is exactly as any of variants, return all
        if (!inputProps.value || variants.map((val) => val.toLowerCase()).includes(inputProps.value.toString().toLowerCase())) {
          return variant;
        }
        // else filter by those containing the user's input
        return variant.toLowerCase().includes(inputProps.value.toString().toLowerCase());
      })
    );
  }, [variants, inputProps.value]);

  const toggle = () => {
    setShowVariants(!showVariants);
  };

  return (
    <Row className="justify-content-center mb-5">
      <Col sm={8} md={6} lg={4}>
        <Label for={inputProps?.id}>{label}</Label>
        <div>
          <InputGroup>
            <Input {...inputProps} />
            <ButtonDropdown isOpen={showVariants} toggle={toggle} aria-label="Toggle variants menu">
              <DropdownToggle className="btn-addon right">
                <CaretDownFill className="icon" />
              </DropdownToggle>
              <DropdownMenu right className="w-100 filters-menu">
                {isLoading && <Loader size="xl" />}
                {!isLoading &&
                  filteredVariants &&
                  !!filteredVariants.length &&
                  filteredVariants.map((variant) => (
                    <DropdownItem
                      key={variant}
                      onClick={() => onVariantSelect(variant)}
                      className={variant === inputProps?.value?.toString() ? 'selected' : ''}
                    >
                      {variant}
                    </DropdownItem>
                  ))}
                {!isLoading && (!filteredVariants || !filteredVariants.length) && <DropdownItem disabled>No Categories</DropdownItem>}
              </DropdownMenu>
            </ButtonDropdown>
          </InputGroup>
        </div>
      </Col>
    </Row>
  );
};

type FilterWithVariantsProps = {
  variants: string[];
  label: string;
  inputProps: InputProps;
  isLoading: boolean;
  onVariantSelect: (variant: string) => void;
};

export { FilterWithVariants };
