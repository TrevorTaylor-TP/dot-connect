import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';


const GameInfo = (props) =>  (
  <div className="game-footer">
        <span className="tag is-medium is-centered is-link">{props.gameStatus}</span>
        <div className="score tags has-addons">
          <span className="tag is-medium" style={{color: props.connected.x ? 'green' : 'grey'}}>•</span>
          <span className="tag is-info is-medium"> {props.x} </span>
          <span className="tag is-link is-medium"> {props.xScore} </span>
          <span className="tag is-link is-medium"> {props.oScore} </span>
          <span className="tag is-info is-medium"> {props.o} </span>
          <span className="tag is-medium" style={{color: props.connected.o ? 'green' : 'grey'}}> • </span>
        </div>
      <p className="button is-primary">
        <Link to="/"> Go Back </Link>
      </p>
  </div> 
)

const mapStateToProps = state => ({
  gameStatus: state.gameStatus,
  x: state.players.x,
  o: state.players.o,
  xScore: state.score.x,
  oScore: state.score.o,
  connected: state.connected,
})

export default connect(mapStateToProps)(GameInfo)
