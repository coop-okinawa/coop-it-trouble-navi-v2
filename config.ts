
/**
 * 外部リンク・定型文設定
 * 
 * 運用上の注意:
 * - GAROON_ENTRY_URL: 404エラー回避および環境/拠点差を吸収するため、
 *   直接メッセージ画面ではなくポータルの入口URLを指定しています。
 */
export const LINKS = {
  // Garoon 共通入口URL (404回避のため)
  GAROON_ENTRY: "http://home30.kyushu.coop/grn/index.csp",
  
  // Gemini 遷移先URL
  GEMINI: "https://gemini.google.com/",
  
  // ChatGPT 遷移先URL (プロンプト付与あり)
  CHATGPT_BASE: "https://chatgpt.com/?q="
};

export const TEMPLATES = {
  // 外部AI相談用プロンプトテンプレート
  AI_CONSULTATION: `あなたは社内情シス向けのサポートAIです。
以下の条件で回答してください。

【前提】
- 私はコープおきなわの職員です
- 個人情報・パスワード・組合員情報は入力しません
- 危険な操作（レジストリ変更、攻撃手順等）は提案しないでください

【相談内容】
・困っている症状：
・発生日時：
・場所（店舗/部署）：
・端末（個人名は書かない）：
・試したこと：
・エラー表示（あれば）：

【してほしいこと】
1. 該当しそうなトラブルジャンルの推測
2. 最初に確認すべきこと（3つまで）
3. 情シスへ問い合わせる場合の文章（ガルーン貼り付け用）`
};
