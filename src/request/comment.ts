import { CommentsType } from "./type"

export namespace Comment {
  export const createCommentUrl = (
    username: string,
    repo: string,
    issue_id: number,
    access: string
  ) =>
    `https://api.github.com/repos/${username}/${repo}/issues/${issue_id}/comments?access_token=${access}`

  export const getComments = (commentUrl: string): Promise<CommentsType> =>
    fetch(commentUrl).then(res => res.json())

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
    }).then(res => res.json())
}
