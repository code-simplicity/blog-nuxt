import http from './http';

// const baseUrl = 'http://172.30.50.4:8081';
const baseUrl = 'http://localhost:8081';

export const success_code = 20000;

export const getAdminInfo = () => {
  if (process.client) {
    return http.requestGet('/user/user_info/814094654977867776');
  } else {
    return http.requestGet(baseUrl + '/user/user_info/814094654977867776');
  }
};

export const getCategories = () => {
  if (process.client) {
    return http.requestGet('/portal/article/categories');
  } else {
    return http.requestGet(baseUrl + '/portal/article/categories');
  }
};

export const getLoops = () => {
  if (process.client) {
    return http.requestGet('/portal/web_size_info/loop');
  } else {
    return http.requestGet(baseUrl + '/portal/web_size_info/loop');
  }
};

export const getTopArticle = () => {
  if (process.client) {
    return http.requestGet('/portal/article/top');
  } else {
    return http.requestGet(baseUrl + '/portal/article/top');
  }
};

export const getTopComments = () => {
  if (process.client) {
    return http.requestGet('/portal/comment/top');
  } else {
    return http.requestGet(baseUrl + '/portal/comment/top');
  }
};

export const getLabels = (count) => {
  return http.requestGet('/portal/article/label/' + count);
};

export const getArticles = (categoryId, page, size) => {
  if (categoryId !== '') {
    return http.requestGet('/portal/article/list/' + categoryId + '/' + page + '/' + size);
  }
  if (process.client) {
    //客户端
    return http.requestGet('/portal/article/list/' + page + '/' + size);
  } else {
    //服务端
    return http.requestGet(baseUrl + '/portal/article/list/' + page + '/' + size);
  }
};

export const getTaobaoRecommend = (size) => {
  return http.requestGet("/shop/recommend/random/" + size);
};

export const getLinkList = () => {
  if (process.client) {
    return http.requestGet("/portal/web_size_info/friend_link");
  } else {
    return http.requestGet(baseUrl + "/portal/web_size_info/friend_link");
  }
};

export const getSearchContent = (categoryId, keyword,
  page,
  size,
  sort) => {
  // console.log(categoryId);
  // console.log(keyword);
  // console.log(page);
  // console.log(sort);
  return http.requestGet(baseUrl + "/portal/search?keyword=" + encodeURIComponent(keyword) +
    "&page=" + page + "&size=" +
    size + "&categoryId=" + categoryId +
    "&sort=" + sort);
};

export const getLoginQrCode = () => {
  return http.requestGet("/user/pc-login-qr-code");
};

export const doLogin = (verifyCode, sobUser) => {
  return http.requestPost('/user/login/' + verifyCode + '/?from=_p', sobUser);
};

export const checkToken = () => {
  return http.requestGet('/user/check-token');
};

export const doLogout = () => {
  return http.requestGet('/user/logout');
};

export const checkScanLoginState = (loginId) => {
  return http.requestGet('/user/qr-code-state/' + loginId);
};

export const checkUserName = (userName) => {
  return http.requestGet('/user/user_name?userName=' + userName);
};

export const updateUserInfo = (sobUser, userId) => {
  return http.requestPut('/user/user_info/' + userId, sobUser);
};

export const sendEmailCode = (captchaCode, email, type) => {
  return http.requestGet('/user/verify_code?captchaCode=' + captchaCode +
    '&email=' + email +
    '&type=' + type);
};

export const registerUser = (captcha_code, email_code, sobUser) => {
  return http.requestPost('/user/join_in/?captcha_code=' + captcha_code +
    '&email_code=' + email_code, sobUser);
};

export const checkVerifyCode = (captchaCode, email, emailCode) => {
  return http.requestGet('/user/check_email_code?captchaCode=' + captchaCode +
    '&email=' +
    email +
    '&emailCode=' +
    emailCode);
};

export const updatePassword = (verifyCode, sobUser) => {
  return http.requestPut('/user/password/' + verifyCode, sobUser);
};

export const getArticleDetailById = (articleId) => {
  return http.requestGet(baseUrl + '/portal/article/' + articleId);
};

export const getRecommendArticle = (articleId, size) => {
  return http.requestGet(baseUrl + '/portal/article/recommend/' + articleId + '/' + size);
};

export const postComment = (articleComment) => {
  return http.requestPost('/portal/comment', articleComment);
};

export const getCommentsByArticleId = (articleId, page, size) => {
  if (process.client) {
    return http.requestGet("/portal/comment/list/" + articleId + "/" + page + "/" + size);
  } else {
    return http.requestGet(baseUrl + "/portal/comment/list/" + articleId + "/" + page + "/" + size);
  }
};

export const getUserInfo = (userId) => {
  if (process.client) {
    return http.requestGet("/user/user_info/" + userId);
  } else {
    return http.requestGet(baseUrl + "/user/user_info/" + userId);
  }
};

export const updateEmailAddress = (emailAddress, verifyCode) => {
  if (process.client) {
    return http.requestPut("/user/email?email=" + emailAddress + '&verify_code=' + verifyCode);
  } else {
    return http.requestPut(baseUrl + "/user/email?email=" + emailAddress + '&verify_code=' + verifyCode);
  }

};

export const getUserInfoByToken = () => {
  if (process.client) {
    return http.requestGet("/user/check-token")
  } else {
    return http.requestGet(baseUrl + "/user/check-token")
  }
};

//http://localhost:8080/portal/newCommentReply/list/1/10
export const getNewCommentReplyList = (page, size) => {
  if (process.client) {
    return http.requestGet('/portal/newCommentReply/list/' + page + '/' + size)
  } else {
    return http.requestGet(baseUrl + '/portal/newCommentReply/list/' + page + '/' + size)
  }
};

export const postNewCommentReply = (newCommentReply) => {
  return http.requestPost('/portal/newCommentReply', newCommentReply);
};

//http://localhost:8080/portal/newComment/list/809056515137732608/1/10
export const getNewCommentsByArticleId = (articleId, page, size) => {
  if (process.client) {
    return http.requestGet('/portal/newComment/list/' + articleId + '/' + page + '/' + size)
  } else {
    return http.requestGet(baseUrl + '/portal/newComment/list/' + articleId + '/' + page + '/' + size)
  }

}

export const postNewComment = (newComment) => {
  return http.requestPost('/portal/newComment', newComment);
};


export const postMessage = (message) => {
  return http.requestPost("/portal/message", message)
};

export const postMessageReply = (messageReply) => {
  return http.requestPost("/portal/messageReply", messageReply)
};

//获取留言内容
export const getMessageList = (page, size) => {
  if (process.client) {
    return http.requestGet('/portal/message/list/' + page + '/' + size)
  } else {
    return http.requestGet(baseUrl + '/portal/message/list/' + page + '/' + size)
  }
};

//http://localhost:8080/portal/message/count
export const getMessageCounts = () => {
  return http.requestGet('/portal/message/count');
}

//http://localhost:8080/portal/messageReply/count
export const getMessageReplyCount = () => {
  return http.requestGet('/portal/messageReply/count');
}

//http://localhost:8080/portal/messageReply/list/1/10
export const getMessageReplyList = (page, size) => {
  if (process.client) {
    return http.requestGet('/portal/messageReply/list/' + page + '/' + size)
  } else {
    return http.requestGet(baseUrl + '/portal/messageReply/list/' + page + '/' + size)
  }
}
