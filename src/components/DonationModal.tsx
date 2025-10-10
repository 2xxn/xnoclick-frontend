import { on } from "events";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function DonationModal({ address, onClose }: { address: string; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const qrValue = `nano:${address}`;

    function handleCopy() {
        try {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-8 bg-base-100 rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Donation
          </h2>
          <p className="text-base-content/70 mb-1">
            Any amount sent to this address will go towards funding the
            continued development and hosting of xno.click and is greatly
            appreciated.
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
                {address}
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
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}