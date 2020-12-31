////////////////////////////////////////////////////////////////////////////////

import { StyleSheet } from 'react-native'
import Moment from 'moment-timezone';

////////////////////////////////////////////////////////////////////////////////
export function replaceTitle(str)
{
  var result = str.replace(/\[.+★\]/g, '');// remove poster info
  return result 
}

////////////////////////////////////////////////////////////////////////////////

export const listItemStyles = StyleSheet.create({
  paddingTop: 3,
  paddingBottom: 3,
  paddingLeft: 4,
  paddingRight:4,
  marginTop: 3,
  marginBottom: 3,
  marginLeft: 4,
  marginRight:4,
})

////////////////////////////////////////////////////////////////////////////////
// brand colors taken from
//https://github.com/GeekyAnts/NativeBase/blob/master/src/theme/variables/commonColor.js
export const brandColors = {
  brandInfo: '#62B1F6',
  brandSuccess: '#5cb85c',
  brandDanger: '#d9534f',
  brandWarning: '#f0ad4e',
  brandDark: '#000',
  brandLight: '#a9a9a9',
}

////////////////////////////////////////////////////////////////////////////////
// taken from 2nn.jp
export const categoryColors = {
  "newsplus": '#0E6FB9',
  "mnewsplus": '#E98514',
  "bizplus": '#0DA95C',
  "news4plus": '#E83E2F',
  "news5plus": '#00A1E9',
  "seijinewsplus": '#0E6FB9',
  "moeplus": '#DB0D75', // same
  "idolplus": '#DB0D75', // same
  "scienceplus": '#D0C7B8',
  "femnewsplus": '#D6AE59',
  "dqnplus": '#947EB8',
  "latest": 'gray',
  "today": 'gray',
  "yesterday": 'gray',  
  "week": 'gray',  
  "search": 'gray',
  // setting icon
  "webview_desktop": '#0E6FB9',
  "remove_ads": '#0E6FB9',

}
////////////////////////////////////////////////////////////////////////////////

export function listHeaderStyles(name) {
  color = categoryColors[name]
  return {backgroundColor: color}
}

export function listCategoryStyles(name) {
  color = categoryColors[name]
  return {color: color}
}
////////////////////////////////////////////////////////////////////////////////

export function formatEpoch(epoch) {
  var t = Moment.unix(epoch)
  return Moment.tz(t,'Asia/Tokyo').format('MM/DD HH:mm')
}

export function formatDatetime(datetime) {
  if (!datetime) {
    return ''
  }
  var t = Moment(datetime)
  return Moment.tz(t,'Asia/Tokyo').format('MM/DD HH:mm')
}
////////////////////////////////////////////////////////////////////////////////