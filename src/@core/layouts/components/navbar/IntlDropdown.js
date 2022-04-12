// ** Third Party Components
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation()

  // ** Vars
  const langObj = {
    en: 'English',
    cn: 'Chinese',
    de: 'German'
  }

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
  }

  useEffect(() => {
  }, [])

  return (
    <UncontrolledDropdown tag='li' className='dropdown-language nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link' onClick={e => e.preventDefault()}>
        <img src={`/assets/data/${i18n.language === 'en' ? 'us' : i18n.language}.svg`} style={{ height: '20px', width: '20px' }} />
        <span className='selected-language pl-1'>{langObj[i18n.language]}</span>
      </DropdownToggle>
      <DropdownMenu className='mt-0' end>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'en')}>
          <img src="/assets/data/us.svg" style={{ height: '20px', width: '20px' }} />
          <span className='ml-1'>English</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'cn')}>
          <img src="/assets/data/cn.svg" style={{ height: '20px', width: '20px' }} />
          <span className='ml-1'>Chinese</span>
        </DropdownItem>
        <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'de')}>
          <img src="/assets/data/de.svg" style={{ height: '20px', width: '20px' }} />
          <span className='ml-1'>German</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
