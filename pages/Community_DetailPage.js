// Community_DetailPage.js
import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios'; // axios 추가
import './Community_DetailPage.css';
import Icon from '../components/Icon.js';

const CommunityDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {id, title, content, nickname, viewCnt, thumbnail, commentCnt, writer_location, createdAt} = location.state;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const handleSubmitComment = async () => {
    try {
      // 서버에 댓글 제출
      const response = await axios.post(`http://localhost:8080/boards/${id}/comment`, {
        content: comment,
      });

      // 제출된 댓글을 댓글 목록에 추가
      const newCommentData = response.data;
      setComments(newCommentData.content);

      // 댓글 작성 완료 후 입력 필드 초기화
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  // 댓글 수정
  const handleDeleteComment = async (commentId) => {
    try {
      // 서버에 댓글 삭제 요청
      const response = await axios.delete(
          `http://localhost:8080/boards/${id}/comment/${commentId}?page=${currentPage}`,
      );

      // 삭제된 댓글을 댓글 목록에서 제외
      const deletedCommentData = response.data;
      setComments(deletedCommentData.content);
    } catch (error) {
      console.error(error);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId, editedContent) => {
    try {
      // 서버에 댓글 수정 요청
      const response = await axios.post(
          `http://localhost:8080/boards/${id}/comment/${commentId}?page=${currentPage}`,
          {
            content: editedContent,
          },
      );

      // 수정된 댓글을 댓글 목록에 반영
      const updatedCommentData = response.data;
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? updatedCommentData.content : comment,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 페이지 로딩 시 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentResponse = await axios.get(
            `http://localhost:8080/boards/${id}/comment?page=${currentPage}`,
        );
        const commentData = commentResponse.data;
        setComments(commentData.content);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [id, currentPage]);

  // 시간을 이쁘게 보여주기
  const TimeParse = (props) => {
    const date = new Date(props.date);
    let stringDate = null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    stringDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;

    return (
      <div className="community-time">
        <span>{stringDate}</span>
      </div>
    );
  };

  return (
    <div className='community-detailpage'>
      <div className='community-post'>
        <h1 className='community-post-title'>{title}</h1>
        <div className='community-info-bar'>
          <div className='community-user'>
            <img className='community-user-profile' src={thumbnail} /> {nickname}
          </div>
          <div className='community-post-info'>
            <p className='community-post-info-view'>조회수 {viewCnt+1}</p>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <p className='community-post-info-comment'>댓글수 {comments.length}</p>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <TimeParse date={createdAt} />
          </div>
        </div>
        <p className='community-post-content'>{content}</p>
      </div>

      <div className="comment-container">
        <textarea
          className="response-textfield"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // 엔터 키 기본 동작 방지
              handleSubmitComment();
            }
          }}
        ></textarea>&nbsp;&nbsp;
        <button className="submit-comment-button" onClick={handleSubmitComment}>
          등록
        </button>
      </div>

      {/* 댓글 목록 표시 */}
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-user">
              <img src={comment.thumbnail} alt={comment.nickname} />
              <p>{comment.nickname}</p>
            </div>
            <div className="comment-content">
              <p>{comment.content}</p>
              <TimeParse date={comment.createdAt} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityDetailPage;
