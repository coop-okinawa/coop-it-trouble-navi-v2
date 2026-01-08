
# 公開PoC 判定結果 & 手順書

## (1) 判定結果まとめ
- **Framework**: Vite + React
- **Package Manager**: npm
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA/SSR**: SPA
- **404対策の要否**: 必要 (`vercel.json` にて実装済み)

## (2) 修正が必要なファイル一覧
- `package.json`: Vite環境でのビルド依存関係定義のため
- `vite.config.ts`: ビルドパイプライン設定のため
- `tsconfig.json`: TypeScriptのコンパイル設定のため
- `vercel.json`: Vercel上でのSPAルーティング(404回避)のため
- `index.html`: CDN/importmap構成をnpmモジュール構成に変更するため

## (5) 編集データ保存方式の説明
**localStorageによる永続化を採用**
- **理由**: PoCにおいて、サーバーやデータベースの構築時間をゼロにし、即座に「編集・保存・反映」の体験を提供するため。
- **Vercelでの動作**: Vercelは静的ホスティングですが、`localStorage`はユーザーのブラウザに保存されるため、デプロイ後も「自分が編集した内容」は再読み込みしても消えません。

**共有反映が必要な場合の次ステップ**
将来的に「全ユーザーで同じ編集内容を共有」したい場合は、SupabaseやFirebaseなどのBaaSを導入し、`App.tsx` の `saveToStorage` を API呼び出しに置き換える必要があります。

## (6) GitHub手順
PCのターミナル（コマンドプロンプト等）で実行してください。

1. **新規リポジトリ作成**: GitHub上で新しいリポジトリ（例: `coop-it-nav`）を作成。
2. **Pushコマンド**:
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git branch -M main
git remote add origin [あなたのGitHubリポジトリURL]
git push -u origin main
```

## (7) Vercel手順
1. **Import**: Vercelダッシュボードで `Add New` -> `Project` を選択し、上記GitHubリポジトリを `Import`。
2. **Build & Output Settings**:
   - Framework Preset: `Vite` (自動認識されます)
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy**: `Deploy` ボタンをクリック。
4. **URL確認**: デプロイ完了後、提供される `***.vercel.app` のURLにアクセス。
5. **更新**: コードを変更してGitHubに `push` するだけで、Vercelが自動的に再デプロイします。

## (8) 最終チェックリスト
- [ ] URLを開く → 画面が正常に表示される
- [ ] 管理者認証 → パスワード「0000」で管理画面に入れる
- [ ] ニュース編集 → 編集して「すべて保存」
- [ ] 再読み込み → 編集したニュースが残っている
- [ ] コンソールにエラーが出ていない
