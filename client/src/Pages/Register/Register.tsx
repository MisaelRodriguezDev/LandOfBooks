import { useRef } from "react";
import { type SubmitHandler, useForm, useWatch  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterFormData, registerSchema } from "../../schemas/auth";
import AppForm from "../../components/ui/Form/Form";
import FormField from "../../components/ui/Input/Input";
import ReCaptchaField from "../../components/Recaptcha/Recaptcha";
import type { ReCaptchaFieldHandle } from "../../components/Recaptcha/Recaptcha";
import Button from "../../components/ui/Button/Button";
import styles from "../../styles/Form.module.css"
import register_styles from "./Register.module.css"
import { useButtonEnablement } from "../../hooks/useButtonEnablement";
import { useAuth } from "../../context/AuthProvider";

function RegisterPage() {
    const {signup, loading} = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        control,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        criteriaMode: 'all',
    });

    const recaptchaRef = useRef<ReCaptchaFieldHandle>(null);
    const values = useWatch({ control });
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "username",
      "password",
      "confirm_password",
      "recaptcha",
    ];
    const enabled = useButtonEnablement(values, errors, requiredFields);

    const onSubmit: SubmitHandler<RegisterFormData> = async (data: RegisterFormData) => {
        signup(data)
    }

    return (
            <div className={styles.container}>
            <div className={` ${styles.form_container} ${register_styles.form_container}`}>
                <h2>Crear Cuenta</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)} className={register_styles.form}>
                    <FormField<RegisterFormData>
                        label='Nombres'
                        id="first_name"
                        type="text"
                        register={register}
                        error={errors.first_name}
                    />
                    <FormField<RegisterFormData>
                        label='Apellidos'
                        id="last_name"
                        type="text"
                        register={register}
                        error={errors.last_name}
                    />
                    <FormField<RegisterFormData>
                        label='Usuario'
                        id="username"
                        type="text"
                        register={register}
                        error={errors.username}
                    />
                    <FormField<RegisterFormData>
                        label='Correo'
                        id="email"
                        type="text"
                        register={register}
                        error={errors.email}
                    />
                    <FormField<RegisterFormData>
                        label='Contraseña'
                        id='password'
                        type='password'
                        register={register}
                        error={errors.password}
                    />
                    <FormField<RegisterFormData>
                        label='Confirma la contraseña'
                        id="confirm_password"
                        type="password"
                        register={register}
                        error={errors.confirm_password}
                    />

                    <ReCaptchaField<RegisterFormData>
                        ref={recaptchaRef}
                        name="recaptcha"
                        setValue={setValue}
                        trigger={trigger}
                        errors={errors.recaptcha}
                        className={register_styles.recaptcha}
                    />
                    <div className={`${styles.button_container} ${register_styles.button_container}`}>
                        <Button
                            action="auth"
                            content="Registrarse"
                            content_loading="Registrandose..."
                            loading={loading}
                            enabled={enabled}
                        />
                    </div>

                </AppForm>
                <div>
                    <p className={styles.text}>¿Ya tienes una cuenta? <a className={styles.link} href="/login">Inicia sesión aquí</a></p>
                </div>
            </div>
            </div>
    )
}

export default RegisterPage;