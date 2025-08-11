import { useRef } from "react";
import { Link } from "react-router-dom";
import { type SubmitHandler, useForm, useWatch  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFormData, loginSchema } from "@/schemas/auth";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import ReCaptchaField from "@/components/Recaptcha/Recaptcha";
import type { ReCaptchaFieldHandle } from "@/components/Recaptcha/Recaptcha";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css"
import login_styles from "./Login.module.css"
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import { useAuth } from "@/context/AuthProvider";
import ErrorNotification from "@/components/ui/Notifications/Error";

function LoginPage() {
    const {login, loading, error} = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        control,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
        criteriaMode: 'all',
    });

    const recaptchaRef = useRef<ReCaptchaFieldHandle>(null);
    const values = useWatch({ control });
    const requiredFields = [
        "username",
        "password",
        "recaptcha"
    ];
    
    const enabled = useButtonEnablement(values, errors, requiredFields)


    async function onSubmit(data: LoginFormData): Promise<SubmitHandler<LoginFormData> | undefined> {
        try {
            if (!data.recaptcha) {;
                await recaptchaRef.current?.execute();
                return;
            }
            login(data)
            recaptchaRef.current?.reset();
        } catch (error) {
            console.log(error)
        } 
    }

    return (
            <div className={styles.container}>
            { error && <ErrorNotification message={error} />}
            <div className={styles.form_container}>
                <h2>Iniciar Sesión</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <FormField<LoginFormData>
                        label='Usuario'
                        id="username"
                        type="text"
                        register={register}
                        error={errors.username}
                    />

                    <FormField<LoginFormData>
                        label='Contraseña'
                        id='password'
                        type='password'
                        register={register}
                        error={errors.password}
                    />

                    <ReCaptchaField<LoginFormData>
                        ref={recaptchaRef}
                        name="recaptcha"
                        setValue={setValue}
                        trigger={trigger}
                        errors={errors.recaptcha}
                    />
                    <div className={styles.button_container}>
                        <Button
                            action="auth"
                            content="Iniciar sesión"
                            content_loading="Ingresando..."
                            loading={loading}
                            enabled={enabled}
                        />
                    </div>

                </AppForm>
                <div>
                    <a href="forgot-password" className={styles.link}>¿Olvidaste tu contraseña?</a>
                </div>
                <div className={login_styles.divider}>
                    <p>o</p>
                </div>
                <div>
                    <p className={styles.text}>¿No tienes una cuenta? <Link className={styles.link} to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
            </div>
    )
}

export default LoginPage;