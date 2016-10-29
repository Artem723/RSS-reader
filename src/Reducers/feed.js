import {REQUEST_FEED, REQUEST_FAIL, RESPONSE_FEED} from '../Actions/Constants'
let initialState = {
    channel: {},
    items: [],
    isFetching: false,
    isSaved: false,
    error: null
};

export default function feed(state = initialState, action) {
    switch(action.type) {
        
        case REQUEST_FEED:
        return Object.assign({}, state, { isFetching: true, error: null});

        case REQUEST_FAIL:
        console.log(REQUEST_FAIL);
        return Object.assign({},state, {error: action.errObj});
        
        case RESPONSE_FEED:
        return Object.assign({}, {
            channel: {
                title: action.title,
                description: action.description,
                link: action.link                
            },
            items: action.items.map((val)=>val),
            isFetching: false
        });
        
        default: return state;
    }
}