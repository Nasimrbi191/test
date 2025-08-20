import { Box, Container, Typography } from '@mui/material'
import '../../styles/HeroSection.scss'

function HeroSection() {
    return (
        <Box sx={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#f5f5f5', marginTop: '90px' }}>
            <Container maxWidth="lg" className='hero-container'>
                <div className='hero-wrapper'>
                    <img src='/computer@2x.png' style={{ width: '40%', height: 'auto' }} />
                    <div style={{ maxWidth: '600px' }}>
                        <div>
                            <h1 style={{ fontWeight: '700', fontSize: '40px' }}>About Our Compony</h1>
                            <Typography style={{
                                fontSize: '20px', fontWeight: '500',
                                textAlign: 'justify'
                            }}>
                                We are a team of talented designers making websites with Bootstrap
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Typography>
                        </div>
                        <button>Learn More</button>
                    </div>
                </div>
            </Container>
        </Box>
    )
}

export default HeroSection
