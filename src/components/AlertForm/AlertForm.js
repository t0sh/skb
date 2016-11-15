import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AlertForm.css';
import { autobind } from 'core-decorators';

class AlertForm extends Component {

  constructor() {
    super();
    this.state = {
      value: 'The default',
    };
    // this.onChange = this.onChange.bind(this)
  }

  @autobind
  onSubmit(event) {
    event.preventDefault();
    alert(`${this.props.title}: ${this.state.value}`);
  }

  @autobind
  onChange(e) {
    this.setState({
      value: e.target.value,
    })
  }

  render() {
    const answer = 'Yes'
    return (
      <form className={s.root} onSubmit={this.onSubmit}>
        {
          this.props.title && <div>
            <h1 className={s.title}>
              {this.props.title}
            </h1>
            <br />
            <br />
          </div>
        }
        {
          this.state.value && <h2 className={s.title}>
            {this.state.value}
          </h2>
        }
        <input onChange={this.onChange} value={this.state.value} />

        {/* <input onChange={this.onChange.bind(this)} />
        <input onChange={(e) => this.onChange(e)} /> */}

        &nbsp;
        <input type='submit'/>
      </form>
    );
  }
}

export default withStyles(s)(AlertForm);
