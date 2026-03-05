/**
 * Injects CSS for satellite resizer handles:
 * - Large 32x32 invisible hitboxes for easy grabbing.
 * - Visual 14x14 corner brackets (escuadras) centered inside.
 * - Invisible edge handles for side resizing.
 */
const NodeResizerStyles = () => (
  <style>{`
    /* 1. HITBOX: Large invisible box for easier grabbing */
    .custom-resizer-handle {
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      z-index: 50 !important;
    }

    .custom-resizer-handle.top.left,
    .custom-resizer-handle.top.right,
    .custom-resizer-handle.bottom.left,
    .custom-resizer-handle.bottom.right {
      width: 32px !important;
      height: 32px !important;
    }

    /* 2. VISUAL SATELLITES: Rendered in the center of the hitbox */
    .custom-resizer-handle::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 14px;
      height: 14px;
      margin-top: -7px;
      margin-left: -7px;
      background: transparent;
      border: 0 solid rgb(6 182 212);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                  background-color 0.2s ease,
                  border-color 0.2s ease;
      pointer-events: none;
    }

    /* Top Left Corner */
    .custom-resizer-handle.top.left::after {
      border-top-width: 2px;
      border-left-width: 2px;
      clip-path: polygon(0 0, 100% 0, 0 100%);
      transform: translate(-4px, -4px);
    }
    .custom-resizer-handle.top.left:hover::after {
      background-color: rgba(6, 182, 212, 0.9);
      border-color: rgb(34, 211, 238);
      transform: translate(-6px, -6px) scale(1.15);
    }

    /* Top Right Corner */
    .custom-resizer-handle.top.right::after {
      border-top-width: 2px;
      border-right-width: 2px;
      clip-path: polygon(0 0, 100% 0, 100% 100%);
      transform: translate(4px, -4px);
    }
    .custom-resizer-handle.top.right:hover::after {
      background-color: rgba(6, 182, 212, 0.9);
      border-color: rgb(34, 211, 238);
      transform: translate(6px, -6px) scale(1.15);
    }

    /* Bottom Left Corner */
    .custom-resizer-handle.bottom.left::after {
      border-bottom-width: 2px;
      border-left-width: 2px;
      clip-path: polygon(0 0, 0 100%, 100% 100%);
      transform: translate(-4px, 4px);
    }
    .custom-resizer-handle.bottom.left:hover::after {
      background-color: rgba(6, 182, 212, 0.9);
      border-color: rgb(34, 211, 238);
      transform: translate(-6px, 6px) scale(1.15);
    }

    /* Bottom Right Corner */
    .custom-resizer-handle.bottom.right::after {
      border-bottom-width: 2px;
      border-right-width: 2px;
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
      transform: translate(4px, 4px);
    }
    .custom-resizer-handle.bottom.right:hover::after {
      background-color: rgba(6, 182, 212, 0.9);
      border-color: rgb(34, 211, 238);
      transform: translate(6px, 6px) scale(1.15);
    }

    /* 3. INVISIBLE EDGE HANDLES */
    .custom-resizer-handle.top:not(.left):not(.right),
    .custom-resizer-handle.bottom:not(.left):not(.right),
    .custom-resizer-handle.left:not(.top):not(.bottom),
    .custom-resizer-handle.right:not(.top):not(.bottom) {
      opacity: 0 !important;
      pointer-events: auto !important;
    }
    .custom-resizer-handle.top:not(.left):not(.right)::after,
    .custom-resizer-handle.bottom:not(.left):not(.right)::after,
    .custom-resizer-handle.left:not(.top):not(.bottom)::after,
    .custom-resizer-handle.right:not(.top):not(.bottom)::after {
      display: none;
    }

    /* 4. DYNAMIC RESIZER EXPANSION FOR FRAMES */
    /* Shifts the left-side resizer handles to envelop the expanded properties drawer */
    .custom-resizer-handle.is-expanded.top.left,
    .custom-resizer-handle.is-expanded.bottom.left,
    .custom-resizer-handle.is-expanded.left {
      margin-left: -220px !important;
      transition: margin-left 0.3s ease-in-out;
    }
  `}</style>
);

export default NodeResizerStyles;

