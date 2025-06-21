import { type SubmitHandler, useForm, useWatch  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateUserFromAdminFormData, createUserFromAdminSchema } from "../../schemas/admin";
import AppForm from "../../components/ui/Form/Form";
import FormField from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import styles from "../../styles/Form.module.css"
import register_styles from "../../Pages/Register/Register.module.css"
import { useButtonEnablement } from "../../hooks/useButtonEnablement";
import { useState } from "react";
import { createUserRequest } from "../../services/admin";
import SelectField from "../../components/ui/SelectField/SelectField";

type CreateUserProps = {
  onSuccess: () => void;
};

const rolesOptions = [
  { value: "admin", label: "Administrador" },
  { value: "librarian", label: "Bibliotecario" },
  { value: "user", label: "Usuario" }
];

function CreateUser( {onSuccess}: Readonly<CreateUserProps>) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateUserFromAdminFormData>({
        resolver: zodResolver(createUserFromAdminSchema),
        mode: "onBlur",
        criteriaMode: 'all',
        defaultValues: {
            role: 'user'
        }
    });

    const values = useWatch({ control });
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "username",
      "password",
      "confirm_password",
    ];
    const enabled = useButtonEnablement(values, errors, requiredFields);

    const onSubmit: SubmitHandler<CreateUserFromAdminFormData> = async (data) => {
        try {
            setLoading(true)
            const result = await createUserRequest(data)
            console.log(result)
            onSuccess()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
            <div className={styles.container}>
            <div className={` ${styles.form_container} ${register_styles.form_container}`}>
                <h2>Crear Cuenta</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)} className={register_styles.form}>
                    <FormField<CreateUserFromAdminFormData>
                        label='Nombres'
                        id="first_name"
                        type="text"
                        register={register}
                        error={errors.first_name}
                    />
                    <FormField<CreateUserFromAdminFormData>
                        label='Apellidos'
                        id="last_name"
                        type="text"
                        register={register}
                        error={errors.last_name}
                    />
                    <FormField<CreateUserFromAdminFormData>
                        label='Usuario'
                        id="username"
                        type="text"
                        register={register}
                        error={errors.username}
                    />
                    <FormField<CreateUserFromAdminFormData>
                        label='Correo'
                        id="email"
                        type="text"
                        register={register}
                        error={errors.email}
                    />
                    <FormField<CreateUserFromAdminFormData>
                        label='Contraseña'
                        id='password'
                        type='password'
                        register={register}
                        error={errors.password}
                    />
                    <FormField<CreateUserFromAdminFormData>
                        label='Confirma la contraseña'
                        id="confirm_password"
                        type="password"
                        register={register}
                        error={errors.confirm_password}
                    />
                    
                    <SelectField<CreateUserFromAdminFormData>
                      label="Rol"
                      id="role"
                      register={register}
                      error={errors.role}
                      options={rolesOptions}
                    />

                    <div className={`${styles.button_container} ${register_styles.button_container}`}>
                        <Button
                            action="auth"
                            content="Crear"
                            content_loading="Creando..."
                            loading={loading}
                            enabled={enabled}
                        />
                    </div>

                </AppForm>
            </div>
            </div>
    )
}

export default CreateUser;