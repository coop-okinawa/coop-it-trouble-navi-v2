import { FlowData } from '../types';

/**
 * 編集ルール（ここだけ読めば運用できます）
 * - categories：トップのカード。id / name / description / startNodeId / icon を編集
 * - nodes：
 *   - type:"question" → yes / no で次へ
 *   - type:"action"   → steps 実施 → resolvedYes / resolvedNo で次へ
 *   - type:"end"      → 最終結果（情シス連絡の場合は ticketPreset を付ける）
 *
 * 運用のコツ
 * - 追加するノードIDは、ジャンル頭文字で揃える（例：print は p_、browser は b_）
 * - 「質問は1つだけ」「手順は action に寄せる」
 * - 情シス連絡 end には ticketPreset を必ず付ける（問い合わせテンプレが安定します）
 */

export const INITIAL_FLOW_DATA: FlowData = {
  categories: [
    {
      id: "print",
      name: "印刷 / 周辺機器",
      description: "印刷できない、複合機の反応がない、紙詰まり等の場合",
      startNodeId: "p_1",
      icon: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    },
    {
      id: "nw",
      name: "ネットワーク / Wi-Fi",
      description: "インターネットや社内サイトが見れない、接続が不安定な場合",
      startNodeId: "n_1",
      icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    },
    {
      id: "vpn",
      name: "VPN / 拠点間接続",
      description: "在宅・出先から社内に繋がらない、VPN接続エラー",
      startNodeId: "v_1",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    },
    {
      id: "zoom",
      name: "Zoom会議",
      description: "音声・映像の不具合、マイクが反応しない、参加できない場合",
      startNodeId: "z_1",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    },
    {
      id: "office",
      name: "Office 2024 / アプリ",
      description: "Excel/Wordが固まる、起動しない、ライセンスエラーが出る場合",
      startNodeId: "o_1",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    },
    {
      id: "update",
      name: "Windows Update",
      description: "更新が終わらない、エラーコードが出る、再起動ループの場合",
      startNodeId: "u_1",
      icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    },
    {
      id: "account",
      name: "アカウント / 権限",
      description: "パスワード忘れ、ログインロック、権限不足の場合",
      startNodeId: "a_1",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    },
    {
      id: "shared",
      name: "共有フォルダ / 社内システム",
      description: "共有フォルダが開かない、ファイルが見つからない場合",
      startNodeId: "sh_1",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    },
    {
      id: "browser",
      name: "Web / 証明書 / ブラウザ",
      description: "特定サイトだけ開かない、証明書エラー、ダウンロード不可",
      startNodeId: "b_1",
      icon: "M4 4h16v12H4z M6 18h12"
    },
    {
      id: "device",
      name: "周辺機器（USB/音声/カメラ）",
      description: "スキャナ、USB、ヘッドセット、カメラが動かない",
      startNodeId: "dv_1",
      icon: "M7 7h10v10H7z M12 2v5 M12 17v5"
    },
    {
      id: "storage",
      name: "端末が遅い / 容量不足",
      description: "PCの動作が非常に重い、Cドライブの空きがない場合",
      startNodeId: "s_1",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    },
    {
      id: "store",
      name: "店舗端末（レジ/ラベル/秤等）",
      description: "店舗で使う端末・機器の不具合（業務影響が大きい）",
      startNodeId: "t_1",
      icon: "M3 7h18 M5 7l1-3h12l1 3 M5 7v14h14V7"
    },
    {
      id: "cyber",
      name: "サイバー安全（不審メール等）",
      description: "怪しいメール、ウイルス感染が疑われる緊急時",
      startNodeId: "c_1",
      icon: "M12 15v2m0 0v2m0-2h2m-2 0H10m3-9H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-4.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293H12z"
    },
    {
      id: "ddos",
      name: "DDoS（サイト停止）",
      description: "社内・外の全サイトが極端に重く、繋がらない兆候",
      startNodeId: "d_1",
      icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
    }
  ],

  nodes: {
    // =========================================================
    // 印刷 / 周辺機器（PRINT）
    // =========================================================
    "p_1": {
      type: "question",
      title: "プリンタ本体は正常？",
      body: "電源ランプは点灯していますか？ 画面に「紙詰まり」「トナー」「エラー」表示はありませんか？",
      yes: "p_2",
      no: "p_body_fix"
    },
    "p_body_fix": {
      type: "action",
      title: "本体の表示どおりに復旧",
      body: "まずはプリンタが動ける状態にします。",
      steps: [
        "主電源が入っているか確認してください。",
        "画面表示に従い、紙詰まり/トナー/カバー開閉を実施してください。",
        "復旧後、もう一度印刷を試してください。"
      ],
      resolvedYes: "p_success",
      resolvedNo: "p_2"
    },
    "p_2": {
      type: "question",
      title: "他の人は同じプリンタで印刷できる？",
      body: "あなた以外の人（別PC）では印刷できますか？",
      yes: "p_pc_queue",
      no: "p_nw_lan"
    },
    "p_nw_lan": {
      type: "action",
      title: "LANケーブルの抜き差し",
      body: "プリンタとネットワークが切れている可能性があります。",
      steps: [
        "プリンタ背面のLANケーブルを一度抜き、カチッと音がするまで差し直します。",
        "壁側（またはハブ側）も同様に抜き差しします。",
        "復旧したら印刷を再実行してください。"
      ],
      sources: [
        { title: "Windows のプリンター接続/印刷の問題 (Microsoft)", url: "https://support.microsoft.com/ja-jp/windows/fix-printer-connection-and-printing-problems-in-windows-ad1da4ad-0249-4113-91c6-2eb8cb9e8557" }
      ],
      resolvedYes: "p_success",
      resolvedNo: "p_contact"
    },
    "p_pc_queue": {
      type: "question",
      title: "印刷キューが溜まっていない？",
      body: "自分のPCだけ印刷できない場合、印刷待ちが詰まっていることがあります。キュー確認できますか？",
      yes: "p_pc_clearqueue",
      no: "p_spooler"
    },
    "p_pc_clearqueue": {
      type: "action",
      title: "印刷待ち（キュー）を取り消す",
      body: "古い印刷が詰まると、新しい印刷が始まりません。",
      steps: [
        "Windowsの検索で「プリンター」と入力し「プリンターとスキャナー」を開きます。",
        "対象プリンタ →「キューを開く」→ メニュー「プリンター」→「すべてのドキュメントを取り消す」。",
        "再度印刷を試してください。"
      ],
      sources: [
        { title: "印刷の問題を解決する (Microsoft)", url: "https://support.microsoft.com/ja-jp/windows/fix-printer-connection-and-printing-problems-in-windows-ad1da4ad-0249-4113-91c6-2eb8cb9e8557" }
      ],
      resolvedYes: "p_success",
      resolvedNo: "p_spooler"
    },
    "p_spooler": {
      type: "action",
      title: "印刷機能（Spooler）を再起動",
      body: "PC内の印刷サービスをリセットします。",
      steps: [
        "Ctrl + Shift + Esc でタスクマネージャーを開きます。",
        "「サービス」タブ →「Spooler」を探す → 右クリック「再起動」。",
        "再度印刷を試してください。"
      ],
      sources: [
        { title: "印刷の問題 (Microsoft Learn)", url: "https://learn.microsoft.com/ja-jp/troubleshoot/windows-client/printing/fix-printer-problems" }
      ],
      resolvedYes: "p_success",
      resolvedNo: "p_3"
    },
    "p_3": {
      type: "question",
      title: "印刷できないのは「特定のアプリ」だけ？",
      body: "例：Excelからは不可だがPDFはOK、など。特定アプリだけですか？",
      yes: "p_app_only",
      no: "p_contact"
    },
    "p_app_only": {
      type: "action",
      title: "別形式で一度試す",
      body: "アプリ側の不具合の切り分けをします。",
      steps: [
        "可能なら「PDFとして保存」→ PDFから印刷を試します。",
        "Excelなら「印刷範囲」を最小（1ページ）で試します。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "p_success",
      resolvedNo: "p_contact"
    },
    "p_success": { type: "end", title: "解決しました", body: "印刷が完了することを確認してください。" },
    "p_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "機器故障、ドライバ/共有設定、ネットワーク側の問題の可能性があります。",
      ticketPreset: { category: "印刷不具合", urgency: "中", notes: "本体表示確認・キュー削除・Spooler再起動・LAN抜き差しを実施。改善せず。" }
    },

    // =========================================================
    // ネットワーク / Wi-Fi（NETWORK）
    // =========================================================
    "n_1": {
      type: "question",
      title: "見れない範囲は？",
      body: "インターネット全体（Google等）も見れませんか？ それとも社内サイト（ガルーン等）だけですか？",
      yes: "n_all",
      no: "n_specific"
    },
    "n_all": {
      type: "action",
      title: "接続状態（Wi-Fi/有線/機内モード）確認",
      body: "まず物理・基本設定を確認します。",
      steps: [
        "機内モードがオンになっていないか確認してください。",
        "有線LANの場合、PC側のケーブルを一度抜き差ししてください。",
        "画面右下のネットワークアイコンから、正しいWi-Fiに繋がっているか確認してください。"
      ],
      sources: [
        { title: "Windows の Wi-Fi 接続の問題 (Microsoft)", url: "https://support.microsoft.com/ja-jp/windows/fix-wi-fi-connection-issues-in-windows-9424a1f7-6a31-19ca-fd3b-00efb5847161" }
      ],
      resolvedYes: "n_success",
      resolvedNo: "n_adapter"
    },
    "n_adapter": {
      type: "action",
      title: "ネットワークアダプタを無効→有効",
      body: "PC内の通信部品をリセットします。",
      steps: [
        "スタートを右クリック →「ネットワーク接続」。",
        "「アダプターのオプションを変更する」。",
        "「Wi-Fi」または「イーサネット」を右クリック →「無効にする」→ 30秒 →「有効にする」。"
      ],
      resolvedYes: "n_success",
      resolvedNo: "n_2"
    },
    "n_2": {
      type: "question",
      title: "周りも同じ？",
      body: "同じ場所（同じフロア/部署）で、他の人も繋がりませんか？",
      yes: "n_contact_wide",
      no: "n_contact"
    },
    "n_specific": {
      type: "question",
      title: "社内サイトだけ見れない？",
      body: "社内サイト（例：ガルーン）だけ見れない状態ですか？",
      yes: "n_browser_cache",
      no: "n_dns"
    },
    "n_browser_cache": {
      type: "action",
      title: "ブラウザのキャッシュ削除",
      body: "古いデータが邪魔している可能性があります。",
      steps: [
        "ブラウザで Ctrl + Shift + Delete。",
        "「キャッシュされた画像とファイル」だけにチェック → 削除。",
        "ブラウザを閉じて開き直します。"
      ],
      sources: [
        { title: "Edge の閲覧履歴/キャッシュ削除 (Microsoft)", url: "https://support.microsoft.com/ja-jp/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7951-805b-37d1-f463-5490a0cd3803" }
      ],
      resolvedYes: "n_success",
      resolvedNo: "n_contact"
    },
    "n_dns": {
      type: "action",
      title: "一時的な名前解決不良の切り分け",
      body: "特定サイトが見れない場合、回線ではなく設定/セキュリティ要因のことがあります。",
      steps: [
        "他のブラウザ（Edge/Chrome）でも同じか確認します。",
        "URLを正確に確認（誤字がないか）。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "n_success",
      resolvedNo: "n_contact"
    },
    "n_success": { type: "end", title: "解決しました", body: "通信が回復したことを確認してください。" },
    "n_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "端末設定やネットワーク側の調査が必要な可能性があります。",
      ticketPreset: { category: "ネットワーク障害", urgency: "高", notes: "物理接続確認・アダプタ無効/有効・ブラウザ切り分けを実施。改善せず。" }
    },
    "n_contact_wide": {
      type: "end",
      title: "広域障害の可能性：情シスへ連絡",
      body: "複数人が同時に繋がらない場合、設備/回線側の障害の可能性があります。",
      ticketPreset: { category: "ネットワーク障害（広域）", urgency: "高", notes: "同一場所で複数人が同時に不通。範囲/時刻を整理のうえ連絡。" }
    },

    // =========================================================
    // VPN（VPN）
    // =========================================================
    "v_1": {
      type: "question",
      title: "VPNは接続できる？",
      body: "VPNの接続自体が失敗しますか？（ログイン/接続ボタン後にエラー）",
      yes: "v_connect_fail",
      no: "v_2"
    },
    "v_connect_fail": {
      type: "action",
      title: "ネット回線の確認（まずここ）",
      body: "VPN前に、通常のインターネットが正常か確認します。",
      steps: [
        "VPNを一度切断し、Google等が見れるか確認します。",
        "見れない場合は「ネットワーク/Wi-Fi」へ戻って診断してください。",
        "ネットはOKなのにVPNだけNGなら、次へ進みます。"
      ],
      resolvedYes: "v_2",
      resolvedNo: "n_1"
    },
    "v_2": {
      type: "question",
      title: "社内サイトだけ見れない？",
      body: "VPNは接続済み表示だが、社内サイト（ガルーン/共有等）だけ見れませんか？",
      yes: "v_dns",
      no: "v_contact"
    },
    "v_dns": {
      type: "action",
      title: "再接続（最短の復旧）",
      body: "一時的な経路不良のことがあります。",
      steps: [
        "VPNを切断 → 30秒待つ → 再接続します。",
        "PCを再起動して再接続します（可能なら）。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "v_success",
      resolvedNo: "v_contact"
    },
    "v_success": { type: "end", title: "解決しました", body: "社内サイトへアクセスできることを確認してください。" },
    "v_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "VPN設定/証明書/アカウント状態の確認が必要です。",
      ticketPreset: { category: "VPN接続", urgency: "高", notes: "インターネットはOK。VPN再接続・再起動でも改善せず。エラー文/時刻を添付。" }
    },

    // =========================================================
    // Zoom（ZOOM）
    // =========================================================
    "z_1": {
      type: "question",
      title: "音声の問題？",
      body: "相手の声が聞こえない、または自分の声が相手に届かないですか？",
      yes: "z_audio",
      no: "z_2"
    },
    "z_audio": {
      type: "action",
      title: "Zoomの音声デバイス確認",
      body: "Zoom側で正しい機器が選ばれていないことがあります。",
      steps: [
        "Zoom左下のマイク横「＾」をクリックします。",
        "スピーカー/マイクが正しい機器（ヘッドセット名など）か確認します。",
        "「スピーカーとマイクをテストする」を実行します。"
      ],
      sources: [
        { title: "Zoom オーディオの問題解決 (Zoom公式)", url: "https://support.zoom.com/hc/ja/article?id=zm_kb&sysparm_article=KB0060592" }
      ],
      resolvedYes: "z_success",
      resolvedNo: "z_3"
    },
    "z_2": {
      type: "question",
      title: "映像の問題？",
      body: "自分の顔が映らない、または相手の映像が見えないですか？",
      yes: "z_video",
      no: "z_join"
    },
    "z_video": {
      type: "action",
      title: "Windowsのカメラ許可",
      body: "Windows設定でカメラが禁止されている可能性があります。",
      steps: [
        "Windows「設定」→「プライバシーとセキュリティ」→「カメラ」。",
        "「アプリにカメラへのアクセスを許可」がオンか確認します。",
        "ノートPCの物理シャッター（カメラふた）も確認します。"
      ],
      sources: [
        { title: "Windows のカメラが動作しない (Microsoft)", url: "https://support.microsoft.com/ja-jp/windows/camera-doesn-t-work-in-windows-32adb01b-bb43-aff0-ad44-840111c1d11f" }
      ],
      resolvedYes: "z_success",
      resolvedNo: "z_contact"
    },
    "z_join": {
      type: "action",
      title: "参加できない（最短の切り分け）",
      body: "参加方式で切り分けます。",
      steps: [
        "同じ会議URLを、ブラウザ参加（アプリ外）で試します。",
        "別端末（スマホ等）でも参加できるか確認します。",
        "エラー表示が出た場合はスクショして情シスへ連絡してください。"
      ],
      resolvedYes: "z_success",
      resolvedNo: "z_contact"
    },
    "z_3": {
      type: "action",
      title: "他アプリの占有を確認",
      body: "別アプリがマイク/カメラを使っているとZoomで使えません。",
      steps: [
        "ブラウザのタブ（Web会議/録音系）を閉じます。",
        "Zoomを一度終了して再起動します。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "z_success",
      resolvedNo: "z_contact"
    },
    "z_success": { type: "end", title: "解決しました", body: "会議を継続できることを確認してください。" },
    "z_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "端末/機器の故障、ドライバ、設定の調査が必要です。",
      ticketPreset: { category: "Zoom/Web会議", urgency: "中", notes: "Zoom内テスト/Windows許可/再起動など実施。改善せず。機器名と症状を添付。" }
    },

    // =========================================================
    // Office 2024（OFFICE）
    // =========================================================
    "o_1": {
      type: "question",
      title: "起動しない？固まる？",
      body: "アイコンを押しても何も起きない（起動しない）ですか？ それとも開く途中で固まりますか？",
      yes: "o_launch",
      no: "o_freeze"
    },
    "o_launch": {
      type: "action",
      title: "セーフモードで起動",
      body: "余計な機能を除外して最小構成で起動します。",
      steps: [
        "Ctrlキーを押したまま Excel/Word を起動します。",
        "「セーフモードで起動しますか？」→「はい」。",
        "起動できたら「アドイン」が原因の可能性があります。"
      ],
      sources: [
        { title: "Office をセーフモードで開く (Microsoft)", url: "https://support.microsoft.com/ja-jp/office/open-office-apps-in-safe-mode-on-a-windows-pc-dedf944a-5f1b-4243-9851-b5e9f33ad464" }
      ],
      resolvedYes: "o_success",
      resolvedNo: "o_repair"
    },
    "o_freeze": {
      type: "action",
      title: "強制終了→再起動",
      body: "内部で止まっているアプリを一度完全に終わらせます。",
      steps: [
        "Ctrl + Shift + Esc でタスクマネージャー。",
        "Excel/Word を右クリック →「タスクの終了」。",
        "再度起動して改善するか確認します。"
      ],
      resolvedYes: "o_success",
      resolvedNo: "o_repair"
    },
    "o_repair": {
      type: "action",
      title: "Officeのクイック修復",
      body: "プログラムの不具合を自動修復します。",
      steps: [
        "設定 → アプリ → インストール済みアプリ。",
        "Microsoft Office 2024 →「変更」。",
        "「クイック修復」→「修復」。"
      ],
      sources: [
        { title: "Office アプリの修復 (Microsoft)", url: "https://support.microsoft.com/ja-jp/office/repair-an-office-application-7821d4b6-7c1d-4205-aa0e-a6b40c5bb88b" }
      ],
      resolvedYes: "o_success",
      resolvedNo: "o_contact"
    },
    "o_success": { type: "end", title: "解決しました", body: "作業データの保存を忘れないでください。" },
    "o_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "ライセンス/再インストール/端末設定の確認が必要です。",
      ticketPreset: { category: "Office不具合", urgency: "中", notes: "セーフモード/強制終了/クイック修復を実施。改善せず。症状とアプリ名を添付。" }
    },

    // =========================================================
    // Windows Update（UPDATE）
    // =========================================================
    "u_1": {
      type: "question",
      title: "エラーコード（0x〜）は出てる？",
      body: "更新画面に「0x…」から始まるエラーコードは表示されていますか？",
      yes: "u_code",
      no: "u_wait"
    },
    "u_code": {
      type: "action",
      title: "Windows Update トラブルシューティング",
      body: "Windowsの診断機能を実行します。",
      steps: [
        "設定 → 更新とセキュリティ → トラブルシューティング。",
        "「追加のトラブルシューティング」→「Windows Update」。",
        "画面の指示に従い修復を適用します。"
      ],
      sources: [
        { title: "Windows Update トラブルシューティング (Microsoft)", url: "https://support.microsoft.com/ja-jp/windows/windows-update-troubleshooter-19bc41ca-ad72-ae0d-ca02-108921473947" }
      ],
      resolvedYes: "u_success",
      resolvedNo: "u_2"
    },
    "u_wait": {
      type: "action",
      title: "まずは待つ（進行確認）",
      body: "更新内容によっては長時間かかります。",
      steps: [
        "ACアダプター接続のまま、しばらく待ちます。",
        "ディスクランプが点滅していれば進行中の可能性があります。",
        "数時間動かない/ループする場合は情シスへ連絡してください。"
      ],
      resolvedYes: "u_success",
      resolvedNo: "u_contact"
    },
    "u_2": {
      type: "question",
      title: "再起動ループ/更新画面で停止？",
      body: "再起動が繰り返される、または更新画面のまま進まないですか？",
      yes: "u_contact",
      no: "u_contact"
    },
    "u_success": { type: "end", title: "解決しました", body: "Windowsが最新になったことを確認してください。" },
    "u_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "システムファイル側の復旧が必要な可能性があります。",
      ticketPreset: { category: "Windows Update", urgency: "中", notes: "トラブルシューティング/待機でも改善せず。エラーコード/停止画面/時刻を添付。" }
    },

    // =========================================================
    // アカウント / 権限（ACCOUNT）
    // =========================================================
    "a_1": {
      type: "question",
      title: "ロック警告は出てる？",
      body: "「このアカウントはロックされています」等の表示が出ていますか？",
      yes: "a_lock",
      no: "a_forgot"
    },
    "a_lock": {
      type: "action",
      title: "一定時間待つ",
      body: "連続失敗で一時ロックされることがあります。",
      steps: [
        "いったん操作を止め、30分ほど待ちます。",
        "再開時は Caps/Num/全角モードを確認して慎重に入力します。"
      ],
      resolvedYes: "a_success",
      resolvedNo: "a_contact"
    },
    "a_forgot": {
      type: "action",
      title: "入力モード確認",
      body: "入力モード違い（全角・Capsなど）で失敗しがちです。",
      steps: [
        "パスワード欄の「目」アイコンで入力文字を確認します（可能な範囲で）。",
        "Caps Lock / Num Lock / 全角（日本語）を確認します。",
        "それでも不可なら情シスへ連絡してください。"
      ],
      resolvedYes: "a_success",
      resolvedNo: "a_contact"
    },
    "a_success": { type: "end", title: "解決しました", body: "ログインできることを確認してください。" },
    "a_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "パスワードリセット/権限付与が必要です。",
      ticketPreset: { category: "アカウント/ログイン", urgency: "高", notes: "ロック/入力モード確認でも不可。対象システム名とエラー表示を添付。" }
    },

    // =========================================================
    // 共有フォルダ / 社内システム（SHARED）
    // =========================================================
    "sh_1": {
      type: "question",
      title: "エラーはどっち？",
      body: "「アクセス権限がありません」表示ですか？ それとも「場所が見つかりません」ですか？",
      yes: "sh_perm",
      no: "sh_path"
    },
    "sh_perm": {
      type: "action",
      title: "権限の可能性",
      body: "あなたのIDに許可が無い可能性があります。",
      steps: [
        "異動直後なら、権限申請が通っているか上長に確認します。",
        "同じ部署の人が開けるか確認します（可能なら）。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "sh_success",
      resolvedNo: "sh_contact"
    },
    "sh_path": {
      type: "action",
      title: "ネットワークドライブ再接続",
      body: "割り当てが切れている可能性があります。",
      steps: [
        "PC → 対象ドライブ（例：Z）を右クリック →「切断」。",
        "案内されているパス（\\\\sv...）で「ネットワークドライブの割り当て」をやり直します。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "sh_success",
      resolvedNo: "sh_contact"
    },
    "sh_success": { type: "end", title: "解決しました", body: "フォルダ/システムが開けることを確認してください。" },
    "sh_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "サーバ側障害、または個別の許可設定が必要です。",
      ticketPreset: { category: "共有フォルダ/社内システム", urgency: "中", notes: "権限/再割り当てを試行。改善せず。対象パスとエラー表示を添付。" }
    },

    // =========================================================
    // Web / 証明書 / ブラウザ（BROWSER）
    // =========================================================
    "b_1": {
      type: "question",
      title: "特定サイトだけ開けない？",
      body: "特定のサイト（例：ガルーン）だけ開けませんか？",
      yes: "b_specific",
      no: "b_all"
    },
    "b_specific": {
      type: "action",
      title: "キャッシュ削除→再起動",
      body: "まずは最短で復旧を試します。",
      steps: [
        "Ctrl + Shift + Delete → キャッシュ削除。",
        "ブラウザを閉じて開き直します。",
        "別ブラウザ（Edge/Chrome）でも同じか確認します。"
      ],
      sources: [
        { title: "Edge の閲覧履歴/キャッシュ削除 (Microsoft)", url: "https://support.microsoft.com/ja-jp/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7951-805b-37d1-f463-5490a0cd3803" }
      ],
      resolvedYes: "b_success",
      resolvedNo: "b_cert"
    },
    "b_cert": {
      type: "question",
      title: "証明書エラーが出る？",
      body: "「この接続ではプライバシーが保護されません」等の証明書エラーが表示されますか？",
      yes: "b_contact",
      no: "b_dl"
    },
    "b_dl": {
      type: "action",
      title: "ダウンロードだけ失敗？",
      body: "ダウンロードだけできない場合はセキュリティ制御の可能性があります。",
      steps: [
        "同じ操作を別ブラウザで試します。",
        "ファイル名/サイト名/時刻を控えてください。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "b_success",
      resolvedNo: "b_contact"
    },
    "b_all": {
      type: "action",
      title: "回線側の可能性",
      body: "全サイトが見れない場合はネットワーク問題の可能性が高いです。",
      steps: [
        "トップへ戻り「ネットワーク / Wi-Fi」を選んで診断してください。"
      ],
      resolvedYes: "b_success",
      resolvedNo: "n_1"
    },
    "b_success": { type: "end", title: "解決しました", body: "ページが表示できることを確認してください。" },
    "b_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "証明書/プロキシ/セキュリティ制御の確認が必要です。",
      ticketPreset: { category: "Web/ブラウザ", urgency: "中", notes: "キャッシュ削除・別ブラウザ確認でも改善せず。URL/エラー/時刻を添付。" }
    },

    // =========================================================
    // 周辺機器（DEVICE）
    // =========================================================
    "dv_1": {
      type: "question",
      title: "特定の機器だけ動かない？",
      body: "USB機器（スキャナ等）など、特定の機器だけ動きませんか？",
      yes: "dv_usb",
      no: "dv_2"
    },
    "dv_usb": {
      type: "action",
      title: "抜き差し・別ポートで切り分け",
      body: "接続不良を切り分けます。",
      steps: [
        "USBを抜き差しします。",
        "別のUSBポートに挿します。",
        "可能なら別PCでも同じ症状か確認します。"
      ],
      resolvedYes: "dv_success",
      resolvedNo: "dv_contact"
    },
    "dv_2": {
      type: "question",
      title: "音声（マイク/ヘッドセット）？",
      body: "マイク/ヘッドセットの不具合ですか？",
      yes: "dv_audio",
      no: "dv_cam"
    },
    "dv_audio": {
      type: "action",
      title: "音声デバイス選択の確認",
      body: "既定のデバイスがずれていることがあります。",
      steps: [
        "タスクバーの音量アイコン → 出力/入力デバイスを確認。",
        "ヘッドセットの抜き差し。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "dv_success",
      resolvedNo: "dv_contact"
    },
    "dv_cam": {
      type: "question",
      title: "カメラ？",
      body: "Webカメラが映らない/認識しないですか？",
      yes: "dv_camera",
      no: "dv_contact"
    },
    "dv_camera": {
      type: "action",
      title: "カメラ許可の確認",
      body: "Windowsのプライバシー設定で禁止されている可能性があります。",
      steps: [
        "設定 → プライバシーとセキュリティ → カメラ。",
        "アクセス許可がオンか確認。",
        "物理シャッターが閉じていないか確認。"
      ],
      resolvedYes: "dv_success",
      resolvedNo: "dv_contact"
    },
    "dv_success": { type: "end", title: "解決しました", body: "機器が利用できることを確認してください。" },
    "dv_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "ドライバ/故障/設定の確認が必要です。",
      ticketPreset: { category: "周辺機器", urgency: "中", notes: "抜き差し/別ポート/設定確認を実施。改善せず。機器名/型番/症状/時刻を添付。" }
    },

    // =========================================================
    // 端末が遅い / 容量不足（STORAGE）
    // =========================================================
    "s_1": {
      type: "question",
      title: "容量不足の警告が出てる？",
      body: "「ディスクの空き領域が足りません」等の警告が出ていますか？",
      yes: "s_cleanup",
      no: "s_heavy"
    },
    "s_cleanup": {
      type: "action",
      title: "ディスククリーンアップ",
      body: "不要ファイルを削除して空きを増やします。",
      steps: [
        "PC → Cドライブを右クリック →「プロパティ」。",
        "「ディスクのクリーンアップ」。",
        "削除するファイルにチェック → OK。"
      ],
      sources: [
        { title: "Windows で空き領域を増やす (Microsoft)", url: "https://support.microsoft.com/ja-jp/windows/tips-to-improve-pc-performance-in-windows-b3b3ef5b-5953-fb6a-25d4-4a0833b0621f" }
      ],
      resolvedYes: "s_success",
      resolvedNo: "s_contact"
    },
    "s_heavy": {
      type: "action",
      title: "完全シャットダウン→再起動",
      body: "一時不調ならこれで改善することが多いです。",
      steps: [
        "スタート → 電源 →「シャットダウン」。",
        "電源を入れ直し、5分ほど待ってから作業します。",
        "改善しない場合は情シスへ連絡してください。"
      ],
      resolvedYes: "s_success",
      resolvedNo: "s_contact"
    },
    "s_success": { type: "end", title: "解決しました", body: "動作が安定したことを確認してください。" },
    "s_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "機械劣化/ウイルス/メモリ不足などの可能性があります。",
      ticketPreset: { category: "端末動作/容量", urgency: "低", notes: "クリーンアップ/シャットダウンでも改善せず。空き容量目安と症状を添付。" }
    },

    // =========================================================
    // 店舗端末（STORE）
    // =========================================================
    "t_1": {
      type: "question",
      title: "店舗全体に影響？",
      body: "あなたの端末だけではなく、店舗内で複数台に同じ症状がありますか？",
      yes: "t_wide",
      no: "t_2"
    },
    "t_wide": {
      type: "end",
      title: "優先：情シスへ連絡してください",
      body: "店舗全体/複数台に影響する場合は広域障害の可能性があります。",
      ticketPreset: { category: "店舗端末（広域）", urgency: "高", notes: "店舗内で複数台に影響。店舗名/範囲/時刻/機器種別（レジ/秤/ラベル等）を添付。" }
    },
    "t_2": {
      type: "question",
      title: "レジ関連？",
      body: "レジ/釣銭機/決済などの不具合ですか？",
      yes: "t_pos_contact",
      no: "t_3"
    },
    "t_pos_contact": {
      type: "end",
      title: "優先：情シスへ連絡してください",
      body: "業務影響が大きいため優先対応します。",
      ticketPreset: { category: "店舗端末（レジ/決済）", urgency: "高", notes: "レジ関連の不具合。レーン/台数/時刻/エラー画面（写真）を添付。" }
    },
    "t_3": {
      type: "question",
      title: "ラベル/秤/ハンディ？",
      body: "ラベルプリンタ、計量器、ハンディ端末などの不具合ですか？",
      yes: "t_device_contact",
      no: "t_other_contact"
    },
    "t_device_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "機器名・場所・台数を添えて連絡してください。",
      ticketPreset: { category: "店舗端末（周辺機器）", urgency: "中", notes: "ラベル/秤/ハンディ等。機器名/場所/台数/時刻/症状（写真）を添付。" }
    },
    "t_other_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "機器/症状を整理して連絡してください。",
      ticketPreset: { category: "店舗端末（その他）", urgency: "中", notes: "店舗端末の不具合。機器種別/場所/時刻/症状（写真）を添付。" }
    },

    // =========================================================
    // サイバー（CYBER）
    // =========================================================
    "c_1": {
      type: "question",
      title: "身代金/暗号化の兆候はある？",
      body: "「ファイルが開けない」「拡張子が変わった」「身代金要求」等の表示がありますか？",
      yes: "c_ransom_now",
      no: "c_2"
    },
    "c_ransom_now": {
      type: "action",
      title: "【緊急】端末を隔離（最優先）",
      body: "拡散を防ぐため、直ちにネットワークから切り離します。",
      steps: [
        "有線LANなら抜く、Wi-Fiならオフ（最優先）。",
        "電源は切らずにそのまま（調査に必要）。",
        "画面表示を写真で保存。",
        "すぐ情シスへ電話で連絡。"
      ],
      resolvedYes: "c_contact_now",
      resolvedNo: "c_contact_now"
    },
    "c_2": {
      type: "question",
      title: "添付/URLを開いた・入力した？",
      body: "怪しいメールの添付を開いた、またはURL先でパスワード等を入力しましたか？",
      yes: "c_isolation",
      no: "c_phishing"
    },
    "c_isolation": {
      type: "action",
      title: "【緊急】回線遮断",
      body: "感染拡大を防ぐため隔離します。",
      steps: [
        "【最優先】LANを抜く / Wi-Fiをオフ。",
        "電源は切らずにそのまま（調査に必要）。",
        "メール件名/差出人/時刻を控える。",
        "情シスへ電話で連絡。"
      ],
      sources: [
        { title: "マルウェア感染時の初動対応 (JPCERT/CC)", url: "https://www.jpcert.or.jp/at/2022/at220006.html" }
      ],
      resolvedYes: "c_contact_now",
      resolvedNo: "c_contact_now"
    },
    "c_phishing": {
      type: "action",
      title: "報告して削除",
      body: "操作していなければ被害は限定的です。共有して掃除します。",
      steps: [
        "該当メールの件名/差出人/時刻を控える。",
        "可能なら情シスへ転送（通報手段がある場合）。",
        "該当メールを削除します。"
      ],
      sources: [
        { title: "フィッシング詐欺への注意 (IPA)", url: "https://www.ipa.go.jp/security/anshin/caution/phishing.html" }
      ],
      resolvedYes: "c_success",
      resolvedNo: "c_contact"
    },
    "c_contact_now": {
      type: "end",
      title: "至急、情シスに電話してください",
      body: "緊急事態です。隔離した状態で、電話で報告してください。",
      ticketPreset: { category: "サイバー被害の疑い", urgency: "高", notes: "隔離済み（LAN/Wi-Fi遮断）。症状/メール情報/時刻/画面写真あり。" }
    },
    "c_contact": {
      type: "end",
      title: "情シスへ連絡してください",
      body: "調査や設定確認が必要です。",
      ticketPreset: { category: "不審メール/セキュリティ", urgency: "中", notes: "不審メールの可能性。件名/差出人/時刻/操作有無を添付。" }
    },
    "c_success": { type: "end", title: "完了", body: "削除と周知ができたことを確認してください。" },

    // =========================================================
    // DDoS（DDOS）
    // =========================================================
    "d_1": {
      type: "question",
      title: "部署内の全員も重い？",
      body: "あなただけでなく、部署内の複数人が「全サイトが重い/繋がらない」ですか？",
      yes: "d_check",
      no: "d_nw_return"
    },
    "d_check": {
      type: "action",
      title: "情報収集（別回線で確認）",
      body: "広域障害や攻撃、プロバイダ障害の可能性があります。",
      steps: [
        "スマホ等の別回線で「通信障害情報」を確認します。",
        "情シスからの緊急連絡がないか確認します。",
        "範囲/時刻/影響を整理します。"
      ],
      sources: [
        { title: "DDoS攻撃の概要 (CISA/英文)", url: "https://www.cisa.gov/news-events/news/understanding-denial-service-attacks" }
      ],
      resolvedYes: "d_report",
      resolvedNo: "d_report"
    },
    "d_nw_return": {
      type: "action",
      title: "個別トラブルの可能性",
      body: "自分だけの場合は端末/席のネットワーク要因のことがあります。",
      steps: [
        "トップへ戻り「ネットワーク / Wi-Fi」を選んで診断してください。"
      ],
      resolvedYes: "d_success",
      resolvedNo: "n_1"
    },
    "d_report": {
      type: "end",
      title: "情シスへ報告してください",
      body: "広域障害の可能性があります。代表者が情シスへ連絡してください。",
      ticketPreset: { category: "サービス停止/DDoS疑い", urgency: "高", notes: "複数人で全サイト不調。範囲/時刻/影響（業務停止か）を添付。" }
    },
    "d_success": { type: "end", title: "完了", body: "一時的な混雑だった可能性があります。" }
  }
};
