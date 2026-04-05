"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface QuizAudioPlayerProps {
  youtubeId: string;
  start: number;
  end: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string;
          width: string;
          videoId: string;
          playerVars: Record<string, number>;
          events: Record<string, (event: { target: YouTubePlayer }) => void>;
        }
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

export default function QuizAudioPlayer({
  youtubeId,
  start,
  end,
}: QuizAudioPlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerIdRef = useRef(
    `yt-player-${youtubeId}-${Date.now()}`
  );

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function") {
      playerRef.current.pauseVideo();
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const playerId = playerIdRef.current;

    const initPlayer = () => {
      if (!document.getElementById(playerId)) return;
      playerRef.current = new window.YT.Player(playerId, {
        height: "1",
        width: "1",
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          start: start,
        },
        events: {
          onReady: () => setIsReady(true),
        },
      });
    };

    if (window.YT) {
      initPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode?.insertBefore(tag, firstScript);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopPlayback();
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [youtubeId, start, stopPlayback]);

  const handlePlay = () => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      stopPlayback();
      return;
    }

    playerRef.current.seekTo(start, true);
    playerRef.current.playVideo();
    setIsPlaying(true);

    const duration = (end - start) * 1000;
    timerRef.current = setTimeout(() => {
      stopPlayback();
    }, duration);
  };

  return (
    <div className="flex flex-col items-center gap-3 my-4">
      <button
        onClick={handlePlay}
        disabled={!isReady}
        className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
      >
        {!isReady ? (
          "로딩 중..."
        ) : isPlaying ? (
          <>⏹ 멈추기</>
        ) : (
          <>▶ 노래 듣기</>
        )}
      </button>
      <p className="text-sm text-gray-500">버튼을 눌러 노래를 들어보세요</p>
      <div
        id={playerIdRef.current}
        className="absolute -left-[9999px] w-[1px] h-[1px] overflow-hidden"
      />
    </div>
  );
}
