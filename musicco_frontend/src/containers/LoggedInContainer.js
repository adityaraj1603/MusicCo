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
        <div className="h-full w-3/10 sm:w-1/5 bg-black flex flex-col justify-between pb-10 text-xs sm:text-base md:text-lg">
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
            <div className="border border-gray-100 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer text-xs sm:text-base md:text-lg">
              <Icon icon="carbon:earth-europe-africa" />
              <div className="ml-2 text-sm font-semibold">English</div>
            </div>
          </div>
        </div>
        {/* This second div will be the right part(main content) */}
        <div className="h-full w-4/5 bg-app-black overflow-auto xs:text-xs sm:text-xs md:text-sm lg:text-md">
          {/* paste here */}
          <div className="navbar w-full h-2/10 md:h-1/10 lg:1/10  bg-black flex items-center justify-end text-xs sm:text-base md:text-lg">
            {/* <section class="relative mx-auto"> */}
            <nav class=" bg-black bg-opacity-30  flex items-center justify-end text-white w-screen">
              <div class="px-5 xl:px-12 py-6 flex w-full items-center">
                {/* <a class="text-3xl font-bold font-heading" href="#">
                  <!-- <img class="h-9" src="logo.png" alt="logo"> -->
                </a> */}

                <ul class="sm:flex md:flex px-4  space-y-5  mx-auto font-semibold font-heading space-x-12">
                  <li></li>
                  <li>
                    <a class="hover:text-gray-200" href="#">
                      Home
                    </a>
                  </li>
                  <li>
                    <a class="hover:text-gray-200" href="#">
                      Catagory
                    </a>
                  </li>
                  <li>
                    <a class="hover:text-gray-200" href="#">
                      Collections
                    </a>
                  </li>
                  <li></li>
                  <li>
                    <a class="hover:text-gray-200" href="/uploadsong">
                      Upload Song
                    </a>
                  </li>
                </ul>

                <div class="xl:flex items-center space-x-5 space-y-10 sm:space-y-0 md:space-y-0 lg:space-y-0">
                  <a class="hover:text-gray-200" href="#">
                    <button
                      className="bg-red-400 font-semibold p-1/2 px-4 rounded-full "
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      LOG OUT
                    </button>
                  </a>

                  {/* <button
                  
                      <div
                        class=" hidden:false bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4"
                        id="dropdown"
                      >
                        <div class="px-4 py-3">
                          <span class="block text-sm">Bonnie Green</span>
                          <span class="block text-sm font-medium text-gray-900 truncate">
                            name@flowbite.com
                          </span>
                        </div>
                        <ul class="py-1" aria-labelledby="dropdown">
                          <li>
                            <a
                              href="#"
                              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                            >
                              Earnings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                            >
                              Sign out
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* <script src="https://unpkg.com/@themesberg/flowbite@latest/dist/flowbite.bundle.js"></script> */}

                  <a
                    class="flex items-center hover:text-gray-200"
                    href="/profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* <a class="xl:hidden flex mr-6 items-center" href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 hover:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span class="flex absolute -mt-5 ml-4">
                    <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                </a> */}
              {/* <a class="navbar-burger self-center mr-12 xl:hidden" href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 hover:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </a> */}
            </nav>
            {/* </section> */}
          </div>

          {/* <div class="absolute bottom-0 right-0 mb-4 mr-4 z-10">
            <div>
              <a
                title="Follow me on twitter"
                href="https://www.twitter.com/asad_codes"
                target="_blank"
                class="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
              >
                <img
                  class="object-cover object-center w-full h-full rounded-full"
                  src="https://www.imore.com/sites/imore.com/files/styles/large/public/field/image/2019/12/twitter-logo.jpg"
                />
              </a>
            </div>
          </div> */}

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
