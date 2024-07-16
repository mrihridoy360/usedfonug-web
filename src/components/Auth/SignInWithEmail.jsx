import { t } from "@/utils"
import { Modal } from "antd"
import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { MdClose } from "react-icons/md"


const SignInWithEmail = ({ IsSignInWithEmail, OnHide }) => {

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>

    const [IsPasswordVisible, setIsPasswordVisible] = useState(false)
    const togglePasswordVisible = () => {
        setIsPasswordVisible((prev) => !prev)
    }

    const handleShowLoginPassword = () => {

    }
    return (
        <Modal
            centered
            open={IsSignInWithEmail}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
        >

            <div className="register_modal">
                <div className="reg_modal_header">
                    <h1 className="reg_modal_title">{t('signInWithEmail')}</h1>
                    <p className="signin_redirect">demouser@eclassify.com <span className="main_signin_redirect" onClick={handleShowLoginPassword}>{t('change')}</span></p>
                </div>
                <form className="auth_form">
                    <div className="auth_in_cont">
                        <label htmlFor="password" className="auth_label">{t('password')}</label>
                        <div className="password_cont">
                            <input type={IsPasswordVisible ? "text" : "password"} id="password" placeholder={t("typePassword")} className="auth_input w-100" required />
                            {
                                IsPasswordVisible ? <FaRegEye className="pass_eye" onClick={togglePasswordVisible} /> : <FaRegEyeSlash className="pass_eye" onClick={togglePasswordVisible} />
                            }
                        </div>

                    </div>
                    <p className="frgt_pass">Forgot Password ?</p>
                    <button type="submit" className="verf_email_add_btn auth_sign_in_btn" >{t('signIn')}</button>
                </form>
            </div>
        </Modal>
    )
}

export default SignInWithEmail