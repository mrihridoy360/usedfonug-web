'use client'
const { Modal, Radio } = require("antd")
import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { t } from '@/utils'
import { addReportReasonApi, getReportReasonsApi } from '@/utils/api'
import toast from 'react-hot-toast'


const ReportModal = ({ isReportModal, OnHide, itemID, setIsReported }) => {
    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>
    const [value, setValue] = useState(null);
    const [reasons, setReasons] = useState([]);
    const [customReason, setCustomReason] = useState('');

    const onChange = (e) => {
        setValue(e.target.value);
        if (e.target.value !== 'other') {
            setCustomReason('');  // Clear custom reason if "Other" is deselected
        }
    };

    const fetchReportData = async () => {
        try {
            const response = await getReportReasonsApi.reportReasons({})
            const { data } = response?.data
            setReasons(data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isReportModal) {
            fetchReportData()
        }
    }, [isReportModal])

    const handleReport = async (e) => {
        e.preventDefault()
        try {
            const response = await addReportReasonApi.addReport({
                item_id: itemID,
                report_reason_id: value === "other" ? "" : value,
                other_message: customReason
            })
            toast.success(response?.data?.message)
            setIsReported(true)
            OnHide()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal
            centered
            open={isReportModal}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
        >
            <div className='report_modal'>
                <h5 className='head_loc'>{t('report')}</h5>
                <Radio.Group className='radio_group' onChange={onChange} value={value}>
                    {reasons && reasons.map((reason) => (
                        <Radio
                            key={reason.id}
                            className={`radio_btn ${value === reason.id ? 'selected' : ''}`}
                            value={reason.id}
                        >
                            {reason?.reason}
                        </Radio>
                    ))}
                    <Radio
                        key='other'
                        className={`radio_btn ${value === 'other' ? 'selected' : ''}`}
                        value='other'
                    >
                        {t('other')}
                    </Radio>
                </Radio.Group>
                {value === 'other' && (
                    <div className="reasonInput">
                        <span>{t("reason")}</span>
                        <input
                            type='text'
                            className='custom_reason_input'
                            placeholder={t("writereason")}
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                        />
                    </div>
                )}
                <div className='report_btns'>
                    <button className='cancel_button' onClick={OnHide}>{t('cancel')}</button>
                    <button className='follow_button' onClick={handleReport}>{t('report')}</button>
                </div>
            </div>
        </Modal>
    )
}

export default ReportModal
