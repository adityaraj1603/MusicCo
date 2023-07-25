import { useContext } from "react";
import songContext from "../../contexts/songContext";

const SongCard = ({ info, playSound }) => {
  const { currentSong, setCurrentSong } = useContext(songContext);

  return (
    <div
      className="flex hover:bg-gray-400 hover:bg-opacity-20 p-2 rounded-sm xs:text-xs sm:text-xs md:text-sm lg:text-md"
      onClick={() => {
        setCurrentSong(info);
      }}
    >
      {
        <div
          className="w-100 h-100 bg-cover bg-center xs:text-xs sm:text-xs md:text-sm lg:text-md"
          style={{
            backgroundImage: `url("${info.thumbnail}")`,
          }}
        ></div>
      }
      {
        <div className="flex w-10 h-20 xs:text-xs sm:text-xs md:text-sm lg:text-md">
          <div className="text-white flex justify-center  flex-col pl-4 w-5/6">
            <div className="cursor-pointer hover:underline">{info.name}</div>
            <div className="text-xs text-gray-400 cursor-pointer hover:underline">
              {info.artist.firstName + " " + info.artist.lastName}
            </div>
          </div>
          <div className="w-1/6 flex items-center justify-center text-gray-400 text-sm">
            <div>3:44</div>
          </div>
        </div>
      }
    </div>
  );
};

export default SongCard;

// // const View = ({ titleText, cardsData }) => {
// //     return (
// //       <div className="text-white mt-8">
// //         <div className="text-2xl font-semibold mb-5">{titleText}</div>
// //         <div className="w-full flex justify-between space-x-4">
// //           {
// //             // cardsData will be an array
// //             cardsData.map((item) => {
// //               return (
// //                 <Card1
// //                   title={item.title}
// //                   description={item.description}
// //                   imgUrl={item.imgUrl}
// //                 />
// //               );
// //             })
// //           }
// //         </div>
// //       </div>
// //     );
// //   };

// const Card = ({ title, description, imgUrl, playlistId }) => {
//     const navigate = useNavigate();
//     return (
//       <div
//         className="bg-black bg-opacity-40 w-full p-4 rounded-lg cursor-pointer"
//         onClick={() => {
//             setCurrentSong(info);
//         }}
//       >
//         <div className="text-white mt-8">
//           {/* <div className="text-2xl font-semibold mb-5">{titleText}</div> */}
//           <div className="w-full flex justify-between space-x-4">
//             <img className="w-full rounded-md" src={imgUrl} alt="label" />
//           </div>
//           <div className="text-white font-semibold py-3">{title}</div>
//           <div className="text-gray-500 text-sm">{description}</div>
//         </div>
//       </div>
//     );
//   };
