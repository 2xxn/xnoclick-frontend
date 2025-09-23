"use client"
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { getLinks, me, settings } from '@/lib/api';
import { ChangeSettingsRequest, ShortLink } from '@/types';

// Atom to store user data, statistics
export const userDataAtom = atom<unknown | null>(null);

// Atom to store user links
export const linksAtom = atom<ShortLink[] | null>(null);

// Atom to store settings
export const settingsAtom = atom<ChangeSettingsRequest | null>(null); // default if can't fetch

// Provider component to initialize data
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    // const [address, setAddress] = useAtom(addressAtom);
    const [, setUserData] = useAtom(userDataAtom);
    const [, setLinks] = useAtom(linksAtom);
    const [, setSettings] = useAtom(settingsAtom);

    useEffect(() => {
        if (typeof document !== 'undefined' && document.cookie) {
            Promise.allSettled([
                me(),
                getLinks(),
                settings()
            ]).then(([meData, linksData, settingsData]) => {
                // Handle user data
                if (meData.status === 'fulfilled') {
                    setUserData(meData.value);
                } // No Toast since that probably means the user is first time user

                // Handle links data
                if (linksData.status === 'fulfilled') {
                    setLinks(linksData.value.data as ShortLink[]);
                }

                // Handle settings data
                if (settingsData.status === 'fulfilled') {
                    setSettings(settingsData.value.data as ChangeSettingsRequest);
                }
            });
            // setCurrency(getCurrencyFromAddress(address));
        }
    }, [/*address, setAddress,*/ setLinks, setUserData, setSettings]);

  return <>{children}</>;
};
