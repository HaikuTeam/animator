import React from 'react'
import Palette from './../DefaultPalette'

export default ({color = Palette.SUNSTONE}) => (
  <svg width='28' height='28' viewBox='0 0 20 20'>
    <path d='M6.5 16c-0.083 0-0.167-0.021-0.242-0.063-0.159-0.088-0.258-0.256-0.258-0.437v-10c0-0.182 0.099-0.349 0.258-0.437s0.353-0.083 0.507 0.013l8 5c0.146 0.091 0.235 0.252 0.235 0.424s-0.089 0.333-0.235 0.424l-8 5c-0.081 0.051-0.173 0.076-0.265 0.076zM7 6.402v8.196l6.557-4.098-6.557-4.098z' fill={color} />
  </svg>
)
