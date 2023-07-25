const TextWithHover = ({ displayText, active }) => {
  return (
    <div className="flex items-center justify-start cursor-pointer xs:text-xs sm:text-xs md:text-sm lg:text-lg">
      <div
        className={`${
          active ? "text-white" : "text-gray-500"
        } font-semibold hover:text-white xs:text-xs sm:text-xs md:text-sm lg:text-lg`}
      >
        {displayText}
      </div>
    </div>
  );
};

export default TextWithHover;
