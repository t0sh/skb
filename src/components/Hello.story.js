import React from 'react'

module.exports = ({ storiesOf, action }) => {
  return storiesOf('Hello', module)
    .add('world', () => {
      return <div>
        Hello world
      </div>
    })
    .add('onClick', () => {
      return <div onClick={action('onClick')}>
        Hello onClick world
      </div>
    })
}
