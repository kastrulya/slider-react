import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
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

const findNextIndex = (length, currentIndex) => {
    return currentIndex === length - 1 ? 0 : currentIndex + 1;
};


const findPrevIndex = (length, currentIndex) => {
    return currentIndex === 0 ? length - 1 : currentIndex - 1;
};

const preloader = (state = false, action) => {
    switch (action.type) {
        case 'PRELOAD':
            return true;
        default:
            return state;
    }
};

const slider = (state = {
    tiles: [],
    activeIndex: 0,
    activeTile: 0,
}, action) => {
    console.log(action.type, action);
    switch (action.type) {
        case 'POPULATE':
            console.log('Populate action', action);
            return {
                ...state,
                tiles: action.data
            };
        case 'NAVIGATE_BACK':
            let nextIndex = state.activeIndex;
            let activeIndex = findPrevIndex(state.tiles.length, state.activeIndex);
            let activeTile = state.activeTile === 0 ? 1 : 0;
            return {
                ...state,
                activeIndex,
                nextIndex,
                activeTile
            };
        case 'NAVIGATE_FORTH':
            activeIndex = findNextIndex(state.tiles.length, state.activeIndex);
            nextIndex = findNextIndex(state.tiles.length, activeIndex);
            activeTile = state.activeTile === 0 ? 1 : 0;
            return {
                ...state,
                activeIndex,
                nextIndex,
                activeTile
            };
        default:
            return state;
    }
};

const store = createStore(combineReducers({
    slider,
    preloader
}));

const Tile = ({active, hero, text, image}) => (
    <div
        className="tile-hero"
        style={{backgroundImage: `url(${hero})`}}>
        <figure
            className={ "tile-figure " + (active ? "show" : "hide") }>
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

class Slider extends Component {
    constructor() {
        super();
        this.time = 5000;
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
        const {tiles, activeIndex, nextIndex, activeTile} = store.getState().slider;
        const currentTile = tiles[activeIndex];
        const nextTile = tiles[nextIndex];
        const activeTileComponent =
            <div className="tile show">
                <Tile
                    {...currentTile}
                    active={true}
                />
            </div>;
        const hiddenTileComponent =
            <div className="tile hide">
                <Tile
                    {...nextIndex}
                />;
            </div>;
        const tile1 = activeTile === 0 ? activeTileComponent : hiddenTileComponent;
        const tile2 = activeTile === 1 ? activeTileComponent : hiddenTileComponent;
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
                    onMouseEnter={() => {
                        clearInterval(this.timer)
                    }}
                    onMouseLeave={() => {
                        this.createTimer()
                    }}>
                    {tile1}
                    {tile2}
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