import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {fetchFeed} from '../../Actions'
import {Form, FormControl, Button, Alert} from 'react-bootstrap';
import './EnterLink.css'



class EnterLink extends Component {
    constructor(props) {
        super(props);
        this.state = {value: "", showDangerAlert: false};
    }
    onButtonClickHandler(e) {
        //request
        //console.log("value is " + this.state.value)
        e.preventDefault();
        let urlRE = /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/;
        if(urlRE.exec(this.state.value) !== null) {
            this.props.fetchFeed(this.state.value);
            this.setState( Object.assign({}, this.state, {showDangerAlert: false}) );
        }
        else 
            this.setState( Object.assign({}, this.state, {showDangerAlert: true}) );
        
    }

    onInputChangeHandler(e) {
        let newState = Object.assign({}, this.state, { value: e.target.value });
        this.setState(newState);
    }
    render() {
        let dangerAlert;
        if (this.state.showDangerAlert)
            dangerAlert = (<Alert bsStyle="danger">
                <strong>Wrong URL!</strong> It is not URL.<br />Example URL: 'http://example.com/rss'
            </Alert>
            );
        else if(this.props.error) {
            dangerAlert = (<Alert bsStyle="danger">
                <strong>Wrong URL!</strong> {this.props.error.message}
            </Alert>
            );
        }
        else  
            dangerAlert = <div></div>;
        return (
            <div className="enter-link">
                {/*<input type="text" placeholder="http:// ..."
             value={this.state.value} onChange={this.onInputChangeHandler.bind(this)}></input>
            <button onClick={this.onButtonClickHandler.bind(this)}>Add</button>*/}
                <Form inline onSubmit={this.onButtonClickHandler.bind(this)}>
                    <FormControl className="input-field" type="text" placeholder="http:// ..." 
                    value={this.state.value} onChange={this.onInputChangeHandler.bind(this)} />
                    {' '}
                    <Button type="submit">
                        Show feed
                </Button>
                </Form><br />
                {dangerAlert}
            </div>
        );
    }
}

EnterLink.propTypes = {
    fetchFeed: React.PropTypes.func.isRequired   
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchFeed}, dispatch);
}
function mapStateToProps(state) {
    return {
        error: state.feed.error
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EnterLink);