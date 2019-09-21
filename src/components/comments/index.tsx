import React, { useState, useEffect, useRef } from "react"
import "./style.less"
import { Loading } from "../loading"
import { PreImg } from "../pre-img"
import { Icon } from "../../iconfont"
import { timeDelta } from "../../utils"
import { AccessCode, AccessToken, Comment, User } from "../../request"
import { useForceUpdate } from "../../hooks"

const createCommentsLazy = (
  username: string,
  repo: string,
  issue_id: number,
  access: string,
  refresh: () => void
) =>
  React.lazy(async () => {
    const comments = await Comment.getComments(
      Comment.createCommentUrl(username, repo, issue_id),
      access
    )
    if (!Array.isArray(comments)) {
      refresh()
      return
    }
    const { login: currentLogin } = await User.requestUserInfo(access)
    return {
      default: () => (
        <>
          {comments
            .reverse()
            .map(
              (
                {
                  user: { login, avatar_url, html_url },
                  body,
                  updated_at,
                  url
                },
                i
              ) => {
                const deleteComment = () => {
                  if (confirm(`确定删除此条评论qwq??\n删除内容: ${body}`)) {
                    Comment.deleteComment(url, access).then(refresh)
                  }
                }
                return (
                  <dd key={body + i}>
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <a href={html_url}>
                              <PreImg
                                className="Comments-Head"
                                src={avatar_url}
                                fallback={<Icon.Head />}
                              />
                            </a>
                          </td>
                          <td>
                            <ul className="Comments-Ul">
                              <li>{login}</li>
                              <li>
                                <span className="Comments-Text">{body}</span>
                                {currentLogin === login && (
                                  <span
                                    className="Comments-Delete"
                                    onClick={deleteComment}
                                  >
                                    <Icon.Delete />
                                  </span>
                                )}
                              </li>
                              <li className="Comments-Time">
                                <span>
                                  {timeDelta(
                                    new Date().toISOString(),
                                    updated_at
                                  )}
                                </span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </dd>
                )
              }
            )}
        </>
      )
    }
  })

const Login = ({
  client_id,
  client_secret
}: {
  client_id: string
  client_secret: string
}) => {
  const init = (
    <dl>
      <dt>登录后查看内容</dt>
      <dd>
        <button
          className="Comments-Form-Button"
          onClick={() => (location.href = code_url)}
        >
          登录
        </button>
      </dd>
    </dl>
  )
  const wait = (
    <div>
      正在身份认证
      <Loading />
    </div>
  )

  const [com, display] = useState(init)

  const code_url = AccessCode.createCodeUrl(client_id)
  const code = AccessCode.getCode()
  useEffect(() => {
    if (code) {
      display(wait)
      const accessUrl = AccessToken.createAccessTokenUrl(
        code,
        client_id,
        client_secret
      )
      AccessToken.getAccessToken(accessUrl).then(access_token => {
        AccessToken.saveAccessToken(access_token)
        location.reload()
      })
    }
  }, [code])

  return com
}

export interface Comments {
  username: string
  repo: string
  client_id: string
  client_secret: string
  issue_id?: number
}

const useSubmit = (
  username: string,
  repo: string,
  issue_id: number,
  refresh: () => void
): [
  React.MutableRefObject<HTMLInputElement>,
  (event: React.FormEvent<HTMLFormElement>) => void
] => {
  const input_ref = useRef<HTMLInputElement>()
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (input_ref.current.value === "") {
      alert("内容不能为空！qwq")
      return
    }
    const access_token = localStorage.getItem("access_token")
    const commentUrl = Comment.createCommentUrl(username, repo, issue_id)
    Comment.createComment(
      commentUrl,
      input_ref.current.value,
      access_token
    ).then(() => {
      refresh()
      input_ref.current.value = ""
    })
  }
  return [input_ref, submit]
}

export const Comments = ({
  username,
  repo,
  client_id,
  client_secret,
  issue_id = 1
}: Comments) => {
  const forceUpdate = useForceUpdate()
  const [input_ref, submit] = useSubmit(username, repo, issue_id, forceUpdate)
  const access = AccessToken.checkAccess()
  const CommentsLazy = createCommentsLazy(
    username,
    repo,
    issue_id,
    access,
    forceUpdate
  )
  return (
    <dl className="Comments">
      <dt>
        <strong className="Comments-Title">留言</strong>
        <form className="Comments-Form" onSubmit={submit}>
          <input type="text" className="Comments-Form-Input" ref={input_ref} />
          <button className="Comments-Form-Button">发送</button>
        </form>
      </dt>
      {access ? (
        <React.Suspense fallback={<Loading />}>
          <CommentsLazy />
        </React.Suspense>
      ) : (
        <Login client_id={client_id} client_secret={client_secret} />
      )}
    </dl>
  )
}
