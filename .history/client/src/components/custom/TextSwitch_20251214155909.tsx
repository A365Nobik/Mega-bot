import { memo } from "react";

interface Props {
  value: boolean;
  setValue: (val: boolean) => void;
  children: React.ReactNode;
}

const TextSwitch = memo(({ ...props }: Props) => {
  return (
    <div
      className={` flex items-center transition-colors duration-350 ${
        props.value ? "bg-(--border-color-active)" : "bg-transparent"
      } rounded-lg p-1`}
    >
      <button className="font-mako" onClick={() => props.setValue(!props.value)}>
        {props.children}
      </button>
    </div>
  );
});

TextSwitch.displayName = "TextSwitch";
export default TextSwitch;
