export default function DownloadResume() {
     return (
        <a
            href='Resume.pdf'
            download="Resume - Matthew Bratrsovsky.pdf"
            style={{
                color: 'white',
                textDecoration: 'none',
                backgroundColor: '#2c3e50',
                padding: '1rem 0.5rem',
                marginRight: '5%',
                marginLeft: 'auto',
                textAlign: 'right',
            }}
        >
            Download Resume
        </a>
     )
}