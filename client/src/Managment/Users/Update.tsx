import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserFromAdminSchema, type UpdateUserFromAdminFormData } from "../../schemas/admin";
import AppForm from "../../components/ui/Form/Form";
import FormField from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import styles from "../../styles/Form.module.css";
import register_styles from "../../Pages/Register/Register.module.css";
import { useState } from "react";
import { updateUserRequest } from "../../services/admin";
import SelectField from "../../components/ui/SelectField/SelectField";
import { useButtonEnablement } from "../../hooks/useButtonEnablement";
import useFormChanges from "@/hooks/useFormChanges";
import type { UUID } from "crypto"; // o usa `string` si UUID es alias

type UpdateUserProps = {
  id: UUID;
  onSuccess: () => void;
  initialData?: Partial<UpdateUserFromAdminFormData>;
};

const rolesOptions = [
  { value: "admin", label: "Administrador" },
  { value: "librarian", label: "Bibliotecario" },
  { value: "user", label: "Usuario" }
];

export default function UpdateUser({ id, onSuccess, initialData }: Readonly<UpdateUserProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    watch
  } = useForm<UpdateUserFromAdminFormData>({
    resolver: zodResolver(updateUserFromAdminSchema),
    mode: "onBlur",
    criteriaMode: 'all',
    defaultValues: {
      ...initialData,
      role: initialData?.role ?? 'user'
    }
  });

  const values = useWatch({ control });

  const requiredFields = ["username", "email"]; // ajusta según tus reglas de habilitación
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const {getChangedFields, changedCount} = useFormChanges({watch, dirtyFields})

  const onSubmit: SubmitHandler<UpdateUserFromAdminFormData> = async () => {
    try {
      if (changedCount === 0) return;
      setLoading(true);
      const data = getChangedFields()
      const result = await updateUserRequest(id, data);
      console.log(result);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.form_container} ${register_styles.form_container}`}>
        <h2>Editar Usuario</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)} className={register_styles.form}>
          <FormField<UpdateUserFromAdminFormData>
            label="Nombre"
            id="first_name"
            type="text"
            register={register}
            error={errors.first_name}
          />
          <FormField<UpdateUserFromAdminFormData>
            label="Apellido"
            id="last_name"
            type="text"
            register={register}
            error={errors.last_name}
          />
          <FormField<UpdateUserFromAdminFormData>
            label="Usuario"
            id="username"
            type="text"
            register={register}
            error={errors.username}
          />
          <FormField<UpdateUserFromAdminFormData>
            label="Correo"
            id="email"
            type="text"
            register={register}
            error={errors.email}
          />

          <SelectField<UpdateUserFromAdminFormData>
            label="Rol"
            id="role"
            register={register}
            error={errors.role}
            options={rolesOptions}
          />

          <div className={`${styles.button_container} ${register_styles.button_container}`}>
            <Button
              action="update"
              content="Actualizar"
              content_loading="Actualizando..."
              loading={loading}
              enabled={enabled}
            />
          </div>
        </AppForm>
      </div>
    </div>
  );
}
