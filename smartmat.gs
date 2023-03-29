function fetchJSONData() {

  const postdata = {
    'email': '', // ID
    'password': '' // Password
  }

  const loginUrl = 'https://lite.smartmat.io/api/bff/v1/signin'; // ログインURL
  const dataUrl = 'https://lite.smartmat.io/api/bff/v1/subscription/search_detail?subscriptionId=XXXX'; // データURL
  const sheet_id = '';  // SpreadSheetID
  const sheet_name = ''; // SpreadSheetName

  const options = {
    'method': 'post',
    'Content-Type': 'application/json',
    'payload': JSON.stringify(postdata),
    'followRedirects': false
  }

  // ログインページにPOSTリクエストを送信して、Cookieを取得する
  const response = UrlFetchApp.fetch(loginUrl, options);
  const headers = response.getHeaders();
  const cookie = headers['Set-Cookie'];

  // Cookieを使用して、JSONデータを取得する
  const jsonData = UrlFetchApp.fetch(dataUrl, {
    'headers': {
      'Cookie': cookie
    }
  }).getContentText();

  // JSONデータを解析する
  const parsedData = JSON.parse(jsonData);

  // スマートマットがWi-Fiに接続されている場合: true → 1、切断されている場合: false → 0
  let connect = 0;
  if (parsedData['isConnected']) {
    connect = 1;
  }
  
  // JSONデータをSpreadSheetに出力する
  const MySheet = SpreadsheetApp.openById(sheet_id);
  MySheet.getSheetByName(sheet_name).appendRow(
    [new Date(), connect, parsedData['battery'], parsedData['remainingPercent']]
  );
}
