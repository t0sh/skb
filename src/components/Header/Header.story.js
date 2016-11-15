import React from 'react'
import Header from './Header'

module.exports = ({ storiesOf, action }) => {
  return storiesOf('Header', module)
    .add('default', () => {
      return <Header />
    })
    .add('React', () => {
      return <Header title='React'  />
    })
}
