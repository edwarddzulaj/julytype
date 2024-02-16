import Iconly, { icons } from "./Iconly";

export default function ShowAllButton({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: Function;
}) {
  const toggleCollapsedState = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      {isCollapsed && (
        <button className="show-all-action" onClick={toggleCollapsedState}>
          Show all <Iconly icon={icons.chevronDown}></Iconly>
        </button>
      )}
      {!isCollapsed && (
        <button className="show-all-action" onClick={toggleCollapsedState}>
          Show less <Iconly icon={icons.chevronUp}></Iconly>
        </button>
      )}
    </>
  );
}
