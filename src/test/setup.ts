import "@testing-library/jest-dom";
import { MessageChannel } from "node:worker_threads";
import { TextDecoder, TextEncoder } from "node:util";

globalThis.MessageChannel = MessageChannel as typeof globalThis.MessageChannel;

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
});

class ResizeObserverMock {
  observe() {
    return undefined;
  }
  unobserve() {
    return undefined;
  }
  disconnect() {
    return undefined;
  }
}

globalThis.ResizeObserver = ResizeObserverMock;

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
