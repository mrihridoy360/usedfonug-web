import { t } from "@/utils"
import { Modal } from "antd"
import { MdClose } from "react-icons/md"


const ForgotModal = ({ OnHide }) => {
    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>


    return (
        <Modal
            centered
            open={IsSignInWithNumber}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
        >

            <div className="register_modal">
                <div className="reg_modal_header">
                    <h1 className="reg_modal_title">Sign in with Mobile</h1>
                    <p className="signin_redirect">+91 9876543210 <span className="main_signin_redirect">{t('change')}</span></p>
                </div>
                <form className="auth_form">
                    <div className="auth_in_cont">
                        <label htmlFor="otp" className="auth_label">{t('otp')}</label>
                        <input type="number" id="otp" placeholder="Type OTP" className="auth_input" required />
                    </div>
                    <button type="submit" className="verf_email_add_btn auth_otp" >{t('signIn')}</button>
                    <p className="resend_otp">Resend OTP</p>
                </form>
            </div>
        </Modal>
    )
}

export default ForgotModal