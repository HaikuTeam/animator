import * as React from 'react';
import { storiesOf } from '@storybook/react';
import * as icons from '../../src/react/OtherIcons';

const BLACKLISTED_ICONS = [
  'ButtonIconSVG',
  'MenuIconSVG',
  'LibIconSVG',
  'PrimitivesSVG'
]

storiesOf('Icons', module)
  .add('all icons', () => {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          Object.keys(icons).map((icon) => {
            if (BLACKLISTED_ICONS.includes(icon)) {return null}

            const Icon = icons[icon]
            return (
              <div style={{width: '150px', margin: '45px', overflow: 'hidden'}}>
                <Icon />
                <h4>{icon}</h4>
              </div>
            )
          })
        }
      </div>
    )
  })

