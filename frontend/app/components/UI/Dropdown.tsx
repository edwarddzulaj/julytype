import Select from "react-select";

export default function Dropdown({ ...props }) {
  return (
    <Select
      className="dropdown"
      classNamePrefix="react-select"
      isSearchable={false}
      escapeClearsValue={true}
      {...props}
    />
  );
}
