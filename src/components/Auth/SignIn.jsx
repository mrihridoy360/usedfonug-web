import { Modal } from "antd"
import Image from "next/image"
import SignInWithEmail from "./SignInWithEmail"
import SignInWithMobile from "./SignInWithMobile"
import { placeholderImage } from "@/utils"
import { MdClose } from "react-icons/md"

const SignIn = ({ IsSignInWithEmailOpen, OnHide, IsSignInWithEmail }) => {

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>

    return (
        <Modal
            centered
            open={IsSignInWithEmailOpen}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
        >
            {
                IsSignInWithEmail ? <SignInWithEmail /> : <SignInWithMobile />
            }
        </Modal>
    )
}

export default SignIn