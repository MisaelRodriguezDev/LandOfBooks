import type { FormEventHandler, ReactNode } from "react"
import type { ModuleCss } from "@/types/component";
import styles from "./Form.module.css"

interface Props extends ModuleCss {
  children: ReactNode;
  parentMethod: FormEventHandler
}

function AppForm ({ children, parentMethod, className }: Readonly<Props>) {

  return (
    <form onSubmit={parentMethod} className={`${styles.form} ${className ?? ''}`}>
      {children}
    </form>
  )
}

export default AppForm