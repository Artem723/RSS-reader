import React, {Component} from 'react'
import { ListGroupItem} from 'react-bootstrap'
import './Item.css'


export default class Item extends Component {
    getStringDay(numOfDay) {
        switch(numOfDay) {
            case 0: return 'Sun';
            case 1: return 'Mon';
            case 2: return 'Tue';
            case 3: return 'Wed';
            case 4: return 'Thu';
            case 5: return 'Fri';
            case 6: return 'Sat';

            default: throw Error("Unknown number of the day: " + numOfDay);
            
        }
    }
    getStringMonth(numOfMonth) {
        switch (numOfMonth) {
            case 0: return 'Jan';
            case 1: return 'Feb';
            case 2: return 'Mar';
            case 3: return 'Apr';
            case 4: return 'May';
            case 5: return 'Jun';
            case 6: return 'Jul';
            case 7: return 'Aug';
            case 8: return 'Sept';
            case 9: return 'Oct';
            case 10: return 'Nov';
            case 11: return 'Dec';

            default: throw Error("Unknown number of the Month: " + numOfMonth);

        }
    }
    render() {
        let dateElement;
        if(this.props.pubDate) {
            let date = new Date(this.props.pubDate);
            let dayOfWeek = this.getStringDay(date.getDay());
            let month = this.getStringMonth(date.getMonth());
            //let day = date.getDate;
            //let year = date.getFullYear;
            dateElement = (<div className="date-item">{dayOfWeek}, {date.getDate()} {month} {date.getFullYear()} {date.getHours()}:{date.getMinutes()}</div>);            
        }
        else 
            dateElement = <div></div>;            
        return (
            <ListGroupItem className="text-left">
                <a href={this.props.link} className="link-item">{this.props.title}</a>
                {dateElement}
                <div className="item-description">
                {this.props.description}
                </div>
            </ListGroupItem>
        )
    }
}

Item.propTypes = {
    title: React.PropTypes.string.isRequired,
    link: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    
    pubDate: React.PropTypes.string
}