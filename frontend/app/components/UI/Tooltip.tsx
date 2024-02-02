import { Tooltip as ReactTooltip } from "react-tooltip";
import Iconly, { icons } from "./Iconly";

export function Tooltip({ id, content }: { id: string; content: string }) {
  return (
    <span data-tooltip-id={id} data-tooltip-class-name="tooltip">
      <Iconly icon={icons.info} />
      <ReactTooltip
        id={id}
        openOnClick
        globalCloseEvents={{ escape: true, clickOutsideAnchor: true }}
      >
        <div>
          {content}
          <span className="close">
            <Iconly icon={icons.close} />
          </span>
        </div>
      </ReactTooltip>
    </span>
  );
}
