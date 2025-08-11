import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateAuthorFormData, updateAuthorSchema } from "@/schemas/authors";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import TextArea from "@/components/ui/TextArea/TextArea";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import useFormChanges from "@/hooks/useFormChanges";
import { useState } from "react";
import { updateAuthorRequest } from "@/services/authors";
import type { UUID } from "crypto"; // usa string si no tienes UUID real

type UpdateAuthorProps = {
  id: UUID;
  onSuccess: () => void;
  initialData?: Partial<UpdateAuthorFormData>;
};

export default function UpdateAuthor({
  id,
  onSuccess,
  initialData
}: Readonly<UpdateAuthorProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    watch
  } = useForm<UpdateAuthorFormData>({
    resolver: zodResolver(updateAuthorSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...initialData
    }
  });

  const values = useWatch({ control });

  // Campos requeridos para habilitar el botón, ajusta si quieres
  const requiredFields = ["first_name", "last_name"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const { getChangedFields, changedCount } = useFormChanges({
    watch,
    dirtyFields
  });

  const onSubmit: SubmitHandler<UpdateAuthorFormData> = async () => {
    try {
      if (changedCount === 0) return;
      setLoading(true);
      const data = getChangedFields();
      const result = await updateAuthorRequest(id, data);
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
        <h2>Editar Autor</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<UpdateAuthorFormData>
            label="Nombre"
            id="first_name"
            type="text"
            register={register}
            error={errors.first_name}
          />
          <FormField<UpdateAuthorFormData>
            label="Apellido"
            id="last_name"
            type="text"
            register={register}
            error={errors.last_name}
          />
          <FormField<UpdateAuthorFormData>
            label="Seudónimo"
            id="pseudonym"
            type="text"
            register={register}
            error={errors.pseudonym}
          />
          <FormField<UpdateAuthorFormData>
            label="Foto (URL)"
            id="photo"
            type="text"
            register={register}
            error={errors.photo}
          />
          <FormField<UpdateAuthorFormData>
            label="Fecha de Nacimiento"
            id="birth_date"
            type="date"
            register={register}
            error={errors.birth_date}
          />
          <TextArea<UpdateAuthorFormData>
            label="Biografía"
            id="biography"
            register={register}
            error={errors.biography}
          />
          <FormField<UpdateAuthorFormData>
            label="Nacionalidad"
            id="nationality"
            type="text"
            register={register}
            error={errors.nationality}
          />
          <div className={styles.button_container}>
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
