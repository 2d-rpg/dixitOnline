import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useTransition, a } from 'react-spring'
import shuffle from 'lodash/shuffle'
import useMeasure from './useMeasure'
import useMedia from './useMedia'
import data from './data'
import './style.css'
import { faTable } from '@fortawesome/free-solid-svg-icons';

let x = 0;

export default function Test() {

    // Hook1: Tie media queries to the number of columns
    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [6, 4, 3], 2);
    // Hook2: Measure the width of the container element
    const [bind, { width }] = useMeasure();
    // Hook3: Hold items
    const [items, set] = useState(data.slice(0, 6));

    const [flag, setFlag] = useState(false);

    const [index, setIndex] = useState(10);

    // const [hand,setHand] = useState(null);
    // Hook4: shuffle data every 2 seconds
    //useEffect(() => void setInterval(() => set(shuffle), 2000), [])
    // Form a grid of stacked items using width & columns we got from hooks 1 & 2
    // let heights = new Array(columns).fill(0) // Each column gets a height starting with zero

    const onSubmit = (index) => {
        setIndex(index);
        set(items);
        //items.splice(index,1);
    }

    const changeData = () => {
        setFlag(!flag);
        set(!flag ? data.slice(6, 12) : data.slice(0, 6));
    }

    let gridItems = items.map((child, i) => {
        //const xy = [(width / columns) * column, (heights[column] += child.height / 2) - child.height / 2] // X = container width / number of columns * column index, Y = it's just the height of the current column
        let xy = [(width / columns) * i, 0];
        let opacity = 1;
        // if(times % 2 == 0){
        if(i == index){
            xy = [400,400];
            opacity = 0;
        }else if(i > index){
            i -= 1;
            xy = [(width / columns) * i,0];
        }
        return { ...child, xy, width: width / columns, height: child.height / 2,opacity : opacity}
    })
    // Hook5: Turn the static grid values into animated transitions, any addition, removal or change will be animated
    const transitions = useTransition(gridItems, item => item.css, {
        from: ({ xy, width, height }) => ({ xy, width, height, opacity: 0 }),
        enter: ({ xy, width, height }) => ({ xy, width, height, opacity: 1 }),
        update: ({ xy, width, height, opacity }) => ({ xy, width, height, opacity}),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100, duration: 2000},
        trail: 25
    })

    // Render the grid
    return (
        <div>
            <button type="submit" className="btn btn-primary mb-2" onClick={ changeData }>ボタン</button>
        <div {...bind} class="list" >
        {transitions.map(({ item, props: { xy, ...rest }, key },index) => (
            <a.div key={key} style={{ transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`), ...rest }}>
            <div type="button" style={{ backgroundImage: item.css }} onClick={() => onSubmit(index)}/>
            </a.div>
        ))}
        </div>
        </div>
    )
}