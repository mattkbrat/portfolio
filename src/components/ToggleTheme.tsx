import { useEffect, useState } from "preact/hooks";

export default function ToggleTheme(){
    const theme = localStorage.getItem('theme');
    const [themeState, setThemeState] = useState(theme);

    useEffect(() => {
        if(themeState === 'dark'){
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [themeState]);

    const toggleTheme = () => {
        console.log(themeState);
        if(themeState === 'dark'){
            localStorage.setItem('theme', 'light');
            setThemeState('light');
        } else {
            localStorage.setItem('theme', 'dark');
            setThemeState('dark');
        }
    }

    return (
        <button onClick={toggleTheme}>
            {themeState === 'dark' ? 'Light' : 'Dark'}
        </button>
    )
}