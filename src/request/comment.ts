import { CommentsType } from "./type"

const interceptor = (res: Response) => {
  if (res.status === 401) {
    localStorage.clear()
    alert("身份验证失败，请重新登录qwq")
  }
  if (res.status === 200) {
    return res.json()
  }
}

export namespace Comment {
  export const createCommentUrl = (
    username: string,
    repo: string,
    issue_id: number
  ) =>
    `https://api.github.com/repos/${username}/${repo}/issues/${issue_id}/comments?timestamp=${Date.now()}`

  export const getComments = (
    commentUrl: string,
    accessToken: string
  ): Promise<CommentsType> =>
    fetch(commentUrl, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).then(interceptor)

  export const createComment = (
    commentUrl: string,
    content: string,
    accessToken: string
  ) =>
    fetch(commentUrl, {
      method: "POST",
      body: JSON.stringify({
        body: content
      }),
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).then(interceptor)

  export const deleteComment = (commentUrl: string, accessToken: string) =>
    fetch(commentUrl, {
      method: "DELETE",
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).then(interceptor)
}
