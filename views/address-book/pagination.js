// 處理頁碼按鈕
        (function(page, totalPages, prevNum){
            let pages = []; // 頁數陣列
            // 總頁數 小於或等於 頁碼*2+1
            if(totalPages <= prevNum*2+1){
                for(let i=1; i<=totalPages; i++){
                    //將頁碼
                    pages.push(i);
                }
            } else {
                const fAr = [], bAr = [];
                // 從前面開始數
                for(let i=page-prevNum; i<=totalPages; i++){
                    if(i>=1){
                        fAr.push(i);
                    }
                    if(fAr.length >= prevNum*2+1) break;
                }
                // 從後面開始數
                for(let i=page+prevNum; i>=1; i--){
                    if(i<=totalPages){
                        bAr.unshift(i);
                    }
                    if(bAr.length >= prevNum*2+1) break;
                }
                pages = fAr.length > bAr.length ? fAr : bAr;
            }
            output.pages = pages;
        })(page, output.totalPages, 3);

        // 處理頁碼按鈕 2           //total btn
        (function(page, totalPages, prevNum){
            let beginPage, endPage;
            if(totalPages <= prevNum*2+1){
                beginPage = 1;
                endPage = totalPages;
            } else if(page-1 < prevNum) {
                beginPage = 1;
                endPage = prevNum*2+1;
            } else if(totalPages-page < prevNum) {
                beginPage = totalPages-(prevNum*2+1);
                endPage = totalPages;
            } else {
                beginPage = page-prevNum;
                endPage = page+prevNum;
            }
            output.beginPage = beginPage;
            output.endPage = endPage;
        })(page, output.totalPages, 3);
