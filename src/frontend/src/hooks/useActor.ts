import { createActor } from "@/backend";
import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";

export function useActor() {
  return useCoreActor(createActor);
}
