import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateAuthorFormData, createAuthorSchema } from "@/schemas/authors";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import TextArea from "@/components/ui/TextArea/TextArea";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import { useState } from "react";
import { createAuthorRequest } from "@/services/authors";

type CreateAuthorProps = {
  onSuccess: () => void;
};

export default function CreateAuthor({ onSuccess }: Readonly<CreateAuthorProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateAuthorFormData>({
    resolver: zodResolver(createAuthorSchema),
    mode: "onBlur",
    criteriaMode: "all"
  });

  const values = useWatch({ control });

  // Define los campos obligatorios para habilitar el botón
  const requiredFields = ["first_name", "last_name"];

  const enabled = useButtonEnablement(values, errors, requiredFields);

  const onSubmit: SubmitHandler<CreateAuthorFormData> = async (data) => {
    try {
      setLoading(true);
      const result = await createAuthorRequest(data);
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
      <div className={styles.form_container}>
        <h2>Crear Autor</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<CreateAuthorFormData>
            label="Nombre"
            id="first_name"
            type="text"
            register={register}
            error={errors.first_name}
          />
          <FormField<CreateAuthorFormData>
            label="Apellido"
            id="last_name"
            type="text"
            register={register}
            error={errors.last_name}
          />
          <FormField<CreateAuthorFormData>
            label="Seudónimo"
            id="pseudonym"
            type="text"
            register={register}
            error={errors.pseudonym}
          />
          <FormField<CreateAuthorFormData>
            label="Foto (URL)"
            id="photo"
            type="text"
            register={register}
            error={errors.photo}
          />
          <FormField<CreateAuthorFormData>
            label="Fecha de Nacimiento"
            id="birth_date"
            type="date"
            register={register}
            error={errors.birth_date}
          />
          <TextArea<CreateAuthorFormData>
            label="Biografía"
            id="biography"
            register={register}
            error={errors.biography}
          />
          <FormField<CreateAuthorFormData>
            label="Nacionalidad"
            id="nationality"
            type="text"
            register={register}
            error={errors.nationality}
          />
          <div className={styles.button_container}>
            <Button
              action="create"
              content="Crear"
              content_loading="Creando..."
              loading={loading}
              enabled={enabled}
            />
          </div>
        </AppForm>
      </div>
    </div>
  );
}
