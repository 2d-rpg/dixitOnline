// master_hand_selectionステージ

import {Utils} from './utils.js'

export function FieldSelection(props) {

    const { register, handleSubmit } = useForm();
    const [show, setShow] = useState(true);

    const onSubmit = (data, event) => {
        setShow(false);
        //サーバーの'field_selection'
        props.socket.emit('field_selection', {answer : data.answer});
        event.preventDefault(); // フォームによる/?への接続を止める(socketIDを一意に保つため)
    }

    //親の場合
    // return (
    //     <div>
    //         // fieldのカードを並べる
    //         //　他のユーザー待ち
    //     </div>
    // );

    // 子の場合


    return (
        <div>
            {/* // fieldのカードを並べる
            // form
            // カードの番号
            // プレイヤーの情報の送信 */}
            <form className="form-inline" id="answerForm" onSubmit={ handleSubmit(onSubmit) } style={ {display: show ? 'block' : 'none' } }>
                <label className="sr-only" htmlFor="inlineFormInputName2">Name</label>
                <input type="number" className="form-control mb-2 mr-sm-2" name="answer" ref={ register } placeholder="親が出したと思うカードの番号を入力してください" max=MAX/>
                <button type="submit" className="btn btn-primary mb-2">さんとしてゲームに参加</button>
            </form>
            {/* //　送信後は待ち */}
        </div>
    );
}