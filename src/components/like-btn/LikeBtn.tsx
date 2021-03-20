import React from 'react';
import { Icon } from 'semantic-ui-react';
import './LikeBtnStyles.scss';
interface props {
    liked: boolean;
    onClick?: () => void;
}
const LikeBtn: React.FC<props> = function ({ liked, onClick }) {
    return (
        <div className="like-btn" onClick={onClick} style={{ cursor: 'pointer' }}>
            {!liked ? <Icon className="heart outline" /> : <Icon className="heart" />}
            {!liked ? <p>Like</p> : <p>Unlike</p>}
        </div>
    );
};

export default LikeBtn;
