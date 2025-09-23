"use client";

import { ChangeSettingsRequest, CreateLinkRequest, LoginResponse } from "../types";

const API_URL = () => typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

function invoke(endpoint: string, method = 'GET', body: object | null = null): Promise<unknown> {
  const url = `${API_URL()}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && sessionStorage.getItem('rememberMe') !== null && { 'X-Remember-Me': sessionStorage.getItem('rememberMe') as string }),
    },
    redirect: "manual",
    credentials: 'include', // Include cookies in the request
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options)
    .then(response => {
      // Set cookies
      const cookies = response.headers.get('set-cookie');
      if (cookies && typeof document !== 'undefined') {
        const cookieArray = cookies.split(';');
        cookieArray.forEach(cookie => {
          const [name, value] = cookie.split('=');
          document.cookie = `${name}=${value}; path=/;`;
        });
      }

      if (!response.ok) {

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.status == 204 ? {status: 204} : response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export function getLinks() {
  return invoke('links') as Promise<{ data: unknown[] }>;
}

export function getStats() {
  return invoke('stats') as Promise<{ data: unknown }>;
}

export function login(): Promise<LoginResponse> {
  return invoke('login', 'POST') as Promise<LoginResponse>;
}

export function checkLogin(loginKey: string) {
  return invoke('check', 'POST', { loginKey }) as Promise<{ success: boolean }>;
}

export function logout() {
  return invoke('logout', 'GET') as Promise<unknown>;
}

export function me() {
  return invoke('me', 'GET') as Promise<unknown>;
}

export function createLink(createLinkRequest: CreateLinkRequest) {
  return invoke('create', 'POST', createLinkRequest) as Promise<unknown>;
}

export function removeLink(linkId: string) {
  return invoke(`${linkId}`, 'DELETE') as Promise<unknown>;
}

export function saveSettings(settings: ChangeSettingsRequest) {
  return invoke('settings', 'PUT', settings) as Promise<unknown>;
}

export function settings() {
  return invoke('settings', 'GET') as Promise<{ data: unknown }>;
}
