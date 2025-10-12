import { EventEmitter } from 'events';

export class NanoWS extends EventEmitter {
    private ws: WebSocket;
    private subscribed: string[] = [];
    private url: string;

    subscribe(address: string) {
        if (this.ws.readyState === WebSocket.OPEN) {
            if (this.subscribed.includes(address)) {
                console.log('Already subscribed to address:', address);
                return;
            }

            this.subscribed.push(address);
            this.ws.send(JSON.stringify({ 
                action: "subscribe", 
                topic: "confirmation",
                options: {
                    accounts: this.subscribed
                }
            }));
        } else {
            console.error('WebSocket is not open. Unable to subscribe to address:', address);
        }
    }

    constructor(url: string) {
        super();
        this.url = url;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('WebSocket connection opened');
            this.emit('open');

            // Ping the server every 5 seconds to keep the connection alive
            setInterval(() => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ action: "ping" }));
                }
            }, 5000);
        };

        this.ws.onmessage = (event) => {
            this.onMessageReceived(event.data);
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            // Attempt to reconnect after a delay
            setTimeout(() => {
                this.emit('reconnect');
            }, 1000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    send(message: string) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            console.error('WebSocket is not open. Unable to send message:', message);
        }
    }

    close() {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.emit('close');
            this.ws.close();
        } else {
            console.error('WebSocket is not open. Unable to close connection.');
        }
    }

    isOpen(): boolean {
        return this.ws.readyState === WebSocket.OPEN;
    }

    async onMessageReceived(message: string | Blob) {
        console.log('Message received:', message);
        console.log("typeof message", typeof message);
        this.emit('message', message);
        
        try {
            if (typeof message === 'object') {
                message = await message.text();
            }

            const parsedMessage = JSON.parse(message);
            if (parsedMessage.topic === 'confirmation') {
                this.emit('confirmation', parsedMessage);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }
}
