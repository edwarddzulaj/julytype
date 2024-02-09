import Select, { components } from "react-select";
import Iconly, { icons } from "./Iconly";

const { DropdownIndicator } = components;
const CustomDropdownIndicator = (props: any) => {
  const {
    selectProps: { menuIsOpen },
  } = props;
  return (
    <DropdownIndicator {...props}>
      {menuIsOpen ? <Iconly icon={icons.chevronDown} /> : <Iconly icon={icons.chevronUp} />}
    </DropdownIndicator>
  );
};

export default function Dropdown({ ...props }) {
  return (
    <Select
      className="dropdown"
      classNamePrefix="react-select"
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      isSearchable={false}
      escapeClearsValue={true}
      {...props}
    />
  );
}
