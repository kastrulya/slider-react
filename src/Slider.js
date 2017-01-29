import React, {Component} from 'react';
import {createStore} from 'redux';
import './Slider.css';

const FEED = {
    "slider": [
        {
            "hero": "https://placeimg.com/640/480/animals",
            "text": "Animals are here.",
            "image": "https://placeimg.com/150/150/animals/sepia"
        },
        {
            "hero": "https://placeimg.com/640/480/people",
            "text": "People are here.",
            "image": "https://placeimg.com/150/150/people/sepia"
        },
        {
            "hero": "https://placeimg.com/640/480/tech",
            "text": "Tech is here.",
            "image": "https://placeimg.com/150/150/tech/sepia"
        }
    ]
};

const slidesReducer = (state = {tiles: [], activeIndex: 0}, action) => {
    console.log(action.type, action);
    switch (action.type) {
        case 'POPULATE':
            console.log('Populate action', action);
            return {
                ...state,
                tiles: action.data
            };
        case 'NAVIGATE_BACK':
            return {
                ...state,
                activeIndex: state.activeIndex === 0 ? state.tiles.length - 1 : state.activeIndex - 1
            };
        case 'NAVIGATE_FORTH':
            return {
                ...state,
                activeIndex: state.activeIndex === state.tiles.length - 1 ? 0 : state.activeIndex + 1
            };
        default:
            return state;
    }
};

const store = createStore(slidesReducer);

const Tile = ({hero, text, image}) => (
    <div
        className="tile-hero"
        style={{backgroundImage: `url(${hero})`}}>
        <figure className="tile-figure">
            <img
                className="tile-figure__img"
                width="150"
                height="150"
                src={image}
                alt={text}/>
            <figcaption className="tile-figure__caption">{text}</figcaption>
        </figure>
    </div>
);

const getCurrentTile = ({tiles, activeIndex}) => {
    return tiles[activeIndex];
};

class Slider extends Component {
    constructor() {
        super();
        this.time = 20000;
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
        store.dispatch({
            type: 'POPULATE',
            data: FEED.slider
        });
        this.createTimer();
    }

    createTimer() {
        this.timer = setInterval(() => {
            store.dispatch({
                type: 'NAVIGATE_FORTH'
            })
        }, this.time);
    }


    componentWillUnmount() {
        this.unsubscribe();
        clearInterval(this.timer);
    }

    render() {
        const currentTile = getCurrentTile(store.getState());
        return (
            <div>
                <button
                    className="navigation"
                    onClick={() =>
                        store.dispatch({
                            type: 'NAVIGATE_BACK'
                        })
                    }>◀️️
                </button>
                <div
                    className="tile_odd"
                    onMouseEnter={() => {
                        clearInterval(this.timer)
                    }}
                    onMouseLeave={() => {
                        this.createTimer()
                    }}>
                    <Tile {...currentTile} />
                </div>
                <button
                    className="navigation"
                    onClick={() =>
                        store.dispatch({
                            type: 'NAVIGATE_FORTH'
                        })
                    }>▶️️
                </button>
            </div>
        );
    }
}

export default Slider;