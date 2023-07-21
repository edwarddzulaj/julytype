declare module "fontsampler-js/dist/fontsampler" {
  // Add other type declarations for the library functions here if needed
  export default class Fontsampler {
    constructor(_root: HTMLElement | null, fonts?: any, options?: any);
    // Add other methods or properties if needed
    init();
  }
}

declare module "fontsampler-js/dist/fontsampler-skin" {
  // Add other type declarations for the library functions here if needed
  export default function (HTMLElement);
}

declare module "fontsampler-js/dist/fontsampler-skin.css" {
  // Add other type declarations for the library functions here if needed
}
