import { Container } from '@mui/material'
import BreadCrumb from '../BreadCrumb/BreadCrumb';
import { useLocation } from 'react-router-dom';


function Header() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return (
        <div className='header' style={{ padding: 2, height: '350px', backgroundImage: 'url(/contact.jfif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', position: 'relative' }}>
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%', width: '100%', position: 'absolute' }}>
                <Container maxWidth="lg" style={{ textAlign: 'center', color: '#fff' }}>
                    <h1 style={{ fontSize: '50px', marginTop: '100px' }}>{
                        pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'Home'
                        }</h1>
                    <BreadCrumb />
                </Container>
            </div>
        </div>
    )
}

export default Header
