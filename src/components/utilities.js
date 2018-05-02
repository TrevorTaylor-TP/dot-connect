import React from 'react'
import { Link } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'


const MiddleText = (props) => (
  <div>
    {props.element}
    <br/>
    <button className="button is-primary back">
        <Link to="/"> Go Back </Link>
    </button>
  </div>
)

class ShareLink extends React.Component {
  state = {
    value: '',
    copied: false,
  };
 
  render() {
    return (
      <div>
        <h3 className="title has-text-grey">Share Link</h3>
        <p className="subtitle has-text-grey">
          Share this link to play with a friend
        </p>
        <p className="control">
          <input className="input" defaultValue={this.props.value} />
        </p>
        <br/>
        <CopyToClipboard text={this.props.value}
          onCopy={() => this.setState({copied: true})}>
          <button className="button is-info">
            {this.state.copied ? 'Copied' : 'Copy to clipboard'}
          </button>
        </CopyToClipboard>
      </div>
    );
  }
}

export {
  MiddleText,
  ShareLink,
}

