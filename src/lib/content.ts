import { renderMermaidSVG, THEMES } from "beautiful-mermaid";

export async function getMermaid(path: string, astroUrl: string) {
    const url = URL.parse(path, astroUrl);
    if (!url) return null;
    return fetch(url).then(async (r) => {
        if (!r.ok) return;
        const t = await r.text();
        return renderMermaidSVG(t, THEMES['catppuccin-latte']);
    });
}
