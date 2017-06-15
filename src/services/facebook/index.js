import request from 'request-promise'
import { facebook } from '../../config'

export const getAccessToken = (req, res, next) =>
  request({
    uri: 'https://graph.facebook.com/v2.9/oauth/access_token',
    qs: {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: facebook.clientSecret,
      redirect_uri: req.body.redirectUri
    },
    json: true
  }).then((res) => {
    req.body.access_token = res.access_token
    next()
  }).catch((err) => {
    console.log(err)
    res.status(401).end()
    return null
  })

export const getUser = (accessToken) =>
  request({
    uri: 'https://graph.facebook.com/me',
    json: true,
    qs: {
      access_token: accessToken,
      fields: 'email'
    }
  }).then(({ id, name, email, picture }) => ({
    service: 'facebook',
    picture: picture.data.url,
    id,
    name,
    email
  }))
