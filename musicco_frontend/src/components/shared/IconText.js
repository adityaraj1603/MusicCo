import { Icon } from "@iconify/react";

const IconText = ({ iconName, displayText, active, fontsize }) => {
  return (
    <div className="flex items-center justify-start cursor-pointer">
      <div className="px-5 py-2">
        <Icon
          icon={iconName}
          color={active ? "white" : "gray"}
          fontSize={fontsize}
        />
      </div>
      <div
        className={`${active ? "text-white" : "text-gray-400"} 
        text-sm font-semibold hover:text-white`}
      >
        {displayText}
      </div>
    </div>
  );
};

export default IconText;
