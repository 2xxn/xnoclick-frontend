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
        
        if (window.__RECAPTCHA_PUBLIC__ && !captchaEnabled) {
            setCaptchaEnabled(true);
            console.log("Captcha enabled");
            return;
        }

        const proceed = (captchaToken?: string) => {
            const r = fetch(`/${shortlinkData.shortUrl}/verify`, {
                method: "POST",
                redirect: "manual",
                headers: {
                    "Content-Type": "application/json",
                    "X-Captcha": captchaToken || "",
                },
                body: JSON.stringify({
                    shortlink: shortlinkData,
                    captcha: captchaToken,
                }),
            });

            r.then(async (res) => {
                if (res.ok) {
                    if(res.headers.get("Location")) {
                        window.location.href = res.headers.get("Location") || "/";
                    } else {
                        console.error("No redirection URL provided in response.");
                        window.location.href = shortlinkData.destination;
                    }
                } else {
                    console.error("Failed to verify impression:", res.statusText);
                }
            });
        }

        if (captchaRef.current) {
            captchaRef.current.executeAsync().then((token: string | null) => {
                console.log("Captcha token after proceed:", token);
                proceed(token || undefined);
            }).catch((err: any) => {
                console.error("Captcha execution failed:", err);
                proceed();
            });
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : "."));
        }, 500);

        verifyImpression();

        // setTimeout(() => {
        //     // Fallback to direct redirection after 8 seconds
        //     const shortlinkData = window.__SHORTLINK_DATA__;
        //     if (shortlinkData) {
        //         window.location.href = shortlinkData.destination;
        //     }
        // }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Main Card */}
                <div className="card bg-base-100 shadow-2xl border border-base-300">
                    <div className="card-body p-8">
                        {/* Header */}
                        <div className="text-center">
                            <div className="flex justify-center items-center gap-0 mb-4 animate-pulse">
                                <span className="text-4xl font-bold text-primary">XNO</span>
                                <span className="text-4xl font-bold">Click</span>
                            </div>
                            <div className="flex justify-center text-center mb-4">
                                <h2 className="font-bold text-2xl text-gray-300">You are being redirected{dots}</h2>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-2 pt-3 border-t border-base-300">
                            <p className="text-xs text-base-content/50">
                                Powered by XNOClick • Earn cryptocurrency creating short links.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {captchaEnabled && <Captcha
                ref={captchaRef}
                size="invisible"
                sitekey={window.__RECAPTCHA_PUBLIC__!} // Non-null assertion because captchaEnabled ensures it's defined
            />}
            <script>
                /* PLEASE NEXT.JS DON'T REMOVE THIS COMMENT FROM HERE */
            </script>
        </div>
    );
} 