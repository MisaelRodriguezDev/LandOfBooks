import type { ModuleCss } from "@/types/component"
import styles from "./Button.module.css"

interface ButtonProps extends ModuleCss {
    action: "auth" | "create" | "update" | "delete"
    fn?: () => void
    content: string
    content_loading?: string
    loading?: boolean
    enabled: boolean
}

function Button({action, fn, content, content_loading, loading, enabled, className}: Readonly<ButtonProps>) {
    return (
        <button 
            type={action === "delete" ? "button" : "submit"} 
            {...(fn ? { onClick: fn } : {})}
            className={`${styles.button} ${styles[action]} ${className ?? ''}`}
            {...(loading || !enabled ? {disabled:true} : {})}
        >
            {loading ? content_loading : content}
        </button>
    )
}

export default Button;