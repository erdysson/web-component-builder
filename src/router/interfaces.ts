export {};

declare global {
    interface Window {
        onpushState: (...args: any[]) => void;
    }
}
