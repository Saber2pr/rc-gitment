import { CommentsType } from "./type"

export const createCommentUrl = (
  username: string,
  repo: string,
  issue_id: number
) =>
  `https://api.github.com/repos/${username}/${repo}/issues/${issue_id}/comments`

export const getComments = (
  username: string,
  repo: string,
  issue_id: number
): Promise<CommentsType> =>
  fetch(createCommentUrl(username, repo, issue_id)).then(res => res.json())
