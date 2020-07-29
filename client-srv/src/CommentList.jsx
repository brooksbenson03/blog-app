import React from 'react'

const getCommentContent = (comment) => {
  switch (comment.status) {
    case 'pending':
      return 'Comment is pending review'
    case 'rejected':
      return 'This comment has been rejected'
    case 'approved':
      return comment.content
    default:
      return 'Comment is pending review'
  }
}

export default ({ comments }) => {
  const renderedComments = comments.map((c) => (
    <li key={c.id}>{getCommentContent(c)}</li>
  ))
  return <ul>{renderedComments}</ul>
}
