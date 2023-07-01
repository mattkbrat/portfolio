export default function DownloadResume() {
     return (
        <a
            href='Resume.pdf'
            download="Resume - Matthew Bratrsovsky.pdf"
            style={{
                color: 'white',
                textDecoration: 'none',
                backgroundColor: '#2c3e50',
                padding: '10px 20px',
                marginRight: '4rem',
            }}
        >
            Download Resume
        </a>
     )
}