import { extractYoutubeId } from "@/lib/utils";
import {useQuery} from "@tanstack/react-query"
import axios from "axios"

const YOUTUBE_API_KEY = import.meta.env.VITE_GOOGLE_KEY


const fetchVideoInfo = async (videoUrl:string) => 
  {
    const videoId = extractYoutubeId(videoUrl)
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos`,
    {
      params: {
        part: "snippet",
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    }
  );

  if (!data.items.length) {
    throw new Error("Vidéo non trouvée");
  }

  return data.items[0].snippet; // Retourne seulement le snippet
};

const useFetchVideo = (videoUrl?:string | null) => {
  return useQuery({
    queryKey: ["video", videoUrl], // Cache les données sous cette clé
    queryFn: () => fetchVideoInfo(videoUrl!),
    enabled: !!videoUrl, // Ne lance pas la requête si videoId est vide
    staleTime: 1000 * 60 * 5, // Cache les résultats pendant 5 minutes
  });
};

export default useFetchVideo;