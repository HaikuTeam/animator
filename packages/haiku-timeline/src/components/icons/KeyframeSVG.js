import React from 'react'
import Palette from './../DefaultPalette'

export default ({color = Palette.ROCK}) => (
  <svg width='7px' height='7px' viewBox='0 8 7 7'>
    <g id='keyframe' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' transform='translate(0.000000, 8.000000)'>
      <path d='M5.33109642,3 C6.5763463,3 6.87407592,3.78656356 5.99432635,4.7587925 L4.29725943,6.63425526 C3.85678921,7.12102776 3.14425069,7.12280126 2.70217567,6.63425526 L1.00510876,4.7587925 C0.126150653,3.78743822 0.423883689,3 1.66833868,3 L5.33109642,3' id='Rectangle-8' fill={color} />
      <path d='M5.33109642,0.5 C6.5763463,0.5 6.87407592,1.28656356 5.99432635,2.2587925 L4.29725943,4.13425526 C3.85678921,4.62102776 3.14425069,4.62280126 2.70217567,4.13425526 L1.00510876,2.2587925 C0.126150653,1.28743822 0.423883689,0.5 1.66833868,0.5 L5.33109642,0.5' id='Rectangle-8-Copy-4' fill={color} transform='translate(3.500000, 2.500000) scale(1, -1) translate(-3.500000, -2.500000) ' />
    </g>
  </svg>
)
