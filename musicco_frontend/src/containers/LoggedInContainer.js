import { useContext, useState, useLayoutEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import { Icon } from "@iconify/react";
import spotify_logo from "../assets/images/spotify_logo_white.svg";
import IconText from "../components/shared/IconText";
import TextWithHover from "../components/shared/TextWithHover";
import songContext from "../contexts/songContext";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
// import AddToLikedModal from "../modals/AddToLikedModal";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelpers";

import { useNavigate } from "react-router-dom";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { useCookies } from "react-cookie";

const LoggedInContainer = ({ children, curActiveScreen }) => {
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  // const [likedSongModal, setlikedSongModal] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const {
    currentSong,
    setCurrentSong,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
  } = useContext(songContext);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    // the following if statement will prevent the useEffect from running on the first render.
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!currentSong) {
      return;
    }
    // console.log(currentSong);
    changeSong(currentSong.track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong && currentSong.track]);

  const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong._id;

    const payload = { playlistId, songId };
    const response = await makeAuthenticatedPOSTRequest(
      "/playlist/add/song",
      payload
    );

    if (response._id) {
      setAddToPlaylistModalOpen(false);
    }
  };

  const addSongToLiked = async () => {
    const songId = currentSong._id;
    const payload = { songId };

    const response = await makeAuthenticatedPOSTRequest(
      "/song/add/liked",
      payload
    );

    console.log(response);
    if (response === 1) {
      alert("Song already liked");
    } else if (response._id) {
      alert("added to liked");
    }
  };

  const playSound = () => {
    if (!soundPlayed) {
      return;
    }
    soundPlayed.play();
  };

  const changeSong = (songSrc) => {
    if (soundPlayed) {
      soundPlayed.stop();
    }
    let sound = new Howl({
      src: [songSrc],
      html5: true,
    });
    setSoundPlayed(sound);
    sound.play();
    setIsPaused(false);
  };

  const pauseSound = () => {
    soundPlayed.pause();
  };

  const togglePlayPause = () => {
    if (isPaused) {
      playSound();
      setIsPaused(false);
    } else {
      pauseSound();
      setIsPaused(true);
    }
  };

  // const searchSong = async () => {
  //   // This function will call the search api
  //   const response = await makeAuthenticatedGETRequest(
  //     "/song/get/songname/" + searchText
  //   );
  //   setSongData(response.data);
  // };

  const logout = async () => {
    // console.log("123");
    // const response = await makeAuthenticatedGETRequest("/auth/logout");
    // console.log(response);
    // console.log(cookies);
    removeCookie("token");
    navigate("/login");
    // } else {
    //   alert("Failure");
    // }
  };

  ////////logout

  return (
    <div className="h-full w-full bg-app-black">
      {createPlaylistModalOpen && (
        <CreatePlaylistModal
          closeModal={() => {
            setCreatePlaylistModalOpen(false);
          }}
        />
      )}
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal
          closeModal={() => {
            setAddToPlaylistModalOpen(false);
          }}
          addSongToPlaylist={addSongToPlaylist}
        />
      )}
      {/* {likedSongModal && (
        <AddToLikedModal
          closeModal={() => {
            setlikedSongModal(false);
          }}
          addSongToLiked={addSongToLiked}
        />
      )} */}
      <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
        {/* This first div will be the left panel */}
        <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10 xs:text-xs sm:text-xs md:text-sm lg:text-lg">
          <div>
            {/* This div is for logo */}
            <div className="logoDiv p-6 text-white-700 ">
              <IconText
                iconName={"simple-line-icons:social-spotify"}
                displayText={"MusicCo"}
                active
                // fontsize={}
              />
            </div>
            <div className="py-5">
              <IconText
                iconName={"material-symbols:home"}
                displayText={"Home"}
                targetLink={"/home"}
                active={curActiveScreen === "home"}
              />
              <IconText
                iconName={"material-symbols:search-rounded"}
                displayText={"Search"}
                active={curActiveScreen === "search"}
                targetLink={"/search"}
              />
              <IconText
                iconName={"icomoon-free:books"}
                displayText={"Library"}
                active={curActiveScreen === "library"}
                targetLink={"/library"}
              />
              <IconText
                iconName={"material-symbols:library-music-sharp"}
                displayText={"My Music"}
                targetLink="/myMusic"
                active={curActiveScreen === "myMusic"}
              />
            </div>
            <div className="pt-5">
              <IconText
                iconName={"material-symbols:add-box"}
                displayText={"Create Playlist"}
                onClick={() => {
                  setCreatePlaylistModalOpen(true);
                }}
              />
              <IconText
                iconName={"mdi:cards-heart"}
                displayText={"Liked Songs"}
                active={curActiveScreen === "liked"}
                targetLink={"/liked"}
              />
            </div>
          </div>
          <div className="px-5">
            lg
            <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer sm:text-sm md:text-md lg:text-lg">
              <Icon icon="carbon:earth-europe-africa" />
              <div className="ml-2 text-sm font-semibold">English</div>
            </div>
          </div>
        </div>
        {/* This second div will be the right part(main content) */}
        <div className="h-full w-4/5 bg-app-black overflow-auto xs:text-xs sm:text-xs md:text-sm lg:text-md">
          <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
            <div className="w-3/5 flex h-full">
              <div className="w-1/2 flex justify-around items-center ">
                <TextWithHover displayText={" Premium "} />
                <TextWithHover displayText={" Support "} />
                <TextWithHover displayText={" Download "} />
                <div className="h-1/2 border-r border-white"></div>
              </div>
              <div className="w-1/2 flex justify-around h-full items-center">
                <IconText
                  // iconName={"material-symbols:home"}
                  displayText={"Upload Song"}
                  targetLink={"/uploadSong"}
                  // active={curActiveScreen === "home"}
                />

                {/* <div className=" w-full flex items-center justify-end my-8"></div> */}
                <div className="bg-white w-10 h-7 flex items-center justify-center  font-semibold cursor-pointer xs:text:5 sm:text-xs md:text-sm lg:text-md">
                  <button
                    className="bg-red-400 font-semibold p-1/2 px-4 rounded-full xs:text-xs sm:text-xs md:text-sm lg:text-md"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    LOG OUT
                  </button>
                </div>
                <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer">
                  AC
                </div>
              </div>
            </div>
          </div>
          <div className="content p-8 pt-0 overflow-auto">{children}</div>
        </div>
      </div>
      {/* This div is the current playing song */}
      {currentSong && (
        <div className="w-full h-1/10 bg-black bg-opacity-30 text-white flex items-center px-4">
          <div className="w-1/4 flex items-center">
            <img
              src={currentSong.thumbnail}
              alt="currentSongThumbail"
              className="h-14 w-14 rounded"
            />
            <div className="pl-4">
              <div className="text-sm hover:underline cursor-pointer">
                {currentSong.name}
              </div>
              <div className="text-xs text-gray-500 hover:underline cursor-pointer">
                {currentSong.artist.firstName +
                  " " +
                  currentSong.artist.lastName}
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-center h-full flex-col items-center">
            <div className="flex w-1/3 justify-between items-center">
              {/* controls for the playing song go here */}
              <Icon
                icon="ph:shuffle-fill"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
              <Icon
                icon="mdi:skip-previous-outline"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
                // onClick={togglePlayPause}
              />
              <Icon
                icon={
                  isPaused
                    ? "ic:baseline-play-circle"
                    : "ic:baseline-pause-circle"
                }
                fontSize={50}
                className="cursor-pointer text-gray-500 hover:text-white"
                onClick={togglePlayPause}
              />
              <Icon
                icon="mdi:skip-next-outline"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
                // onClick={togglePlayPause}
              />
              <Icon
                icon="ic:twotone-repeat"
                fontSize={30}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
            </div>
            {/* <div>Progress Bar Here</div> */}
          </div>
          <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
            <Icon
              icon="ic:round-playlist-add"
              fontSize={30}
              className="cursor-pointer text-gray-500 hover:text-white"
              onClick={() => {
                setAddToPlaylistModalOpen(true);
              }}
            />
            <Icon
              icon="ph:heart-bold"
              fontSize={25}
              className="cursor-pointer text-gray-500 hover:text-white"
              onClick={() => {
                // setlikedSongModal(true);
                addSongToLiked();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInContainer;
