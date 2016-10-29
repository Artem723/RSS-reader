import {REQUEST_FEED, RESPONSE_FEED, REQUEST_FAIL} from './Constants'
export function requestFeed() {
    return {type: REQUEST_FEED};
}

export function responseFeed(Feed) {
    return {
        type: RESPONSE_FEED,
        title: Feed.title,
        description: Feed.description,
        link: Feed.link,
        items: Feed.entries
    };
}

export function requestFail(errObj) {
    if(Object.keys(errObj).length === 0 && errObj.constructor === Object) {
        errObj.message = "Requested resource is not a RSS document. Please, check URL.";
    }
    else {
         errObj.message = "Requested resource is not exist. Please, check URL.";
    }
    return {type: REQUEST_FAIL, errObj};
}

export function fetchFeed(feedURL) {
    return function(dispatch) {
        dispatch(requestFeed());
        let r = new XMLHttpRequest();
        let body = { feedURL };
        r.open('POST', 'http://localhost:8000/getRSS');
        r.setRequestHeader('Content-Type', 'application/json')
        r.send(JSON.stringify(body));
        r.onload = function() {
            
            if(this.status === 200 && this.getResponseHeader('Content-Type').indexOf('application/json') !==- 1 )
                dispatch(responseFeed( JSON.parse(this.responseText) ));
            else
                dispatch(requestFail( JSON.parse(this.responseText) ));
        };

    }
}