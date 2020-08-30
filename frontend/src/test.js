import React, { useState, useEffect } from 'react'
import { useTransition, a } from 'react-spring'
import shuffle from 'lodash/shuffle'
import useMeasure from './useMeasure'
import useMedia from './useMedia'
import data from './data'
import './style.css'

export default function Test() {

    // Hook1: Tie media queries to the number of columns
    const columns = useMedia(['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'], [5, 4, 3], 2)
    // Hook2: Measure the width of the container element
    const [bind, { width }] = useMeasure()
    // Hook3: Hold items
    const [items, set] = useState(data)
    // Hook4: shuffle data every 2 seconds
    useEffect(() => void setInterval(() => set(shuffle), 2000), [])
    // Form a grid of stacked items using width & columns we got from hooks 1 & 2
    

    let cardItems = items.map((item) => {
        console.log(item);
        const xy = [90,50];
        return { ...item, xy}
    });
    
    // Hook5: Turn the static grid values into animated transitions, any addition, removal or change will be animated
    const transitions = useTransition(cardItems, item => item.css, {
        from: ({ xy }) => ({ xy, opacity: 0 }),
        enter: ({ xy }) => ({ xy, opacity: 1 }),
        update: ({ xy }) => ({ xy }),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100 },
        trail: 25
    })

    // Render the grid
    return (
        <div {...bind} class="list">
        {transitions.map(({ item, props: { xy, ...rest }, key }) => (
            <a.div key={key} style={{ transform: xy.interpolate((x, y) => `translate3d(${x}%,${y}%,0)`), ...rest }}>
            <div style={{ backgroundImage: item.css }} />
            </a.div>
        ))}
        </div>
    )
}