import React, { useState, useEffect } from 'react';
import Card from './card';
import '../css/stock.css';

export default function Stock(props) {

    const [stock, setStock] = useState(null);

    const [showStock,setShowStock] = useState(false);

    const stock_update = (data) => {
        setShowStock(true);
        setStock(
            data.game.stock._array.map((card, index) => {
                var id_btn = 'eachStockButton' + index;
                var id_img = 'eachStockImage' + index;
                var field_src = "../images/back/" + card.tailfilename;
                var rotate = Math.random() * 20 - 10;
                var shiftX = Math.random() * 10 - 5;
                var shiftY = Math.random() * 10 - 5;
                const style = { transform: `rotate(${rotate}deg) translate(${shiftX}px, ${shiftY}px)` };
                const stockButton = (
                    <p className='eachStockButton' id={ id_btn } type='button'>
                        <img className='eachStockImage' id={ id_img } src={ field_src } alt={ card.filename }></img>
                    </p>
                );
                // const StockButton = (
                //     <img className='eachStock' style={{transform: `rotate(${sigma}deg) translate(200,200)` }} src={ stock_src } alt={ card.filename }></img>
                // );
                return (<Card button={ stockButton } style={style} kind={ 'Stock' }/>);
            })
        );
        var len = data.game.stock._array.length-1;
        console.log(len);
        document.getElementById(`eachStockButton${len}`).animate([
            // keyframes
            { transform: 'translate(0px,0px)'}, 
            { transform: 'translate(-300px,300px)' , opacity: 0.5 },
        ], { 
            // timing options
            duration: 2000,
        });

        setTimeout(() => {
            document.getElementById(`eachStockButton${len}`).style.display="none";
        }, 2000);
    }

    useEffect(() => {
        props.socket.on('hand_selection' ,(data) => stock_update(data));
    }, [ props ]);

    return (
        <div id="stock" style={ {display: showStock ? 'inline-flex' : 'none'} }>{ stock }</div>
    );
}