import { formatDateMonth, t } from '@/utils';
import { paymentTransactionApi } from '@/utils/api';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react'

const TransactionsTable = () => {

    const columns = [
        {
            title: t('id'),
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: t('paymentMethod'),
            dataIndex: 'payment_gateway',
            key: 'payment_gateway',
            align: 'center',
        },
        {
            title: t('transactionId'),
            dataIndex: 'order_id',
            key: 'order_id',
            align: 'center',
        },
        {
            title: t('date'),
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
            render: (text) => {
                return (
                    <span> {formatDateMonth(text)}</span>
                )
            }
        },
        {
            title: t('price'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
        },
        {
            title: t('status'),
            dataIndex: 'payment_status',
            key: 'payment_status',
            align: 'center',
            render: (text, record) => {
                let statusClassName = '';

                switch (text) {
                    case 'succeed':
                        statusClassName = 'success_status';
                        break;
                    case 'failed':
                        statusClassName = 'failed_status';
                        break;
                    case 'pending':
                        statusClassName = 'pending_status';
                        break;
                    default:
                        statusClassName = '';
                        break;
                }

                return <span className={statusClassName}>{text}</span>;
            },
        },
    ];
    const [data, setData] = useState([])
    const fetchTransactions = async () => {
        try {
            const res = await paymentTransactionApi.transaction({});
            const { data } = res.data
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])



    const paginationOptions = {
        pageSize: 10,
        showTotal: (total, range) => {
            const activePage = Math.ceil(range[0] / 10);
            const totalPages = Math.ceil(total / 10);
            const startEntry = range[0];
            const endEntry = range[1] > total ? total : range[1];
            return `Showing ${startEntry} to ${endEntry} of ${total} entries`;
        },
    };



    return (
        <Table columns={columns} dataSource={data} className="notif_table" pagination={paginationOptions} />
    )
}

export default TransactionsTable