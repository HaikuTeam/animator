import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Palette from '../../src/Palette';

storiesOf('Colors', module)
  .add('all colors', () => {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          Object.keys(Palette).map((color) => {
            return (
              <div style={{width: '150px', margin: '15px', overflow: 'hidden'}}>
                <div style={{backgroundColor: Palette[color], width: '150px', height: '150px'}}></div>
                <h4>{color}</h4>
                <p>{Palette[color]}</p>
              </div>
            )
          })
        }
      </div>
    )
  })

