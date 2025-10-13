"use client";

import { ShortLink } from "@/src/types";
import React, { useEffect, useRef, useState } from "react";
import Captcha from "react-google-recaptcha";

declare global {
    interface Window {
        __SHORTLINK_DATA__?: ShortLink
        __RECAPTCHA_PUBLIC__?: string
    }
}

export default function IntermediaryPage() {
    const [dots, setDots] = useState(".");

    const [captchaEnabled, setCaptchaEnabled] = useState(false);
    const captchaRef = useRef<Captcha>(null);

    function verifyImpression() {
        if (!window || typeof window == "undefined") {
            console.error("Window object is not available.");
            return;
        }

        const shortlinkData = window.__SHORTLINK_DATA__;
        if (!shortlinkData) {
            console.error("No shortlink data found on window object.");
            return;
        }
        
        const proceed = (captchaToken?: string) => {
            console.log("Proceeding with verification, captcha token:", captchaToken ? "present" : "none");
            const r = fetch(`/${shortlinkData.shortUrl}/verify`, {
                method: "POST",
                redirect: "error",
                headers: {
                    "Content-Type": "application/json",
                    "X-Captcha": captchaToken || "",
                },
            });

            r.catch(async (res) => {
                if (res.ok) {
                    window.location.href = shortlinkData.destination;
                } else {
                    console.error("Failed to verify impression:", res.statusText);
                    window.location.href = shortlinkData.destination; // Fallback to destination on error
                }
            });
        }

        // If captcha is required but not yet enabled, enable it and return
        if (window.__RECAPTCHA_PUBLIC__ && !captchaEnabled) {
            console.log("Captcha required, enabling captcha component");
            setCaptchaEnabled(true);
            return; // Exit here, captcha execution will happen in useEffect
        }

        // If captcha is enabled and ready, execute it
        if (captchaEnabled && captchaRef.current) {
            console.log("Executing captcha");
            captchaRef.current.executeAsync().then((token: string | null) => {
                console.log("Captcha token received:", token ? "present" : "null");
                proceed(token || undefined);
            }).catch((err: any) => {
                console.error("Captcha execution failed:", err);
                proceed();
            });
        } else if (!window.__RECAPTCHA_PUBLIC__) {
            // No captcha required, proceed directly
            console.log("No captcha required, proceeding directly");
            proceed();
        } else {
            console.log("Captcha enabled but ref not ready yet");
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : "."));
        }, 500);

        verifyImpression();

        setTimeout(() => {
            // Fallback to direct redirection after 8 seconds
            const shortlinkData = window.__SHORTLINK_DATA__;
            if (shortlinkData) {
                window.location.href = shortlinkData.destination;
            }
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // Execute captcha once it's enabled and component is rendered
    useEffect(() => {
        if (captchaEnabled && captchaRef.current) {
            console.log("Captcha component is now ready, executing verification");
            verifyImpression();
        }
    }, [captchaEnabled, captchaRef.current]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Main Card */}
                <div className="card bg-base-100 shadow-2xl border border-base-300">
                    <div className="card-body p-8">
                        {/* Header */}
                        <div className="text-center">
                            <div className="flex justify-center items-center gap-0 mb-4 animate-pulse">
                                <span className="text-4xl font-bold text-primary">xno.</span>
                                <span className="text-4xl font-bold">click</span>
                            </div>
                            <div className="flex justify-center text-center mb-4">
                                <h2 className="font-bold text-2xl text-gray-300">You are being redirected{dots}</h2>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-2 pt-3 border-t border-base-300">
                            <p className="text-xs text-base-content/50">
                                Powered by xno.click • Earn cryptocurrency creating short links.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {captchaEnabled && <Captcha
                ref={captchaRef}
                size="invisible"
                sitekey={window.__RECAPTCHA_PUBLIC__!} // Non-null assertion because server ensures it's defined
            />}
            <script>
                /* PLEASE NEXT.JS DON'T REMOVE THIS COMMENT FROM HERE */
            </script>
        </div>
    );
} 