"use client"
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LoginResponse } from "../types";
import { NanoWS } from "../lib/nano";
import { checkLogin } from "../lib/api";

interface SignInModalProps {
  loginResponse: LoginResponse
  onCancel: () => void
}

const SignInModal: React.FC<SignInModalProps> = ({ loginResponse, onCancel }) => {
  const [copied, setCopied] = useState(false);
  const qrValue = `nano:${loginResponse.address}?amount=1000000000000000000000000`;
  const wsUrl = `wss://rainstorm.city/websocket`;

  useEffect(() => {
    const ws = new NanoWS(wsUrl);
    ws.on('open', () => {
      console.log('WebSocket connection opened');
      ws.subscribe(loginResponse.address);
    });

    ws.on('confirmation', () => {
      checkLogin(loginResponse.loginKey).then((response) => {
        if (response.success) {
          console.log("Login confirmed:", response);
          onCancel(); // Close the modal on successful login
          // redirect to dashboard or perform any other action
          location.href = '/dashboard'; // Example redirect
        } else {
          console.error("Login failed:", response);
        }
      });
    });

    return () => {
      ws.close();
    };
  }, [loginResponse.address, loginResponse.loginKey, onCancel, wsUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loginResponse.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-8 bg-base-100 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Verification Required
          </h2>
          <p className="text-base-content/70 mb-1">
            Send any small amount to verify ownership
          </p>
          <p className="text-sm text-base-content/50">
            (Funds will be returned immediately)
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="p-3 bg-white rounded-box border-2 border-primary/20">
              <QRCodeSVG
                value={qrValue}
                size={200}
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </div>
            
            {copied && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-box animate-fade-in">
                <div className="text-white text-2xl">✓</div>
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <div
              onClick={handleCopy}
              className="tooltip tooltip-bottom w-full cursor-copy"
              data-tip="Click to copy"
            >
              <div className="w-full p-3 font-mono text-sm bg-base-200 rounded-box border-2 border-primary/20 
                transition-colors duration-200 hover:border-primary/40 break-words text-center">
                {loginResponse.address}
              </div>
            </div>
            
            <div className="text-center">
              <span className={`text-xs transition-opacity duration-300 ${copied ? 'text-primary' : 'text-base-content/50'}`}>
                {copied ? 'Address copied to clipboard!' : 'Click address to copy'}
              </span>
            </div>
          </div>

          <div className="w-full flex items-center justify-center p-4">
            <button 
              className="btn btn-outline btn-error btn-sm w-1/2 mr-2"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>

          <div className="w-full pt-4 border-t border-base-300">
            <div className="text-xs text-base-content/50 text-center">
              Session ID: {loginResponse.uuid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
