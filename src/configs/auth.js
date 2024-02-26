export default {
  meEndpoint: '/api/auth_me',
  userMeEndpoint: '/api/user_auth_me',
  loginEndpoint: '/api/login',
  urlLoginEndpoint: '/api/qr_token_validation',
  
  lormoonVideoFeedUrl:'https://lormoon.nkstec.ac.th/camerastream/video_feed',
  lormoonApiUrl:'https://lormoon.nkstec.ac.th/camerastream/',

  //lormoonVideoFeedUrl:'http://192.168.72.3:5000/video_feed',
  //lormoonApiUrl:'http://192.168.72.3:5000/',

  //loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'logout' // logout | refreshToken
}
