{
    'use strict';

    // 0埋め関数
    // req integer 番号
    // req integer 桁数
    // res string 0埋めした番号    
    function zeroPadding(no, digit) {
        return ('0'.repeat(digit) + no).slice(-1 * digit);
    }

    // 日付フォーマット(YYMMDDhhmmss)
    // req Date 日付
    // req string 日付区切り文字
    // req string 時間区切り文字
    // res string 年月日時分秒
    function dateFomatYYYYMMDDhhmmss(date, dateDelimiter, timeDelimiter) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = zeroPadding(date.getSeconds(), 2);
        return year + dateDelimiter + month + dateDelimiter + day + " " + hour + timeDelimiter + minute + timeDelimiter + second;
    }

    // 日付フォーマット(YYMMDD)
    // req Date 日付
    // req string 日付区切り文字
    // res string 年月日
    function dateFomatYYYYMMDD(date, yearDelimiter) {
        const year = date.getFullYear();
        const month = zeroPadding(date.getMonth() + 1, 2);
        const day = zeroPadding(date.getDate(), 2);
        return year + yearDelimiter + month + yearDelimiter + day;
    }
    function setlog(text) {
        const log = document.getElementById('log');
        log.innerText += text;
    }
}
