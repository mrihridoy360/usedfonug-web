'use client'
import Image from 'next/image'
import user from '../../../public/assets/classified_Image2.svg'
import { placeholderImage } from '@/utils'

const UserSellerChatTab = ({ isActive, chat, handleChatTabClick }) => {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };
    return (
        // Pass the chat ID to the handler
        <div className="chat_user_tab_wrapper" onClick={() => handleChatTabClick(chat)}>
            <div className={`chat_user_tab ${isActive && 'chat_user_tab_active'}`}>
                <div className="user_name_img">
                    <div className="user_chat_tab_img_cont">
                        <Image src={chat?.item?.image ? chat?.item?.image : placeholderImage} alt="User" width={56} height={56} className="user_chat_tab_img" onErrorCapture={placeholderImage} />
                        <Image src={chat?.buyer?.profile ? chat?.buyer?.profile : placeholderImage} alt="User" width={24} height={24} className="user_chat_small_img" onErrorCapture={placeholderImage} />
                    </div>
                    <div className="user_det">
                        <h6>{chat?.buyer?.name}</h6>
                    </div>
                </div>
                <p className="user_chat_tab_time">{formatTime(chat?.created_at)}</p>
            </div>
        </div>
    )
}

export default UserSellerChatTab