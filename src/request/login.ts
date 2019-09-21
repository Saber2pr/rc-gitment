import { parseUrlParam } from "../utils"
import { UserInfoType } from "./type"
const localStore = localStorage

export namespace AccessCode {
  export const createCodeUrl = (client_id: string) =>
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=public_repo`

  export const getCode = (): string => {
    const url = location.href
    const param = parseUrlParam(url)
    return param["code"]
  }
}

export namespace User {
  export const requestUserInfo = (accessToken: string): Promise<UserInfoType> =>
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).then(res => res.json())
}

export namespace AccessToken {
  export const createAccessTokenUrl = (
    code: string,
    client_id: string,
    client_secret: string
  ) =>
    `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`

  export const getAccessToken = (accessTokenUrl: string): Promise<string> => {
    const access_token = localStore.getItem("access_token")
    return access_token
      ? Promise.resolve(access_token)
      : fetch(accessTokenUrl).then(res => res.text())
  }

  export const checkAccess = (): string => {
    return localStore.getItem("access_token")
  }

  export const saveAccessToken = (access_token: string) => {
    localStore.setItem(
      "access_token",
      parseUrlParam("?" + access_token)["access_token"]
    )
  }
}
