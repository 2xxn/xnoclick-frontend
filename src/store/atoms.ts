import { atom } from 'jotai';
import { UserData, ShortLink, Settings } from '../types';

export const userDataAtom = atom<UserData | null>(null);

export const linksAtom = atom<ShortLink[]>([]);

export const settingsAtom = atom<Settings>({
  autoClaim: false,
  autoClaimThreshold: 0.01,
});

export const isLoadingAtom = atom<boolean>(false);

export const errorAtom = atom<string | null>(null);
