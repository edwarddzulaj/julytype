import { Tooltip as ReactTooltip } from "react-tooltip";
import Iconly, { icons } from "./Iconly";

export function Tooltip({ id, content }: { id: string; content: string }) {
  return (
    <span data-tooltip-id={id} data-tooltip-content={content} data-tooltip-class-name="tooltip">
      <Iconly icon={icons.info} />
      <ReactTooltip id={id} openOnClick>
        close
      </ReactTooltip>
    </span>
  );
}
