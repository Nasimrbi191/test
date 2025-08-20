import { Link, useLocation } from 'react-router-dom';

function BreadCrumb() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return (
        <div style={{display : 'flex' , alignItems: 'center' , justifyContent : 'center' , gap : '10px'}}>
            <ul style={{ display: 'flex', listStyle: 'none', padding: 0 , gap : '10px'}}>
                <li><Link to="/" style={{fontSize: '30px'}}>Home</Link></li>
                <span style={{fontSize: '30px'}}>/</span>
                {pathSegments.map((segment, index) => (
                    <li key={index}><Link  to={`/${pathSegments.slice(0, index + 1).join('/')}`} style={{color : `${index === pathSegments.length - 1 ? '#FF9800' : 'inherit'}`,  fontSize: '30px'}}>{segment}</Link></li>
                ))}
            </ul>
        </div>
    )
}

export default BreadCrumb
