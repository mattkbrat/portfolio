async function downloadFile(url: string, filename: string) {
    console.log('Downloading file: ' + filename);
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
 }

export default function DownloadResume() {
     return (
        <a
            href='Resume.pdf'
            download="Resume - Matthew Bratrsovsky.pdf"
        >
            Download Resume
        </a>
     )
}