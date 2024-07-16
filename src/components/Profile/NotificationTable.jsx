'use client'
import { Table } from 'antd';
import Image from 'next/image';
import { formatDate, formatDateMonth, placeholderImage, t } from '@/utils';
import { getNotificationList } from '@/utils/api';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const NotificationTable = () => {
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [perPage, setPerPage] = useState(15);

    const fetchNotificationData = async (page) => {

        try {
            const response = await getNotificationList.getNotification({ page });
            const { data } = response.data;
            if (data.error !== true) {
                setNotifications(data.data);
                setTotalPages(data.last_page);
                setTotalItems(data.total);
                setPerPage(data.per_page);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchNotificationData(currentPage);
    }, [currentPage]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const columns = [
        {
            title: t('notification'),
            dataIndex: 'notification',
            key: 'notification',
            width: '70%',
            // align: 'center',
            render: (text, record) => (
                <div className='notif_content_wrp'>
                    <Image
                        src={record.image || placeholderImage}
                        alt="Notification"
                        width={48}
                        height={48}
                        className='notificationImage'
                        onErrorCapture={placeholderImage}
                    />
                    <div className='noti_title_desc'>
                        <h6>{record.title}</h6>
                        <p>{record.notification}</p>
                    </div>
                </div>
            ),
        },
        {
            title: t('date'),
            dataIndex: 'date',
            key: 'date',
            width: '30%',
            align: 'center',
        }
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={notifications.map((notification, index) => ({
                    key: index + 1,
                    image: notification?.image,
                    title: notification.title,
                    notification: notification.message,
                    date: formatDateMonth(notification.created_at),
                }))}
                className="notif_table"
                pagination={
                    notifications.length >= 15 || currentPage != 1
                        ? {
                            current: currentPage,
                            pageSize: perPage,
                            total: totalItems,
                            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total}`,
                            onChange: (page) => setCurrentPage(page),
                            showSizeChanger: false,
                        }
                        : false
                }
                onChange={handleTableChange}
            />
        </>
    );
};

export default NotificationTable;