## 業務報告サポートアプリ
このアプリは、ユーザーが業務内容を各トピックに分けて、階層的に入力し、Slackの特定のチャンネルに業務内容をポストするWebアプリケーションです。また、要約情報を入力も可能です。

## 使用技術
- React
- Next.js
- Bootstrap 
- Axios
- Slack API

## 機能
### トピックの追加と編集
"Add Topic"ボタンをクリックすると、新しいトピックが追加されます。  
トピックのラベルとURLを入力して、トピック情報を編集できます。  
"Add Child"ボタンを使用して、親トピックに子トピックを追加できます。  

### トピックの削除
"X"ボタンをクリックすると、トピックが削除されます。子トピックも同時に削除されます。     

### AIによる一連のトピックの要約文の作成(開発中)
フォームに要約情報を入力します。  
すべてのトピックにラベルとURLが設定されており、要約情報も入力されている場合、データがSlackチャンネルに送信されます。

## 使用方法
このアプリを起動します。  
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
ブラウザで http://localhost:3000/ にアクセスします。  
"Add Topic"ボタンをクリックして新しいトピックを追加します。  
各トピックのラベルとURLを入力します。  
必要に応じて子トピックを追加します。  
要約情報を入力します。  
"Submit"ボタンをクリックしてデータを送信します。  
