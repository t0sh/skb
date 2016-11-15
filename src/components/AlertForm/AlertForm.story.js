import React from 'react'
import AlertForm from './AlertForm'

module.exports = ({ storiesOf, action }) => {
  return storiesOf('AlertForm', module)
    .add('default', () => {
      return <AlertForm />
    })
    .add('title', () => {
      return <AlertForm title='Are you programmer?'  />
    })
}
