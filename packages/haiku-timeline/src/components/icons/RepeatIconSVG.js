import * as React from 'react'
import Palette from '../DefaultPalette'

export default ({color = Palette.SUNSTONE}) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'>
    <path fill={color} d='M17.354 3.146l-3-3a.5.5 0 0 0-.707.707l2.146 2.146H2.5c-.827 0-1.5.673-1.5 1.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 1 .5-.5h13.293l-2.146 2.146a.5.5 0 0 0 .708.707l3-3a.5.5 0 0 0 0-.707zM17.5 6a.5.5 0 0 0-.5.5v9a.5.5 0 0 1-.5.5H3.207l2.146-2.146a.5.5 0 0 0-.707-.707l-3 3a.5.5 0 0 0 0 .707l3 3a.498.498 0 0 0 .708 0 .5.5 0 0 0 0-.707l-2.146-2.146h13.293c.827 0 1.5-.673 1.5-1.5v-9a.5.5 0 0 0-.5-.5z' />
  </svg>
)
