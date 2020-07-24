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
- [コード解説(wiki)](https://github.com/2d-rpg/dixitOnline/wiki/%E3%82%B3%E3%83%BC%E3%83%89%E8%A7%A3%E8%AA%AC)

- 7/24(Fri) :
    - show_answer ~ calc_result ~ hand_selection までのループ実装
    - progress表示elementの共有化
    - プレイヤー人数の表示実装(Reactで)
    - チャットの実装(Reactで)

- 7/19(Sun) :
    - Reactの概要・使い方の共有
    - 各自の担当の主にフロントエンド側の作成
    - フィールドに3枚表示まで(PR #17)

- 7/17(Fri) :
    - master_hand_selection ~ others_hand_selectionの統合([RR #9](../../pull/9))
    - canvasの廃止
    - それに伴うReactの採用によるバックエンドとフロントエンドの分離とフロントエンドのコード改変

- 7/12(Sun) :
    - 設計したクラスとモジュール化の共有
    - Gameクラスによるオブジェクト化([PR #6](../../pull/6))

- 7/10(Fri) :
    - Akiraのnodo.js等のセットアップ
    - 開発手順(pull requestの作り方)共有
    - ゲーム画面の遷移 設計
    - クラス図 設計
