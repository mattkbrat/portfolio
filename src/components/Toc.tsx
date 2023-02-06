import styles from './Toc.css'

export const Toc = ({children}: {children: any}) => {
    return (
        <div class='table-of-contents'>
            {children}
        </div>
    )
}