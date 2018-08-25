import * as React from 'react';

export default () => {
  return (
    <style>
      {`
        /**
        * Tooltip Styles
        */

        /* Base styles for the element that has a tooltip */
        [aria-label] {
          position: relative;
          cursor: pointer;
        }

        /* Base styles for the entire tooltip */
        [aria-label]:before,
        [aria-label]:after {
          position: absolute;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.2s ease-in-out,
            visibility 0.2s ease-in-out,
            transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24);
          transition-delay: 0;
          transform: translate3d(0, 0, 0);
          pointer-events: none;
          text-transform: none!important;
          font-family: 'Fira Sans';
          line-height: 15px;
          letter-spacing: initial;
        }

        [aria-label]:hover {
          z-index: 999999999999!important;
        }

        /* Show the entire tooltip on hover and focus */
        [aria-label]:hover:before,
        [aria-label]:hover:after,
        [aria-label]:focus:before,
        [aria-label]:focus:after {
          visibility: visible;
          opacity: 1;
          transition-delay: 600ms;
        }

        /* Base styles for the tooltip's directional arrow */
        [aria-label]:before {
          z-index: 1001;
          border: 6px solid transparent;
          background: transparent;
          content: "";
        }

        /* Base styles for the tooltip's content area */
        [aria-label]:after {
          z-index: 1000;
          padding: 3px 10px;
          background-color: #0C0C0C;
          color: #fff;
          content: attr(aria-label);
          font-size: 11px;
          white-space: nowrap;
          border-radius: 4px;
        }

        /* Directions */

        /* Top (default) */
        [aria-label]:before,
        [aria-label]:after {
          bottom: 100%;
          left: 50%;
        }

        [aria-label]:before {
          margin-left: -6px;
          margin-bottom: -12px;
          border-top-color: #0C0C0C;
        }

        [aria-label]:hover:before,
        [aria-label]:hover:after,
        [aria-label]:focus:before,
        [aria-label]:focus:after {
          transform: translateY(-12px) translateX(0);
        }

        /* Left */
        [data-tooltip-left]:before,
        [data-tooltip-left]:after {
          right: 100%;
          bottom: 50%;
          left: auto;
        }

        [data-tooltip-left]:before {
          margin-left: 0;
          margin-right: -12px;
          margin-bottom: 0;
          border-top-color: transparent;
          border-left-color: #0C0C0C;
        }

        [data-tooltip-left]:hover:before,
        [data-tooltip-left]:hover:after,
        [data-tooltip-left]:focus:before,
        [data-tooltip-left]:focus:after {
          transform: translateX(-12px);
        }

        /* Bottom */
        [data-tooltip-bottom]:before,
        [data-tooltip-bottom]:after {
          top: 100%;
          bottom: auto;
          left: 50%;
        }

        [data-tooltip-bottom]:after {
          transform: translateY(0) translateX(-50%);
        }

        [data-tooltip-bottom]:before {
          margin-top: -12px;
          margin-bottom: 0;
          border-top-color: transparent;
          border-bottom-color: #0C0C0C;
        }


        [data-tooltip-bottom]:hover:before,
        [data-tooltip-bottom]:focus:before {
          transform: translateY(12px);
        }

        [data-tooltip-bottom]:hover:after,
        [data-tooltip-bottom]:focus:after {
          transform: translateY(12px) translateX(-50%);
        }

        /* Bottom-Right */
        [data-tooltip-bottom-right]:before,
        [data-tooltip-bottom-right]:after {
          top: 100%;
          bottom: auto;
          left: 0;
        }

        [data-tooltip-bottom-right]:before {
          margin-top: -10px;
          margin-bottom: 0;
          border-top-color: transparent;
          border-bottom-color: #0C0C0C;
        }

        [data-tooltip-bottom-right]:hover:after,
        [data-tooltip-bottom-right]:focus:after {
          transform: translateY(12px);
        }

        [data-tooltip-bottom-right]:hover:before,
        [data-tooltip-bottom-right]:focus:before {
          transform: translateY(12px) translateX(50%);
        }

        [data-tooltip-bottom-right]:after {
          margin-left: 0;
        }

        [data-tooltip-bottom-right]:before {
          margin-left: 0;
        }

        /* Right */
        [data-tooltip-right]:before,
        [data-tooltip-right]:after {
          bottom: 50%;
          left: 100%;
        }

        [data-tooltip-right]:before {
          margin-bottom: 0;
          margin-left: -12px;
          border-top-color: transparent;
          border-right-color: #0C0C0C;;
        }

        [data-tooltip-right]:hover:before,
        [data-tooltip-right]:hover:after,
        [data-tooltip-right]:focus:before,
        [data-tooltip-right]:focus:after {
          transform: translateX(12px) translateY(50%);
        }

        /* Vertically center tooltip content for left/right tooltips */
        [data-tooltip-left]:after,
        [data-tooltip-right]:after {
          margin-left: 0;
        }
      `}
    </style>
  );
};
