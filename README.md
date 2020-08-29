# Dixit Online

## ゲームページ
- [遊びたい方はこちら](https://2d-rpg.github.io/dixitOnline)
- [トップページはこちら](https://2d-rpg.github.io)

## 開発環境
- エディタはなんでもいいが，VSCodeをお勧めする
- Node.jsを使うので，サーバー/クライアント共にJavascript

### VSCodeの場合

まず，以下の拡張機能を入れよう
- Live Server
- Debugger for Chrome
- IntelliSense for CSS class names in HTML
- HTMLHint

### 環境構築

- [wikiを参照](https://github.com/2d-rpg/dixitOnline/wiki)

### 開発手順

- [wikiを参照](https://github.com/2d-rpg/dixitOnline/wiki/%E9%96%8B%E7%99%BA%E6%89%8B%E9%A0%86)

### ミーティングログ

- [google drawings](https://docs.google.com/drawings/d/1RziwR98sGqgaBaB3Q2iUu9hP-BSzAivgzpFYMBZ3xn8/edit)
- [React概要(wiki)](https://github.com/2d-rpg/dixitOnline/wiki/React%E6%A6%82%E8%A6%81)
- [サーバへのデプロイ方法(wiki)](https://github.com/2d-rpg/dixitOnline/wiki/%E3%82%B5%E3%83%BC%E3%83%90%E3%81%B8%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E6%96%B9%E6%B3%95)

- 8/30(Sun) : yoshikawa, watanabe, yoshii
    - ゲームのルーム化
    - アニメーション

- 8/28(Fri) : yoshii
    - UI(chat, show_answer, result)の大幅な変更
    - フィールド上のカードのうち自分のカードを選べないように変更
    - ストーリーモーダルのcomponentをhand-wrapperの外に (以上[PR #41](https://github.com/2d-rpg/dixitOnline/pull/41))

- 8/23(Sun) : watanabe, yoshii
    - 背景の変更、全員のスコア表示
    - ステージ変更 (以上[PR #40](https://github.com/2d-rpg/dixitOnline/pull/40))


- 8/21(Fri) : watanabe, yoshii
    - 左下にスコア表示、名前表示を移動
    - modal実装，役割表示微修正 (以上[PR #38](https://github.com/2d-rpg/dixitOnline/pull/38))
    - show_answerをモーダル化
    - カード部分をコンポーネント化(zoomupも)
    - お題のUI変更
    - 名前とスコアの統合とUIの変更
    - リザルト画面のモーダル化（モーダルウィンドウが表に出てこないバグあり）(以上[PR #39](https://github.com/2d-rpg/dixitOnline/pull/39))

- 8/16(Sun) : yoshikawa, watanabe
    - 遅延の実装と答えの表示([PR #37](https://github.com/2d-rpg/dixitOnline/pull/37))

- 8/14(Fri) :
    - 中止

- 8/9(Sun) : yoshikawa, watanabe, yoshii
    - サーバへのデプロイ([PR #36](https://github.com/2d-rpg/dixitOnline/pull/36), [サーバデプロイ手順](https://github.com/2d-rpg/dixitOnline/wiki/%E3%82%B5%E3%83%BC%E3%83%90%E3%81%B8%E3%81%AE%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E6%96%B9%E6%B3%95))

- 8/7(Fri) : yoshikawa, watanabe, yoshii
    - 裏面表示
    - ヘルプの実装([PR #29](https://github.com/2d-rpg/dixitOnline/pull/29))
    - 役割の表示([PR #30](https://github.com/2d-rpg/dixitOnline/pull/30))

- 8/2(Sun) : yoshikawa, watanabe, yoshii
    - カードの選択時のUI([PR #28](https://github.com/2d-rpg/dixitOnline/pull/28))

- 7/31(Fri) : yoshikawa, watanabe, yoshii
    - hand_selection分離([PR #24](https://github.com/2d-rpg/dixitOnline/pull/24))
    - progress修正([PR #25](https://github.com/2d-rpg/dixitOnline/pull/25), [PR #27](https://github.com/2d-rpg/dixitOnline/pull/27))
    - ファイルのアップロード実装
    - 画像の追加
    - result画面後の遷移([PR #26](https://github.com/2d-rpg/dixitOnline/pull/26))

- 7/26(Sun) : watanabe, yoshii
    - cookieを用いた復帰実装([PR #23](https://github.com/2d-rpg/dixitOnline/pull/23))

- 7/24(Fri) : yoshikawa, watanabe, yoshii
    - show_answer ~ calc_result ~ hand_selection までのループ実装([PR #20](https://github.com/2d-rpg/dixitOnline/pull/20))
    - progress表示elementの共有化
    - プレイヤー人数の表示実装(Reactで)
    - チャットの実装(Reactで)
    - 全体的なコードのReact化([PR #21](https://github.com/2d-rpg/dixitOnline/pull/21))

- 7/19(Sun) : yoshikawa, watanabe, yoshii
    - Reactの概要・使い方の共有
    - 各自の担当の主にフロントエンド側の作成
    - フィールドに3枚表示まで([PR #17](https://github.com/2d-rpg/dixitOnline/pull/17))

- 7/17(Fri) : yoshikawa, watanabe, yoshii
    - master_hand_selection ~ others_hand_selectionの統合([RR #9](https://github.com/2d-rpg/dixitOnline/pull/9))
    - canvasの廃止
    - それに伴うReactの採用によるバックエンドとフロントエンドの分離とフロントエンドのコード改変

- 7/12(Sun) : yoshikawa, watanabe, yoshii
    - 設計したクラスとモジュール化の共有
    - Gameクラスによるオブジェクト化([PR #6](https://github.com/2d-rpg/dixitOnline/pull/6))

- 7/10(Fri) : yoshikawa, watanabe, yoshii
    - Akiraのnodo.js等のセットアップ
    - 開発手順(pull requestの作り方)共有
    - ゲーム画面の遷移 設計
    - クラス図 設計
