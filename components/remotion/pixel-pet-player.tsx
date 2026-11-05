"use client";

import { Player } from "@remotion/player";
import { PixelPetScene } from "@/components/remotion/pixel-pet-scene";

export const PET_DURATION_IN_FRAMES = 150;
export const PET_FPS = 30;

export default function PixelPetPlayer() {
  return (
    <Player
      component={PixelPetScene}
      durationInFrames={PET_DURATION_IN_FRAMES}
      fps={PET_FPS}
      compositionWidth={600}
      compositionHeight={600}
      autoPlay
      loop={false}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      acknowledgeRemotionLicense
      initiallyMuted
      style={{ width: "100%", height: "100%" }}
    />
  );
}
