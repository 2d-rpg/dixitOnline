import React from 'react';
// import { useSpring, animated } from 'react-spring';
import '../css/card.css';

/** カードのスケール．変更したい場合はここを変える． */
// const CARD_SCALE = 1.2;
/** カードの拡大スケール */
// const zoomup = () => CARD_SCALE;
/** カードのスケールを設定 */
// const trans = (scale) => `perspective(600px) scale(${scale})`;

/**
 * カードの要素．この中にボタンがあり，ボタンの中に画像が埋め込まれている．
 * コメントアウトしているのはreact-springを用いた場合の実装，動作が重くなるので，現在はcssで実装している．
 * @param { radio button kind } props 
 */
export default function Card(props) {
    /** カードの種類．HandかFieldか */
    let className =  props.kind === 'answer' || props.kind === 'selected' ? props.kind + 'Container' : 'each' + props.kind + 'Container zoom-up-card';
    if (props.kind === 'answer' && props.isMaster) {
        className += ' correctAnswer';
    }
    /** アニメーションの設定 */
    // const [springProps, set] = useSpring(() => ({ scale: 1, config: { mass: 5, tension: 350, friction: 40, duration: 10 } }));

    const isField = (props.kind === 'Field');
    const isAnswer = (props.kind === 'answer');

    const resultComponent = isField ? (
        <div className={ className } display='inline-flex'>
            { props.radio }
            { props.button }
        </div>
    ) : isAnswer && props.isMaster ? (
        <div className={ className } display='inline-flex'>
            <div className="innnderAnswerContainer">
                { props.button }
            </div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    ) : (
        <div className={ className } display='inline-flex'>
            { props.button }
        </div>
    );

    return (
        // <animated.div onMouseMove={() => set({ scale: zoomup() })} onMouseLeave={() => set({ scale: 1 })}
        // style={{ transform: springProps.scale.interpolate(trans) }} className={ className } display='inline-flex'>
        //     { props.button }
        // </animated.div>
        resultComponent
    );
}