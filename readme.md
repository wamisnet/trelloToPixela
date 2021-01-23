# TrelloのWebhookを利用して、Firebase CloudFunctionsを経由し、Pixelaにコミットするアプリ
## Firebase Cloud Functionsをデプロイする

前準備：Firebaseのプロジェクトを作成して、料金プランをBlazeに変更しておいてください。（Functionsを使うために必要です。）

今回のプログラムは[GitHub](https://github.com/wamisnet/trelloToPixela)に上げてあるのでそちらをCloneしてください。

手元に用意できたら、おそらく下記のコマンドを実行することでデプロイができるはずです。

```
npm install -g firebase-tools
firebase use -add
# ダイアログで先ほど作成したプロジェクトに追加する
cd functions
npm i
npm run deploy
```

デプロイコマンドをして、問題がなければ下記のようなAPIのURLがコンソールに表示されます。

```
https://asia-northeast1-{プロジェクト名}.cloudfunctions.net/trelloWebhook
```

ここまでできたら次はTrelloのセットアップをします。

[補足資料](https://firebase.google.com/docs/functions/get-started?hl=ja)

## Trelloのセットアップ

1. [https://trello.com/app-key](https://trello.com/app-key) からAPIキーとトークンを取得します。（画像api）
2. 先ほど取得したAPIキーとトークンを使って、Webhookで取得したいボードのIDを確認します。
```
curl -i -X GET \
 'https://api.trello.com/1/members/wamisnet/boards?key={1で取得したTrelloのAPIキー}&token={1で取得したTrelloのトークン}'
```
実行に成功すると画像のようにIDがわかるので、そのIDを次の手順に使います。
（画像BoardId）
3. これまでに取得した情報を元にAPIを作成して、実行します。
```
curl -i -X POST \
      -H "Content-Type:application/json" \
      -d \
   '' \
    'https://api.trello.com/1/webhooks/?key={1で取得したTrelloのAPIキー}&token={1で取得したTrelloのトークン}&callbackURL={Firebase Cloud FunctionsのURL}&idModel={2で取得したボードID}&description={ボードの説明}'
```

成功すると下記のようなJSONが返ってきます。
```
{
   "id": "600ae3ad9a80a8",
   "description": "trelloToPixela",
   "idModel": "5f76c8eb",
   "callbackURL": "https://asia-northeast1.cloudfunctions.net/trelloWebhook",
   "active": true,
   "consecutiveFailures": 0,
   "firstConsecutiveFailDate": null
   }
```

ここまで来たらTrelloのセットアップは完了です！

## Pixelaのセットアップ

先ほどCloneしたプログラムの中のfunctions/srcの下の「local.ts」というプログラムがコメントアウトされているので、コメントアウトを外しましょう。

ユーザーIDや、グラフID、ユーザートークン、グラフの設定値などを入れて``npm run local``と実行するとアカウントが作られて、コンソールにURLが表示されます。

URLをブラウザで開いてみて、アクセスできるか確認してください。

## 環境変数の設定

Pixelaのアカウントもできたところで、Firebase Cloud Functionsに先ほど作成したPixelaの設定情報を入れ込みます。
空白になっている部分に先ほど作成した下記のコマンドを実行してください。

```
firebase functions:config:set pixela.userid="" pixela.graphid="" pixela.token=""
npm run deploy
```

