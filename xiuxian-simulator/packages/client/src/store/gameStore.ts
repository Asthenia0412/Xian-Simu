import { create } from 'zustand';
import type { Character, SaveData } from '@xiuxian/shared';

interface GameState {
  character: Character | null;
  saveData: SaveData | null;
  isLoading: boolean;
  error: string | null;

  setCharacter: (character: Character) => void;
  setSaveData: (data: SaveData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  character: null,
  saveData: null,
  isLoading: false,
  error: null,

  setCharacter: (character) => set({ character }),
  setSaveData: (data) => set({ saveData: data, character: data.character }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
