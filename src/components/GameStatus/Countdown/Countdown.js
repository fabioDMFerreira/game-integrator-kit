import React,{Component} from 'react';
import {connect} from 'react-redux';

export class Countdown extends Component{
    render(){
        return <div className="cronometro">
            {this.props.countdownTime}
        </div>
    }
};

const mapStateToProps=(state)=>{
    const countdownTime = state.get('countdownTime');

    return {
        countdownTime
    }
};

export default connect(mapStateToProps)(Countdown);