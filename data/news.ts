
import { NewsItem } from '../types';

export const INITIAL_NEWS_DATA: NewsItem[] = [
  {
    id: 'news_1',
    title: '「ITトラブル解決ナビ」にニュース機能が追加されました',
    date: new Date().toISOString().split('T')[0],
    summary: '情シスからの最新情報をトップ画面で確認できるようになりました。',
    content: 'これまでカテゴリー選択のみだったトップ画面に、情シスからのお知らせ機能を追加しました。緊急のシステム停止情報や、セキュリティに関する注意喚起などをここに掲載します。',
    tags: ['重要', 'アップデート'],
    isPublished: true
  },
  {
    id: 'news_2',
    title: '不審なメール（フィッシング）への注意喚起',
    date: '2025-05-20',
    summary: '「パスワード有効期限が切れます」という件名のメールにご注意ください。',
    content: '現在、社内外でフィッシングメールが多発しています。リンク先でパスワードを入力しないよう、今一度「サイバー安全」カテゴリーの診断フローをご確認ください。',
    tags: ['セキュリティ'],
    isPublished: true
  }
];
