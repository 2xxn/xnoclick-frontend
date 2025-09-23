"use client";

import { v4 as uuidv4 } from 'uuid';

export function resetRememberMe(redirect: string | null = null) {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('rememberMe');
    }

    sessionStorage.setItem('rememberMe', uuidv4());
    if (redirect) {
      window.location.href = redirect;
    }
}

export function calculatePercentage(part: number, total: number) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
}