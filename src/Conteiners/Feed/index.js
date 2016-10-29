import React, {Component} from 'react';
import Item from '../../Components/Item';
import { ListGroup} from 'react-bootstrap';
import {connect} from 'react-redux';

class Feed extends Component {
    render() {
        let listOfItems = this.props.items.map( (val,index) => {
            let key = val.guid ? val.guid : index;
            return <Item key={key} title={val.title} link={val.link}
                description={val.contentSnippet} pubDate={val.pubDate}></Item>
        })
        return (
        <ListGroup>
            {listOfItems}
        </ListGroup>
        )
    }
}

Feed.propTypes = {
    channel: React.PropTypes.object.isRequired,
    items: React.PropTypes.array.isRequired,
    isFetching: React.PropTypes.bool
}

function mapStateToProps(state) {
    return {
        channel: state.feed.channel,
        items: state.feed.items
    }
}

export default connect(mapStateToProps)(Feed);