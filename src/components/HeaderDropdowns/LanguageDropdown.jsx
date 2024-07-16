
import { Dropdown } from 'antd';
import Image from 'next/image';
import { placeholderImage } from '@/utils';
import { IoMdArrowDropdown } from "react-icons/io";

const LanguageDropdown = ({ setSelectedLanguage, selectedLanguage, getLanguageData, settings }) => {

    const languages = settings && settings?.languages
    const handleLanguageSelect = (prop) => {
        const lang = languages?.find(item => item.id === Number(prop.key))
        setSelectedLanguage(lang);
        getLanguageData(lang?.code)
    };
    const items = languages && languages.map(lang => ({
        label: (
            <span className="lang_options">
                <Image src={lang?.image ? lang?.image : settings?.placeholder_image} alt={lang.name} width={20} height={20} className="mr-2 lang_icon" onErrorCapture={placeholderImage} />
                <span>{lang.code}</span>
            </span>
        ),
        key: lang.id,
    }));

    const menuProps = {
        items,
        onClick: handleLanguageSelect,
    };

    return (

        <Dropdown menu={menuProps} className='language_dropdown' overlayClassName='lang_dropdown'>
            <span className="d-flex align-items-center">
                <Image src={selectedLanguage?.image ? selectedLanguage?.image : settings?.placeholder_image} alt={selectedLanguage?.name} width={20} height={20} className="mr-2 lang_icon" onErrorCapture={placeholderImage} />
                <span>{selectedLanguage?.code}</span>
                <span>{languages?.length > 1 ? <IoMdArrowDropdown /> : <></>}</span>
            </span>
        </Dropdown >
    )
}

export default LanguageDropdown;