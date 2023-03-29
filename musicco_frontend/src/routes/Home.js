import { Icon } from "@iconify/react";
import musicco_logo from "../assets/images/musicco_logo_white.svg";
import IconText from "../components/shared/IconText";

const Home = () => {
  return (
    <div className="h-full w-full flex">
      <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10">
        <div>
          <div className="logoDiv p-6 text-white-700 ">
            <IconText
              iconName={"simple-line-icons:social-spotify"}
              displayText={"MusicCo"}
              active
              fontsize="60"
            />
          </div>
          <div className="py-5">
            <IconText
              iconName={"material-symbols:home"}
              displayText={"Home"}
              active
              fontsize="32"
            />
            <IconText
              iconName={"material-symbols:search-rounded"}
              displayText={"Search"}
              fontsize="32"
            />
            <IconText
              iconName={"icomoon-free:books"}
              displayText={"Library"}
              fontsize="32"
            />
          </div>
          <div className="pt-5">
            <IconText
              iconName={"material-symbols:add-box"}
              displayText={"Create Playlist"}
              fontsize="32"
            />
            <IconText
              iconName={"mdi:cards-heart"}
              displayText={"Liked Songs"}
              fontsize="32"
            />
          </div>
        </div>
        <div className="px-5">
          <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
            <Icon icon="carbon:earth-europe-africa" />
            <div className="ml-2 text-sm font-semibold">English</div>
          </div>
        </div>
      </div>
      {/* This second div will be the right part(main content) */}
      <div className="h-full"></div>
    </div>
  );
};

export default Home;
