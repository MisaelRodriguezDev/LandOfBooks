import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateGenreFormData, updateGenreSchema } from "@/schemas/genres";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import TextArea from "@/components/ui/TextArea/TextArea";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import useFormChanges from "@/hooks/useFormChanges";
import { useState } from "react";
import { updateGenreRequest } from "@/services/genres";
import type { UUID } from "crypto"; // o usa string si no usas UUID real

type UpdateGenreProps = {
  id: UUID;
  onSuccess: () => void;
  initialData?: Partial<UpdateGenreFormData>;
};

export default function UpdateGenre({
  id,
  onSuccess,
  initialData
}: Readonly<UpdateGenreProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    watch
  } = useForm<UpdateGenreFormData>({
    resolver: zodResolver(updateGenreSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...initialData
    }
  });

  const values = useWatch({ control });
  const requiredFields = ["name"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const { getChangedFields, changedCount } = useFormChanges({
    watch,
    dirtyFields
  });

  const onSubmit: SubmitHandler<UpdateGenreFormData> = async () => {
    try {
      if (changedCount === 0) return;
      setLoading(true);
      const data = getChangedFields();
      const result = await updateGenreRequest(id, data);
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
        <h2>Editar Género</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<UpdateGenreFormData>
            label="Nombre"
            id="name"
            type="text"
            register={register}
            error={errors.name}
          />
          <TextArea<UpdateGenreFormData>
            label="Descripción"
            id="description"
            register={register}
            error={errors.description}
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
